import DashboardPage from "../../pages/DashboardPage";

describe("Authentication", () => {
  it("TC-AUTH-001: logs in and lands on the dashboard", () => {
    cy.getAccount().then((account) => {
      cy.login(account.email, account.password);
    });

    cy.closeOnboardingModal();
    DashboardPage.secureVeteranPlanButton.should("be.visible");
  });
});
