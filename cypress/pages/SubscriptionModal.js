const PLAN_LABELS = {
  basic: "Basic Plan",
  premium: "Premium Plan",
};

class SubscriptionModal {
  planCard(plan) {
    const label = PLAN_LABELS[plan];
    if (!label) {
      throw new Error(`Unknown plan "${plan}", expected one of: ${Object.keys(PLAN_LABELS)}`);
    }
    return cy.contains(label).parents("div").filter(":has(button:contains('SUBSCRIBE'))").first();
  }

  subscribeTo(plan) {
    cy.contains("CLAIM YOUR VETERAN PLAN").should("be.visible");
    this.planCard(plan).contains("button", "SUBSCRIBE").click();
    return this;
  }
}

export default new SubscriptionModal();
