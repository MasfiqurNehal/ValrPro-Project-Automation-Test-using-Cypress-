import PreScreeningFormPage from "../../pages/PreScreeningFormPage";
import PersonalInformationPage from "../../pages/PersonalInformationPage";

describe("Claims", () => {
  it("TC-CLAIM-001: starts a new claim and completes pre-screening", () => {

    // Login
    cy.getAccount().then((account) => {
      cy.login(account.email, account.password);
    });

    // Dashboard
    cy.closeOnboardingModal();

    cy.contains("Dashboard")
      .should("be.visible");

    // Start a New Claim
    cy.contains(
      'button, a, [role="button"]',
      /START A NEW CLAIM/i,
      { timeout: 60000 }
    )
      .scrollIntoView()
      .should("be.visible")
      .click();

    // VA Connection & Verification
    cy.contains(
      "VA Connection & Verification",
      { timeout: 60000 }
    )
      .should("be.visible");

    cy.contains(
      'button, a, [role="button"]',
      /Continue to Claim/i,
      { timeout: 60000 }
    )
      .scrollIntoView()
      .should("be.visible")
      .click();

    // Pre-Screening Page
    cy.url({ timeout: 60000 })
      .should("include", "/form/pre_screening");

    // Fill Pre-Screening Form
    PreScreeningFormPage
      .assertLoaded()
      .selectBenefitType("Compensation")
      .selectPreviousClaim("No")
      .selectActiveIntent("No")
      .saveAndContinue();

    // Personal Information
    cy.fixture("testData/claimData.json").then((claimData) => {

      PersonalInformationPage
        .assertLoaded()
        .fillPersonalInformation(claimData.personalInformation)
        .saveAndContinue();

    });

  });
});