describe("Payment API", () => {
  const url = "http://localhost:9000/validate";

  it("1. POST /validate → valid payment should return 200 and 'valid'", () => {
    const validPayment = {
      cardNumber: "1234",
      cardHolder: "John Doe",
      expirationDate: "12/25",
      cvv: "123",
    };

    cy.request({
      method: "POST",
      url,
      headers: { "Content-Type": "application/json" },
      body: validPayment,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("status", "valid");
    });
  });

  it("2. POST /validate → invalid card number should return 400", () => {
    const invalidCard = {
      cardNumber: "123", // too short
      cardHolder: "John Doe",
      expirationDate: "12/25",
      cvv: "123",
    };

    cy.request({
      method: "POST",
      url,
      failOnStatusCode: false,
      headers: { "Content-Type": "application/json" },
      body: invalidCard,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property(
        "error",
        "Invalid card number or CVV"
      );
    });
  });

  it("3. POST /validate → invalid CVV should return 400", () => {
    const invalidCVV = {
      cardNumber: "1234",
      cardHolder: "John Doe",
      expirationDate: "12/25",
      cvv: "12", // too short
    };

    cy.request({
      method: "POST",
      url,
      failOnStatusCode: false,
      headers: { "Content-Type": "application/json" },
      body: invalidCVV,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property(
        "error",
        "Invalid card number or CVV"
      );
    });
  });

  it("4. POST /validate → malformed JSON should return 400", () => {
    const malformed = {
      foo: "bar",
    };

    cy.request({
      method: "POST",
      url,
      failOnStatusCode: false,
      headers: { "Content-Type": "application/json" },
      body: malformed,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("error", "Payment Failed");
    });
  });
});
