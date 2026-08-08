# ValrPro Cypress Automation Tests

End-to-end Cypress test suite for the VALRPRO staging application.

This project covers the core user journeys for the staging environment:

- Authentication and dashboard access
- Subscription flow through Stripe Checkout
- Claim initiation and pre-screening navigation

## Tech Stack

- Cypress 15
- JavaScript
- Cypress Mochawesome Reporter

## Project Structure

```text
cypress/
  e2e/           # Test specs
  fixtures/      # Test data and account data
  pages/         # Page objects and UI selectors
  support/       # Custom Cypress commands and setup
scripts/         # Utility scripts
```

## Prerequisites

- Node.js 20+ recommended
- npm
- Access to the staging application

## Installation

```bash
npm install
```

## Configuration

The Cypress base URL is configured in `cypress.config.js`.

Default staging target:

```js
https://stage-veteran.valr.me
```

If you need to override account credentials, set these Cypress env values:

- `accountEmail`
- `accountPassword`
- `accountId`

## Running Tests

Open Cypress UI:

```bash
npm run cy:open
```

Run all tests headlessly:

```bash
npm run cy:run
```

Run the account loop script:

```bash
npm run test:accounts
```

## Test Coverage

### Authentication

Verifies the login flow and landing on the dashboard.

### Subscription

Verifies the basic subscription journey from dashboard to Stripe Checkout.

### Claims

Verifies the claim initiation flow and navigation to the pre-screening form.

## Notes

- Stripe Checkout is a cross-origin flow and may be affected by anti-bot protection in staging.
- The test suite includes page objects and shared Cypress commands to keep specs readable and maintainable.

## Reports

Test runs generate:

- Screenshots in `cypress/screenshots`
- Videos in `cypress/videos`
- Mochawesome reports in `cypress/reports`

## Maintainer

VALRPRO automation test project maintained for staging validation and regression coverage.
