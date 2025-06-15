describe("Payment tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
    cy.get('[data-testid="product"]')
      .first()
      .within(() => {
        cy.get('[data-testid="increase"]').click();
        cy.get('[data-testid="add-to-cart"]').click();
      });
    cy.get('[data-testid="cart-icon"]').click();
    cy.get('[data-testid="pay-button"]').click();
  });

  it("12. After click pay button endpoint should be /payment", () => {
    cy.url().should("include", "/payment"); //30
  });

  it("13. If card number not valid then don't pay ", () => {
    cy.get('[data-testid="card-holder"]').type("tomasz");
    cy.get('[data-testid="exp-date"]').type("21/24");
    cy.get('[data-testid="cvv"]').type("012");
    cy.get('[data-testid="final-pay-button"]').click();
    cy.url().should("include", "/payment"); //31
    cy.get('[data-testid="payment-msg"]').should(
      "have.text",
      "Card number must be exactly 4 digits."
    ); //32
    cy.get('[data-testid="card-number"]').type("44");
    cy.get('[data-testid="final-pay-button"]').click();
    cy.url().should("include", "/payment"); //33
    cy.get('[data-testid="payment-msg"]').should(
      "have.text",
      "Card number must be exactly 4 digits."
    ); //34
  });
  it("14. If cart holder not valid then don't pay ", () => {
    cy.get('[data-testid="card-number"]').type("4444");
    cy.get('[data-testid="exp-date"]').type("21/24");
    cy.get('[data-testid="cvv"]').type("012");
    cy.get('[data-testid="final-pay-button"]').click();
    cy.url().should("include", "/payment"); //35
    cy.get('[data-testid="payment-msg"]').should(
      "have.text",
      "Card holder name is too short."
    ); //36
    cy.get('[data-testid="card-holder"]').type("t");
    cy.get('[data-testid="final-pay-button"]').click();
    cy.url().should("include", "/payment"); //37
    cy.get('[data-testid="payment-msg"]').should(
      "have.text",
      "Card holder name is too short."
    ); //38
  });
  it("15. If expiration date not valid then don't pay ", () => {
    cy.get('[data-testid="card-number"]').type("4444");
    cy.get('[data-testid="card-holder"]').type("tomasz");
    cy.get('[data-testid="cvv"]').type("012");
    cy.get('[data-testid="final-pay-button"]').click();
    cy.url().should("include", "/payment"); //39
    cy.get('[data-testid="payment-msg"]').should(
      "have.text",
      "Expiration date must be in format MM/YY."
    ); //40

    cy.get('[data-testid="exp-date"]').type("2124");
    cy.get('[data-testid="final-pay-button"]').click();
    cy.url().should("include", "/payment"); //41
    cy.get('[data-testid="payment-msg"]').should(
      "have.text",
      "Expiration date must be in format MM/YY."
    ); //42
  });
  it("16. If cvv not valid then don't pay ", () => {
    cy.get('[data-testid="card-number"]').type("4444");
    cy.get('[data-testid="card-holder"]').type("tomasz");
    cy.get('[data-testid="exp-date"]').type("21/24");
    cy.get('[data-testid="final-pay-button"]').click();
    cy.url().should("include", "/payment"); //43
    cy.get('[data-testid="payment-msg"]').should(
      "have.text",
      "CVV must be exactly 3 digits."
    ); //44

    cy.get('[data-testid="cvv"]').type("01");
    cy.get('[data-testid="final-pay-button"]').click();
    cy.url().should("include", "/payment"); //45
    cy.get('[data-testid="payment-msg"]').should(
      "have.text",
      "CVV must be exactly 3 digits."
    ); //46
  });
  it("17. If all data valid then pay ", () => {
    cy.get('[data-testid="card-number"]').type("4444");
    cy.get('[data-testid="card-holder"]').type("tomasz");
    cy.get('[data-testid="exp-date"]').type("21/24");
    cy.get('[data-testid="cvv"]').type("012");
    cy.get('[data-testid="final-pay-button"]').click();
    cy.url().should("include", "/message"); //47
    cy.get('[data-testid="payment-message"]')
      .should("exist")
      .should("have.text", "Payment successful!"); //48
  });

  it("18. Back to shop button works", () => {
    //pay
    cy.get('[data-testid="card-number"]').type("4444");
    cy.get('[data-testid="card-holder"]').type("tomasz");
    cy.get('[data-testid="exp-date"]').type("21/24");
    cy.get('[data-testid="cvv"]').type("012");
    cy.get('[data-testid="final-pay-button"]').click();
    //click button
    cy.get('[data-testid="back-to-shop"]').click();
    cy.url().should("include", "/"); //49
  });

  it("19. After payment cart is empty ", () => {
    //pay
    cy.get('[data-testid="card-number"]').type("4444");
    cy.get('[data-testid="card-holder"]').type("tomasz");
    cy.get('[data-testid="exp-date"]').type("21/24");
    cy.get('[data-testid="cvv"]').type("012");
    cy.get('[data-testid="final-pay-button"]').click();
    //click button
    cy.get('[data-testid="back-to-shop"]').click();
    cy.get('[data-testid="cart-icon"]').click();
    cy.get('[data-testid="product"]').should("not.exist"); //50
  });
  it("20. If we go to the /message without pay don't pay ", () => {
    cy.visit("http://localhost:5173/message");
    cy.get('[data-testid="payment-message"]').should(
      "have.text",
      "Something went wrong ..."
    ); //51
  });
});
