class PreScreeningFormPage {

  assertLoaded() {
    cy.url()
      .should("include", "/form/pre_screening");

    cy.contains("Pre Screening")
      .should("be.visible");

    return this;
  }

  selectBenefitType(benefit = "Compensation") {
    cy.contains(benefit)
      .should("be.visible")
      .click();

    return this;
  }

  selectPreviousClaim(answer = "No") {
    cy.contains("Have you ever filed a claim before?")
      .parent()
      .contains(answer)
      .click();

    return this;
  }

  selectActiveIntent(answer = "No") {
    cy.contains("Do you have an active intent to file?")
      .parent()
      .contains(answer)
      .click();

    return this;
  }

  saveAndContinue() {
    cy.contains(
      "button",
      "Save and Continue"
    )
      .should("be.visible")
      .click();

    return this;
  }
}

export default new PreScreeningFormPage();