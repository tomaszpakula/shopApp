describe("Products API", () => {
  const url = "http://localhost:9000/products";

  it("1. GET /products → should return list of products", () => {
    cy.request({
      method: "GET",
      url: url,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);
    });
  });

  it("2. GET /products/:id → should return single product", () => {
    cy.request({
      method: "GET",
      url: `${url}/1`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("id", 1);
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("price");
      expect(response.body).to.have.property("categoryId");
    });
  });

  it("3. GET /products/:id → 404 for non‐existent product", () => {
    cy.request({
      method: "GET",
      url: `${url}/9999`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property("error");
    });
  });

  it("4. POST /products → should create a new product", () => {
    const newProduct = {
      name: "Tablet",
      price: 1200.0,
      categoryId: 1,
    };
    cy.request({
      method: "POST",
      url: url,
      headers: { "Content-Type": "application/json" },
      body: newProduct,
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  it("5. POST /products → 400 on invalid payload", () => {
    cy.request({
      method: "POST",
      url: url,
      failOnStatusCode: false,
      headers: { "Content-Type": "application/json" },
      body: { foo: "bar" },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("error");
    });
  });

  it("6. PUT /products/:id → should update existing product", () => {
    const updated = {
      name: "Tablet Pro",
      price: 1300.5,
      categoryId: 1,
    };
    cy.request({
      method: "PUT",
      url: `${url}/1`,
      headers: { "Content-Type": "application/json" },
      body: updated,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("7. PUT /products/:id → 404 on bad JSON format", () => {
    cy.request({
      method: "PUT",
      url: `${url}/99`,
      failOnStatusCode: false,
      headers: { "Content-Type": "application/json" },
      body: { id: 99, foo: "invalid" },
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property("error");
    });
  });

  it("8. DELETE /products/:id → should delete existing product", () => {
    cy.request({
      method: "DELETE",
      url: `${url}/1`,
    }).then((response) => {
      expect(response.status).to.eq(202);
    });
  });

  it("9. DELETE /products/:id → 404 when deleting non‐existent", () => {
    cy.request({
      method: "DELETE",
      url: `${url}/9999`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property("error");
    });
  });
});
