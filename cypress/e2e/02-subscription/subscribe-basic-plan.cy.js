import DashboardPage from "../../pages/DashboardPage";

const stripeSelectors = {
  cardNumberInput:
    'input[placeholder="1234 1234 1234 1234"], input[name="cardnumber"], input[autocomplete="cc-number"]',
  expiryInput: 'input[placeholder="MM / YY"], input[name="exp-date"], input[autocomplete="cc-exp"]',
  cvcInput: 'input[placeholder="CVC"], input[name="cvc"], input[autocomplete="cc-csc"]',
  cardholderNameInput: 'input[placeholder="Full name on card"], input[name="billingName"]',
  countrySelect: 'select#billingCountry, select[name="country"]',
  subscribeButton: 'button[type="submit"]',
};

function failIfStripeIsBlocked() {
  return cy.location("href", { timeout: 60000 }).then((href) => {
    const blocked = /hcaptcha|api\.hcaptcha\.com|captcha/i.test(href);

    if (blocked) {
      throw new Error(
        `Stripe Checkout was replaced by an hCaptcha/bot-protection page instead of the payment form. ` +
        `That means Cypress cannot reach the normal Stripe sandbox UI from this environment. ` +
        `Open the checkout manually and whitelist the test route, disable bot protection for staging, or use a test-only subscription API flow. ` +
        `Current URL: ${href}`
      );
    }
  });
}

describe("Subscription", () => {
  it("TC-SUB-001: subscribes to the Basic plan via Stripe test checkout", () => {
    cy.getAccount().then((account) => {
      cy.login(account.email, account.password);
    });

    cy.closeOnboardingModal();

    DashboardPage.openPlanPicker();
    cy.contains("CLAIM YOUR VETERAN PLAN").should("be.visible");
    cy.contains("button", "SUBSCRIBE").click();
    cy.wait(7000);

    cy.origin(
      "https://checkout.stripe.com",
      { args: { stripeSelectors } },
      ({ stripeSelectors }) => {
        cy.location("href", { timeout: 60000 }).then((href) => {
          if (/hcaptcha|api\.hcaptcha\.com|captcha/i.test(href)) {
            throw new Error(
              `Stripe Checkout was replaced by an hCaptcha/bot-protection page instead of the payment form. ` +
              `That means Cypress cannot reach the normal Stripe sandbox UI from this environment. ` +
              `Open the checkout manually and whitelist the test route, disable bot protection for staging, or use a test-only subscription API flow. ` +
              `Current URL: ${href}`
            );
          }
        });

        cy.contains("Contact information", { timeout: 60000 }).should("be.visible");
        cy.contains("Payment method", { timeout: 60000 }).should("be.visible");
        cy.contains("Card information", { timeout: 60000 }).should("be.visible");

        // Stripe hosts the actual card inputs inside nested iframes, so we
        // search for the field in any available frame and type into that body.
        const getField = (selector) =>
          cy.get("iframe", { timeout: 60000 }).then(($iframes) => {
            const matchingFrame = [...$iframes].find((frame) => {
              const body = frame.contentDocument && frame.contentDocument.body;
              return body && body.querySelector(selector);
            });

            expect(matchingFrame, `Stripe iframe containing ${selector}`).to.exist;
            return cy.wrap(matchingFrame.contentDocument.body, { log: false }).find(selector, { timeout: 30000 }).first();
          });

        getField(stripeSelectors.cardNumberInput).should("be.visible").click().type("4242 4242 4242 4242", { delay: 0 });
        getField(stripeSelectors.expiryInput).should("be.visible").click().type("1130", { delay: 0 });
        getField(stripeSelectors.cvcInput).should("be.visible").click().type("123", { delay: 0 });
        getField(stripeSelectors.cardholderNameInput).should("be.visible").click().type("AlexgenderTester", { delay: 0 });
        getField(stripeSelectors.countrySelect).should("be.visible").select("Bangladesh");

        cy.get(stripeSelectors.subscribeButton, { timeout: 30000 }).should("be.enabled").click();
      }
    );

    cy.url({ timeout: 60000 }).should("include", "/dashboard");
    DashboardPage.assertSubscriptionActive();
    DashboardPage.lastPaymentAmount.should("contain", "69.99");
  });
});
