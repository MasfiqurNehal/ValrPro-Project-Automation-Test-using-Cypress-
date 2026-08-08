class LandingPage {
  visit() {
    cy.visit("/");
    return this;
  }

  get signInButton() {
    return cy.contains("button, a", "Sign In");
  }

  goToLogin() {
    this.signInButton.click();
    return this;
  }
}

export default new LandingPage();
