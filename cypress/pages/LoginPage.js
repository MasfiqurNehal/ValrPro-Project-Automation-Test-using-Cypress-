class LoginPage {
  get emailInput() {
    return cy.get('input[type="email"], input[placeholder="Enter email address"]');
  }

  get passwordInput() {
    return cy.get('input[type="password"], input[placeholder="Enter password"]');
  }

  get loginButton() {
    return cy.contains("button", "LOG IN");
  }

  login(email, password) {
    this.emailInput.clear().type(email, { log: false });
    this.passwordInput.clear().type(password, { log: false });
    this.loginButton.click();
    return this;
  }
}

export default new LoginPage();
