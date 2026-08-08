// Plain selector strings (not cy chains) so this file can be handed, via
// cy.origin's `args`, into the cross-origin checkout.stripe.com callback.
// If Stripe changes their markup, update the selectors here only.
module.exports = {
  cardNumberInput: 'input[placeholder="1234 1234 1234 1234"], input[name="cardnumber"], input[autocomplete="cc-number"]',
  expiryInput: 'input[placeholder="MM / YY"], input[name="exp-date"], input[autocomplete="cc-exp"]',
  cvcInput: 'input[placeholder="CVC"], input[name="cvc"], input[autocomplete="cc-csc"]',
  cardholderNameInput: 'input[placeholder="Full name on card"], input[name="billingName"]',
  countrySelect: 'select#billingCountry, select[name="country"]',
  subscribeButton: 'button[type="submit"]',
};
