class ClaimsPage {
  get vaConnectionModalTitle() {
    return cy.contains("VA Connection & Verification");
  }

  get continueToClaimButton() {
    return cy.contains('button, a, [role="button"]', /Continue to Claim/i);
  }

  continueToClaim() {
    this.vaConnectionModalTitle.should("be.visible");
    this.continueToClaimButton.scrollIntoView().should("be.visible").click();
    this.closeHeadToToeAssessmentIfPresent();
    return this;
  }

  closeHeadToToeAssessmentIfPresent(deadline = Date.now() + 8000) {
    cy.get("body").then(($body) => {
      const hasHeadToToeModal = /Welcome to Head-to-Toe Assessment/i.test($body.text());
      const closeButton = $body
        .find('button, a, [role="button"]')
        .filter((_, element) => /^Close$/i.test((element.textContent || "").trim()))
        .first();

      if (hasHeadToToeModal && closeButton.length) {
        cy.wrap(closeButton)
          .should("be.visible")
          .click({ force: true });
        cy.contains("Welcome to Head-to-Toe Assessment", { timeout: 2000 }).should("not.exist");
      } else if (Date.now() < deadline) {
        cy.wait(250);
        this.closeHeadToToeAssessmentIfPresent(deadline);
      }
    });

    return this;
  }
}

export default new ClaimsPage();
