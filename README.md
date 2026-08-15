# VALRPRO Cypress E2E Test Suite

This repository contains the Cypress end-to-end test suite for the VALRPRO staging application.

It covers the main user journeys for the staging environment:

- Authentication and dashboard access
- Subscription flow through Stripe Checkout
- Starting a new claim and completing the pre-screening flow

## What This Project Is

This is a Cypress page-object test suite. The repository is organized so that:

- test specs live in `cypress/e2e`
- reusable page objects live in `cypress/pages`
- custom Cypress commands and hooks live in `cypress/support`
- test fixtures and example credential files live in `cypress/fixtures`

The tests are configured to run against:

- `https://staging-veteran.valr.me/`

## Requirements For A New Windows PC

Before running the project, install:

- Node.js LTS
- npm
- Google Chrome

If PowerShell blocks `npm`, use `npm.cmd` instead of `npm`.

## Clone The Repository

On a new computer:

```bash
git clone https://github.com/MasfiqurNehal/ValrPro-Project-Automation-Test-using-Cypress-.git
cd ValrPro-Project-Automation-Test-using-Cypress-
```

If you already downloaded the project as a zip file, open the extracted folder instead.

## Install Dependencies

From the project root:

```bash
npm install
```

If PowerShell gives an execution policy error, run:

```powershell
npm.cmd install
```

## First-Time Local Setup

This project needs a couple of local files that are not meant to be committed.

Copy the example files after cloning:

```powershell
Copy-Item cypress.env.example.json cypress.env.json
Copy-Item cypress/fixtures/accounts.example.json cypress/fixtures/accounts.json
```

Then edit the copied files with real values.

### 1. `cypress/fixtures/accounts.json`

This is the primary login credential file used by the tests.

Example:

```json
[
  {
    "id": "acct-001",
    "email": "test.user@example.com",
    "password": "your-real-password"
  }
]
```

Use the email and password in this file for the login, subscription, and claim flows.

If you have more than one test account, add more objects to the array.

### 2. `cypress.env.json`

This file is optional.

It is only needed if you want to:

- select a specific account from `cypress/fixtures/accounts.json` by setting `accountId`
- keep older env-based credentials as a fallback

Example:

```json
{
  "accountId": "acct-001"
}
```

If `cypress.env.json` is missing, the suite still works as long as `cypress/fixtures/accounts.json` exists.

## Project Structure

```text
cypress/
  e2e/             # End-to-end specs
  fixtures/         # Test data, example credentials, account data
  pages/           # Page objects and reusable UI actions
  support/         # Custom Cypress commands and lifecycle hooks
scripts/           # Utility scripts
```

## Main Configuration

The main Cypress configuration is in `cypress.config.js`.

Important settings:

- base URL: `https://staging-veteran.valr.me/`
- videos enabled for test runs
- screenshots enabled on failure
- Mochawesome HTML reports in `cypress/reports`
- `chromeWebSecurity: false` so Stripe Checkout can be tested

If the staging domain changes in the future, update `baseUrl` in `cypress.config.js`.

## Test Data Files

The claim flow uses these fixtures:

- `cypress/fixtures/testData/claimData.json`
- `cypress/fixtures/testData/card.json`

The Stripe card file contains test card values only.

## Running The Project

### Open Cypress UI

```bash
npm run cy:open
```

If PowerShell blocks `npm`, use:

```powershell
npm.cmd run cy:open
```

### Run All Tests Headlessly

```bash
npm run cy:run
```

### Run The Multi-Account Script

```bash
npm run test:accounts
```

This script reads `cypress/fixtures/accounts.json` and runs the Cypress suite once for each account in that file.

## What The Tests Cover

### 01 Authentication

Verifies that a user can log in and land on the dashboard using the account from `cypress/fixtures/accounts.json`.

### 02 Subscription

Verifies the basic plan subscription flow through Stripe test checkout.

### 03 Claims

Verifies the full claim creation flow, including the pre-screening steps and later claim form steps.

## Shared Helpers

The suite includes reusable Cypress helpers for:

- logging into the application
- dismissing onboarding and dashboard popups
- filling the Stripe test checkout
- moving through the claim flow

These helpers live in `cypress/support/commands.js` and the page objects under `cypress/pages`.

## Generated Output

These files and folders are created during test runs and are intentionally not committed:

- `cypress/screenshots/`
- `cypress/videos/`
- `cypress/downloads/`
- `cypress/reports/`
- `logger.txt`
- `debug.log`

## Troubleshooting

- If Cypress does not launch, confirm Node.js is installed and rerun `npm install`.
- If PowerShell blocks the npm command, use `npm.cmd`.
- If login uses the wrong account, check `cypress/fixtures/accounts.json` first.
- If you want to force a specific account when multiple accounts exist, set `accountId` in `cypress.env.json`.
- If Stripe Checkout shows bot protection or hCaptcha, the subscription test may not be able to complete from that environment.

## Notes For New Developers

1. Clone the repository.
2. Run `npm install`.
3. Copy `cypress.env.example.json` to `cypress.env.json`.
4. Copy `cypress/fixtures/accounts.example.json` to `cypress/fixtures/accounts.json`.
5. Add your real test account credentials to `cypress/fixtures/accounts.json`.
6. Run `npm run cy:open` or `npm run cy:run`.

That is the minimum setup needed to run the suite on a new Windows computer.
