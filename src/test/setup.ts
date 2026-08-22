import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// vitest runs without `globals`, so Testing Library never registers its own
// auto-cleanup: without this, renders pile up across tests in the same file.
afterEach(cleanup)
