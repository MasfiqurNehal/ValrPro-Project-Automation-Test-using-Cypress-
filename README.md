# VALRPRO Cypress E2E Test Suite

This repository contains the Cypress end-to-end test suite for the VALRPRO staging application.

It automates the main user journeys for the staging environment:

- Authentication and dashboard access
- Subscription flow through Stripe Checkout
- Starting a new claim and completing the pre-screening flow

## Overview

The project is organized as a Cypress page-object test suite. Test specs live under `cypress/e2e`, shared helpers and custom commands live under `cypress/support`, and reusable page objects live under `cypress/pages`.

The suite is configured for the staging site:

- `https://staging-veteran.valr.me/`

## Tech Stack

- Cypress 15
- JavaScript
- Cypress Mochawesome Reporter

## Repository Structure

```text
cypress/
  e2e/             # End-to-end specs
  fixtures/        # Test data, credentials examples, and account data
  pages/           # Page objects and reusable UI actions
  support/         # Custom Cypress commands and lifecycle hooks
scripts/           # Utility scripts
```

## Prerequisites

- Node.js LTS
- npm
- Access to the VALRPRO staging application

## Install

From a fresh clone, install dependencies from the project root:

```bash
npm install
```

## First-Time Local Setup

This project expects a couple of local-only files that are intentionally not meant to be committed.

Create them by copying the example files:

```powershell
Copy-Item cypress.env.example.json cypress.env.json
Copy-Item cypress/fixtures/accounts.example.json cypress/fixtures/accounts.json
```

Then update the copied files with your real values.

### 1. `cypress/fixtures/accounts.json`

This file is the primary source for login credentials used by the tests.

Example:

```json
[{
  "id": "acct-001",
  "email": "test.user@example.com",
  "password": "your-real-password"
}]
```

Use the email and password values from this file for login, subscription, and claim flows.

### 2. `cypress.env.json`

This file is optional.

It is only needed if you want to:

- choose a specific account from `cypress/fixtures/accounts.json` by setting `accountId`
- keep older env-based credentials as a fallback if `accounts.json` is missing

Example:

```json
{
  "accountId": "acct-001"
}
```

If `cypress.env.json` is not present, the suite will still use `cypress/fixtures/accounts.json`.

## Project Configuration

The Cypress base URL is defined in `cypress.config.js`:

```text
https://staging-veteran.valr.me/
```

The config also enables:

- Videos for test runs
- Screenshots on failure
- Mochawesome HTML reports in `cypress/reports`
- A custom run log in `logger.txt`
- `chromeWebSecurity: false` so the suite can interact with Stripe Checkout's nested iframe flow

If the staging site changes, update the base URL in `cypress.config.js`.

## Test Coverage

### 01 Authentication

Verifies that a user can log in and land on the dashboard using the account from `cypress/fixtures/accounts.json`.

### 02 Subscription

Verifies the basic plan subscription flow through Stripe test checkout.

### 03 Claims

Verifies the full claim creation flow, including the pre-screening steps and the later claim form steps.

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

This script reads `cypress/fixtures/accounts.json`, then runs the Cypress suite once for each account in that file.

## Fixtures and Test Data

The claim flow uses the following fixture files:

- `cypress/fixtures/testData/claimData.json`
- `cypress/fixtures/testData/card.json`

The Stripe card fixture is for test checkout data only.

## Shared Cypress Helpers

The suite includes reusable helpers for:

- Logging into the application
- Dismissing onboarding and claim popups
- Filling the Stripe test checkout
- Moving through the claim flow

These helpers live in `cypress/support/commands.js` and the page objects under `cypress/pages`.

## Generated Output

These files and folders are created during test runs and are intentionally ignored:

- `cypress/screenshots/`
- `cypress/videos/`
- `cypress/downloads/`
- `cypress/reports/`
- `logger.txt`
- `debug.log`

## Troubleshooting

- If `npm install` has already been completed but Cypress still will not launch, make sure the Cypress binary finished installing correctly.
- If PowerShell blocks `npm` with an execution policy error on Windows, try running the command in Command Prompt, Git Bash, or use `npm.cmd` in PowerShell.
- If Stripe Checkout shows bot protection or hCaptcha instead of the expected checkout form, the subscription test cannot continue from that environment.
- If you change the staging domain, update `baseUrl` in `cypress.config.js` first.

## Notes for Contributors

- Keep secrets and account credentials out of Git history.
- Update the example files whenever you add a new required local setting.
- If you add new major flows, document them here so the next developer knows how the suite is organized.
