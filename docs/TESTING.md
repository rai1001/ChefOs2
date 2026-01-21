# Testing Strategy

## Overview
CulinaryOS uses a multi-layered testing strategy to ensure reliability and correctness.
- **Unit & Integration**: Vitest
- **API Integration**: Supertest
- **End-to-End (E2E)**: Playwright
- **CI/CD**: GitHub Actions

## 1. Backend Testing (`/backend`)

### Technology Stack
- **Runner**: [Vitest](https://vitest.dev/) (Fast, compatible with Jest)
- **HTTP Assertions**: [Supertest](https://github.com/ladjs/supertest)
- **Mocking**: Native Vitest mocks (`vi.mock`)

### Structure
- `tests/unit/`: Logic isolation (e.g., specific calculations, service methods).
- `tests/integration/`: API route testing with a real (or Dockerized) test database.

### Running Tests
```bash
cd backend
npm run test        # Run all tests
npm run test:watch  # Run in watch mode
npm run test:cov    # Generate coverage report
```

### Best Practices
- **Isolation**: Integration tests should clean up their data (using transactions or truncation) after execution.
- **Mocking**: Mock external services (Email, Stripe) to avoid side effects.

---

## 2. Frontend Testing (`/frontend`)

### Technology Stack
- **Runner**: Vitest
- **Component Testing**: React Testing Library
- **E2E**: Playwright

### Structure
- `src/**/*.test.tsx`: Co-located component tests.
- `e2e/`: Full browser automation scenarios.

### Running Tests
```bash
cd frontend
npm run test        # Unit/Component tests
npm run test:e2e    # Run Playwright scenarios
```

### Key Scenarios (E2E)
- User Login/Registration.
- Creating a Supplier.
- Generating a Purchase Order.
- Kitchen Mode View.

---

## 3. CI/CD Integration
All tests are automatically executed via GitHub Actions on every Pull Request.
- **Job 1**: Backend Lint & Test
- **Job 2**: Frontend Lint & Test
- **Job 3**: E2E Smoke Tests (Staging)

A PR cannot be merged if any test fails.
