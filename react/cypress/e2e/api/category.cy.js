describe("Categories API", () => {
  const url = "http://localhost:9000/categories";

  it("1. GET /categories → should return list of categories", () => {
    cy.request("GET", url).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);
    });
  });

  it("2. GET /categories/:id → should return category by ID", () => {
    cy.request("GET", `${url}/1`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("id", 1);
      expect(response.body).to.have.property("name");
    });
  });

  it("3. GET /categories/:id → 404 when category not found", () => {
    cy.request({
      method: "GET",
      url: `${url}/9999`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property("error");
    });
  });

  it("4. POST /categories → should create new category", () => {
    const newCategory = {
      id: 99,
      name: "science",
    };
    cy.request({
      method: "POST",
      url: url,
      headers: { "Content-Type": "application/json" },
      body: newCategory,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.deep.equal(newCategory);
    });
  });

  it("5. POST /categories → 400 on invalid JSON", () => {
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

  it("6. PUT /categories/:id → should update existing category", () => {
    const updated = {
      id: 99,
      name: "science-updated",
    };
    cy.request({
      method: "PUT",
      url: `${url}/99`,
      headers: { "Content-Type": "application/json" },
      body: updated,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.deep.equal(updated);
    });
  });

  it("7. PUT /categories/:id → 400 on bad JSON", () => {
    cy.request({
      method: "PUT",
      url: `${url}/99`,
      failOnStatusCode: false,
      headers: { "Content-Type": "application/json" },
      body: { foo: "bar" },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("error");
    });
  });

  it("8. DELETE /categories/:id → should delete category", () => {
    cy.request({
      method: "DELETE",
      url: `${url}/99`,
    }).then((response) => {
      expect(response.status).to.eq(204);
    });
  });

  it("9. DELETE /categories/:id → 404 when deleting non-existent", () => {
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
