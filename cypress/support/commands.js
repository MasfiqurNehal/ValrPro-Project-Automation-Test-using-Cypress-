import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import SubscriptionModal from "../pages/SubscriptionModal";
import ClaimsPage from "../pages/ClaimsPage";
import PreScreeningFormPage from "../pages/PreScreeningFormPage";
import stripeSelectors from "../pages/StripeCheckoutPage";

Cypress.Commands.add("getAccount", () => {
  const envEmail = Cypress.env("accountEmail");
  const envPassword = Cypress.env("accountPassword");

  if (envEmail && envPassword) {
    return cy.wrap({
      id: Cypress.env("accountId") || envEmail,
      email: envEmail,
      password: envPassword,
    });
  }

  return cy.fixture("accounts").then((accounts) => accounts[0]);
});

Cypress.Commands.add("login", (email, password) => {
  cy.session(
    email,
    () => {
      LandingPage.visit().goToLogin();
      LoginPage.login(email, password);
      cy.url().should("include", "/dashboard");
    },
    { cacheAcrossSpecs: true }
  );
  cy.visit("/dashboard");
});

Cypress.Commands.add("closeOnboardingModal", () => {
  DashboardPage.closeOnboardingModalIfPresent();
});

Cypress.Commands.add("fillStripeCheckout", (card) => {
  cy.origin(
    "https://checkout.stripe.com",
    { args: { card, selectors: stripeSelectors } },
    ({ card, selectors }) => {
      // Stripe Checkout loads asynchronously and the payment fields are not
      // ready as soon as the URL changes, so wait for the real form shell.
      cy.contains("Contact information", { timeout: 60000 }).should("be.visible");
      cy.contains("Payment method", { timeout: 60000 }).should("be.visible");
      cy.contains("Card information", { timeout: 60000 }).should("be.visible");

      cy.get(selectors.cardNumberInput, { timeout: 20000 }).should("be.visible");
      cy.get(selectors.cardNumberInput).type(card.number, { delay: 0 });
      cy.get(selectors.expiryInput).type(card.expiry, { delay: 0 });
      cy.get(selectors.cvcInput).type(card.cvc, { delay: 0 });
      cy.get(selectors.cardholderNameInput).type(card.name, { delay: 0 });
      cy.get(selectors.countrySelect).select(card.country);
      cy.get(selectors.subscribeButton).should("be.enabled").click();
    }
  );
  cy.url({ timeout: 30000 }).should("include", "/dashboard");
});

Cypress.Commands.add("subscribeToPlan", (plan = "basic") => {
  DashboardPage.openPlanPicker();
  SubscriptionModal.subscribeTo(plan);
  cy.fixture("testData/card").then((card) => cy.fillStripeCheckout(card));
  DashboardPage.assertSubscriptionActive();
});

Cypress.Commands.add("startNewClaim", () => {
  DashboardPage.clickStartNewClaim();
  ClaimsPage.continueToClaim();
  PreScreeningFormPage.assertLoaded();
});
