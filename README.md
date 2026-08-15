# ValrPro Cypress Automation Tests

This repository contains the Cypress end-to-end test suite for the VALRPRO staging application.

It covers the main user journeys for the staging environment:

- Authentication and dashboard access
- Subscription flow through Stripe Checkout
- Starting a new claim and completing the pre-screening flow

## Tech Stack

- Cypress 15
- JavaScript
- Cypress Mochawesome Reporter

## Project Structure

```text
cypress/
  e2e/             # Test specs
  fixtures/        # Test data and account data
  pages/           # Page objects and UI selectors
  support/         # Custom Cypress commands and setup
scripts/           # Utility scripts
```

## Prerequisites

- A recent Node.js LTS version
- npm
- Access to the VALRPRO staging application

## Install

From the project root:

```bash
npm install
```

## Local Files You Must Create

Some files are intentionally ignored by Git because they may contain secrets, machine-specific settings, or generated output.

After cloning this repository, create these files locally:

- `cypress.env.json`
- `cypress/fixtures/accounts.json`

You can use the example files that are committed to the repo:

- `cypress.env.example.json`
- `cypress/fixtures/accounts.example.json`

Copy each example file to its real filename and replace the placeholder values with your real test credentials.

In PowerShell, you can do that with:

```powershell
Copy-Item cypress.env.example.json cypress.env.json
Copy-Item cypress/fixtures/accounts.example.json cypress/fixtures/accounts.json
```

### Environment Variables

The tests read these Cypress env keys:

- `accountEmail`
- `accountPassword`
- `accountId`

For compatibility, the suite also accepts the older names:

- `valrEmail`
- `valrPassword`
- `valrId`

If `accountEmail` and `accountPassword` are provided, they are used first.

### Account Fixture

The multi-account script reads `cypress/fixtures/accounts.json` and expects entries like this:

```json
[
  {
    "id": "acct-001",
    "email": "test.user@example.com",
    "password": "your-password"
  }
]
```

## Running Tests

### Open Cypress UI

```bash
npm run cy:open
```

### Run All Tests Headlessly

```bash
npm run cy:run
```

### Run the Multi-Account Script

```bash
npm run test:accounts
```

This script loops through every entry in `cypress/fixtures/accounts.json` and runs the Cypress suite for each account.

## Configuration

The Cypress base URL is configured in `cypress.config.js`:

`https://stage-veteran.valr.me/`

If the staging site changes, update the base URL there.

The Cypress config also enables:

- Videos for test runs
- Screenshots on failure
- Mochawesome HTML reports in `cypress/reports`
- A custom logger file at `logger.txt`

## Test Coverage

### Authentication

Verifies that a user can log in and land on the dashboard.

### Subscription

Verifies the basic plan subscription flow through Stripe Checkout.

### Claims

Verifies starting a new claim and moving through the pre-screening form.

## Generated Output

These folders and files are created when tests run and are intentionally ignored:

- `cypress/screenshots/`
- `cypress/videos/`
- `cypress/downloads/`
- `cypress/reports/`
- `mochawesome-report/`
- `logger.txt`
- `debug.log`

## Notes

- Stripe Checkout is a cross-origin flow, so the Cypress config disables `chromeWebSecurity` to reach the embedded Stripe form.
- If Stripe shows bot protection or hCaptcha instead of the expected checkout form, the subscription test cannot continue from that environment.
- The test data in `cypress/fixtures/testData/` is used by the claim flow and the Stripe card form.

## Quick Start For A New Clone

1. Clone the repository.
2. Run `npm install`.
3. Copy `cypress.env.example.json` to `cypress.env.json` and add your credentials.
4. Copy `cypress/fixtures/accounts.example.json` to `cypress/fixtures/accounts.json` and add your test accounts.
5. Run `npm run cy:open`, `npm run cy:run`, or `npm run test:accounts`.
