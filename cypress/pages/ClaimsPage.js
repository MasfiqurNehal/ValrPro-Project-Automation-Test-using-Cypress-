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
    return this;
  }
}

export default new ClaimsPage();
