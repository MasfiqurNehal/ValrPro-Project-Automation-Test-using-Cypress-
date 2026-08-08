class DashboardPage {
  get onboardingModalCloseButton() {
    return cy.get('button[aria-label="Close onboarding"]');
  }

  // The onboarding modal renders asynchronously after the dashboard mounts
  // (the app checks server-side whether the tutorial was already seen), so a
  // single synchronous DOM check races it. Poll for a short window instead.
  closeOnboardingModalIfPresent(deadline = Date.now() + 6000) {
    const closeSelector = 'button[aria-label="Close onboarding"]';
    cy.get("body").then(($body) => {
      if ($body.find(closeSelector).length) {
        cy.get(closeSelector).click();
        cy.get('[role="dialog"]').should("not.exist");
      } else if (Date.now() < deadline) {
        cy.wait(250);
        this.closeOnboardingModalIfPresent(deadline);
      }
    });
    return this;
  }

  get secureVeteranPlanButton() {
    return cy.contains("button, a", "Secure Your Veteran Plan");
  }

  openPlanPicker() {
    this.secureVeteranPlanButton.click();
    return this;
  }

  get startNewClaimButton() {
    return cy.contains('button, a, [role="button"]', /START A NEW CLAIM/i);
  }

  clickStartNewClaim() {
    this.startNewClaimButton.scrollIntoView().should("be.visible").click();
    return this;
  }

  get lastPaymentAmount() {
    return cy.contains("LAST PAYMENT").parent().find("h3, h2, div");
  }

  assertSubscriptionActive() {
    cy.url().should("include", "/dashboard");
    cy.contains("Update Plan").should("be.visible");
    return this;
  }
}

export default new DashboardPage();
