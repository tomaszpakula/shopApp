describe("Cart tests", () => {
  const url = "http://localhost:9000/cart";

  it("1. Should add an item to the cart", () => {
    cy.request({
      method: "POST",
      url,
      headers: { "Content-Type": "application/json" },
      body: { productId: 3, quantity: 2 },
    }).then((response) => {
      expect([200, 201]).to.include(response.status);
      expect(response.body).to.have.property("productId", 3);
      expect(response.body).to.have.property("quantity");

      if (response.status === 200) {
        expect(response.body.quantity).to.be.greaterThan(2);
      } else {
        expect(response.body.quantity).to.equal(2);
      }
    });
  });

  it("2. Should not add an item to the cart (missing quantity)", () => {
    cy.request({
      method: "POST",
      url,
      failOnStatusCode: false,
      headers: { "Content-Type": "application/json" },
      body: { productId: 3 },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("error");
    });
  });

  it("3. Should get empty cart", () => {
    cy.request({
      method: "GET",
      url,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
    });
  });

  it("4. Should update quantity of an existing item", () => {
    cy.request({
      method: "POST",
      url,
      headers: { "Content-Type": "application/json" },
      body: { productId: 1, quantity: 2 },
    });

    cy.request({
      method: "PUT",
      url: `${url}/1`,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(5),
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("message");
      expect(response.body.message).to.include("Updated quantity");
    });
  });

  it("5. Should not update quantity to zero or less", () => {
    cy.request({
      method: "POST",
      url,
      headers: { "Content-Type": "application/json" },
      body: { productId: 1, quantity: 2 },
    });

    cy.request({
      method: "PUT",
      url: `${url}/1`,
      failOnStatusCode: false,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(0),
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.include("greater than 0");
    });
  });

  it("6. Should not update quantity with bad format", () => {
    cy.request({
      method: "PUT",
      url: `${url}/1`,
      failOnStatusCode: false,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: 5 }),
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.include("Incorrect format");
    });
  });

  it("7. Should not update quantity of nonexistent product", () => {
    cy.request({
      method: "PUT",
      url: `${url}/99`,
      failOnStatusCode: false,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(3),
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body.error).to.include("not found");
    });
  });

  it("8. Should remove item from cart", () => {
    cy.request({
      method: "POST",
      url,
      headers: { "Content-Type": "application/json" },
      body: { productId: 1, quantity: 2 },
    });

    cy.request({
      method: "DELETE",
      url: `${url}/1`,
    }).then((response) => {
      expect(response.status).to.eq(204);
    });
  });

  it("9. Should return 404 when removing nonexistent item", () => {
    cy.request({
      method: "DELETE",
      url: `${url}/999`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body.error).to.include("Not found");
    });
  });

  it("10. Should clear cart", () => {
    cy.request({
      method: "POST",
      url,
      headers: { "Content-Type": "application/json" },
      body: { productId: 1, quantity: 2 },
    });

    cy.request({
      method: "DELETE",
      url: url,
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    cy.request({
      method: "GET",
      url,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array").that.is.empty;
    });
  });
});
