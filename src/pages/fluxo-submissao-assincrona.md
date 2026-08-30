# Submissão assíncrona (card api#68)

## O problema de hoje

O `POST /chapters/{id}/submissions` roda a correção LLM inteira **dentro do request**.
A correção demora 30 a 90 segundos, e o caminho HTTP tem tetos de ~30s que não dá
para aumentar: subir o timeout da Lambda não adianta, o API Gateway corta em 30s
de qualquer jeito.

```mermaid
flowchart LR
    B[Navegador] --> V["Vercel (proxy)"]
    V --> G["API Gateway<br/>teto RÍGIDO ~30s"]
    G --> L["Lambda<br/>timeout 30s"]
    L --> C["Claude API<br/>correção: 30 a 90s"]
    C -. "não cabe em 30s" .-> X(["'Algo deu errado aqui<br/>do nosso lado.'"])

    style X fill:#7f1d1d,color:#fff
    style C fill:#78350f,color:#fff
```

A resposta HTTP precisa voltar rápido, e a correção precisa acontecer em outro lugar.

## A sequência completa do novo fluxo

```mermaid
sequenceDiagram
    autonumber
    actor A as Aluno
    participant F as Front (web)
    participant H as API (HTTP)
    participant W as API (worker)
    participant DB as Banco

    A->>F: clica "Enviar"
    F->>H: POST /chapters/{id}/submissions
    H->>H: valida (capítulo aberto? nº de palavras? limite diário?)
    H->>DB: grava submissão status="evaluating"
    H->>H: commit (linha durável ANTES do hand-off)
    H--)W: self-invoke assíncrono {task, submission_id}
    H-->>F: 202 { submission_id, status: "evaluating" }
    F-->>A: "Dona Marta está lendo..."

    par correção fora do request (timeout 120s)
        W->>DB: carrega submissão + contexto do capítulo
        W->>W: pipeline: ortografia + LLM + régua (30 a 90s)
        W->>DB: grava evaluation + scores + annotations
        W->>DB: avança o capítulo (passed / drafting / consequence)
        W->>DB: status="evaluated"
    and polling a cada ~2s
        loop até status != "evaluating"
            F->>H: GET /submissions/{id}
            H->>DB: lê status (+ resultado, se houver)
            H-->>F: "evaluating" | "evaluated" + veredito | "failed"
        end
    end

    F-->>A: placar, anotações e cena de consequência
```

## O ciclo de vida de uma submissão

```mermaid
stateDiagram-v2
    [*] --> evaluating: POST 202
    evaluating --> evaluated: worker terminou a correção
    evaluating --> failed: erro na correção<br/>(devolve o tique do limite diário)
    evaluating --> failed: mais de 3 min sem resposta<br/>(o GET a reporta como falha)
    evaluated --> [*]: front mostra o veredito
    failed --> [*]: "Tente de novo" (sem custo)
```

Nunca fica em "corrigindo" para sempre: se o worker morrer no meio, depois de
3 minutos o `GET` passa a responder `failed` e o aluno pode reenviar.

## O que o front faz com cada resposta do polling

```mermaid
flowchart TD
    P["GET /submissions/{id}"] --> S{status?}
    S -- "evaluating" --> E["espera 2s e pergunta de novo<br/>(tela da Dona Marta pensando)"]
    E --> P
    S -- "evaluated" --> R["mostra placar, anotações,<br/>para_passar, lens e chapter_status"]
    S -- "failed" --> F["'Não conseguimos corrigir. Tente de novo.'<br/>limite diário devolvido, pode reenviar"]

    style R fill:#14532d,color:#fff
    style F fill:#7f1d1d,color:#fff
```

## E no meu computador (dev local)?

Sem AWS, o dispatcher é inline: o mesmo processo corrige na hora, dentro do
próprio request, como hoje. O contrato HTTP não muda (202 + polling), só que o
primeiro `GET` já encontra o resultado pronto. O front tem UM comportamento só.

```mermaid
flowchart TD
    POST["POST .../submissions"] --> D{AWS_LAMBDA_FUNCTION_NAME<br/>existe no ambiente?}
    D -- "sim (dev/prod na AWS)" --> LA["commit -> self-invoke assíncrono -> 202<br/>correção roda em outra execução"]
    D -- "não (localhost/testes)" --> IN["corrige agora, inline (30 a 90s) -> 202<br/>primeiro GET já vem 'evaluated'"]
```

## O que muda em cada lugar

| Peça | Mudança |
|---|---|
| Banco | coluna `status` em `submissions` (`evaluating` / `evaluated` / `failed`) |
| `POST .../submissions` | não corrige mais; grava pendente e responde 202 |
| `GET /submissions/{id}` | novo endpoint de polling, escopado por usuário |
| Worker | novo entrypoint: a correção que antes vivia dentro do POST |
| Terraform | timeout 30s para 120s e permissão da Lambda invocar a si mesma |
| Front (web) | envia, mostra "lendo...", faz polling, trata `failed` |

## Regras que o assíncrono obriga a criar

1. **Capítulo aprovado nunca regride**: com duas submissões em voo, uma
   aprovação seguida de uma reprovação atrasada não pode devolver o capítulo
   para `drafting`. `passed` é estado final.
2. **Retry idempotente**: se a AWS reentregar o evento, um worker que encontra
   a submissão já `evaluated` não faz nada.
3. **Falha devolve o limite diário**: o tique das 3 correções/dia só é
   consumido por correção que aconteceu.
