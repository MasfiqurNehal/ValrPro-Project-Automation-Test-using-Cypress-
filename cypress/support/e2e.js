import "cypress-mochawesome-reporter/register";
import { formatLogEntry, getTestTitle } from "./logger";
import "./commands";

before(function () {
  cy.task(
    "logger:append",
    formatLogEntry({
      event: "SPEC_START",
      spec: Cypress.spec.relative,
      details: {
        browser: Cypress.browser.name,
        baseUrl: Cypress.config("baseUrl"),
      },
    }),
    { log: false }
  );
});

after(function () {
  cy.task(
    "logger:append",
    formatLogEntry({
      event: "SPEC_END",
      spec: Cypress.spec.relative,
    }),
    { log: false }
  );
});

beforeEach(function () {
  cy.task(
    "logger:append",
    formatLogEntry({
      event: "TEST_START",
      spec: Cypress.spec.relative,
      test: getTestTitle(this.currentTest),
    }),
    { log: false }
  );
});

afterEach(function () {
  cy.task(
    "logger:append",
    formatLogEntry({
      event: "TEST_END",
      spec: Cypress.spec.relative,
      test: getTestTitle(this.currentTest),
      details: {
        state: this.currentTest && this.currentTest.state,
        duration: this.currentTest && this.currentTest.duration,
      },
    }),
    { log: false }
  );
});
