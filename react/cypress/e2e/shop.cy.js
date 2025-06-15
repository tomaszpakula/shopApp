describe("Shop - tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
    cy.intercept("GET", "**/cart").as("getCart");
  });

  it("1. Every product should have a button add to cart", () => {
    cy.get('[data-testid="product"]').each(($el) => {
      cy.wrap($el)
        .find('[data-testid="add-to-cart"]')
        .should("exist") //1
        .and("be.visible") //2
        .and(($icon) => {
          expect($icon).to.have.attr("data-icon", "cart-shopping"); //3;
        });
    });
  });

  it("2. Increase number of products", () => {
    cy.get('[data-testid="product"]').each(($el) => {
      cy.wrap($el).find('[data-testid="increase"]').should("exist"); //4
      cy.wrap($el).find('[data-testid="quantity"]').should("have.text", "0"); //5
      cy.wrap($el).find('[data-testid="increase"]').click();
      cy.wrap($el).find('[data-testid="quantity"]').should("have.text", "1"); //6
    });
  });

  it("3. Decrease number of products", () => {
    cy.get('[data-testid="product"]').each(($el) => {
      cy.wrap($el).find('[data-testid="decrease"]').should("exist"); //7
      cy.wrap($el).find('[data-testid="decrease"]').should("be.disabled"); //8
      cy.wrap($el).find('[data-testid="increase"]').click();
      cy.wrap($el).find('[data-testid="increase"]').click();
      cy.wrap($el).find('[data-testid="decrease"]').click();
      cy.wrap($el).find('[data-testid="quantity"]').should("have.text", "1"); //9
    });
  });

  it("4. Add to cart button resets counter", () => {
    cy.get('[data-testid="product"]').each(($el) => {
      cy.wrap($el).find('[data-testid="increase"]').click();
      cy.wrap($el).find('[data-testid="increase"]').click();
      cy.wrap($el).find('[data-testid="add-to-cart"]').click();
      cy.wrap($el).find('[data-testid="quantity"]').should("have.text", "0"); //10
    });
  });

  it("5. Click cart icon to go to cart site and again to comeback to main page", () => {
    cy.get('[data-testid="cart-icon"]').should("exist"); //11
    cy.get('[data-testid="cart-icon"]').click();
    cy.url().should("include", "/cart"); //12
    cy.get('[data-testid="cart-icon"]').click();
    cy.url().should("include", "/"); //13
  });

  it("6. Cart items (or message) and buttons exists", () => {
    cy.get('[data-testid="cart-icon"]').click();
    cy.get('[data-testid="cart-item"],[data-testid="empty-cart-msg"] ').should(
      "exist"
    ); //14

    cy.get('[data-testid="clear-cart-button"]').should("exist"); //15
    cy.get('[data-testid="pay-button"]').should("exist"); //16
  });

  it("7. Clear cart and check if message is displayed ", () => {
    cy.get('[data-testid="product"]')
      .first()
      .within(() => {
        cy.get('[data-testid="increase"]').click();
        cy.get('[data-testid="add-to-cart"]').click();
      });

    cy.get('[data-testid="cart-icon"]').click();
    cy.get('[data-testid="clear-cart-button"]').click();

    cy.get('[data-testid="empty-cart-msg"] ').should("exist"); //17
    cy.get('[data-testid="clear-cart-button"]').should("exist"); //18
    cy.get('[data-testid="pay-button"]').should("exist"); //19
  });

  it("8. Remove element", () => {
    cy.get('[data-testid="product"]')
      .first()
      .within(() => {
        cy.get('[data-testid="increase"]').click();
        cy.get('[data-testid="add-to-cart"]').click();
      });

    cy.get('[data-testid="cart-icon"]').click();
    cy.get('[data-testid="cart-item"]')
      .within(() => {
        cy.get('[data-testid="remove-item"]').click();
      })
      .should("not.exist"); //20
  });
  it("9. If cart is empty then buttons are disabled", () => {
    cy.get('[data-testid="cart-icon"]').click();

    cy.get('[data-testid="clear-cart-button"]').then(($btn) => {
      if (!$btn.is(":disabled")) {
        cy.get('[data-testid="empty-cart-msg"]').should("not.exist"); //21;
        cy.get('[data-testid="clear-cart-button"]')
          .should("exist")
          .and("be.enabled"); //22
        cy.wrap($btn).click();
        cy.get('[data-testid="empty-cart-msg"]').should("exist"); //23;
        cy.get('[data-testid="product"]').first().should("not.exist");
        cy.get('[data-testid="clear-cart-button"]')
          .should("exist")
          .and("be.disabled"); //24
      } else {
        cy.get('[data-testid="empty-cart-msg"]').should("exist"); //25;
        cy.get('[data-testid="clear-cart-button"]')
          .should("exist")
          .and("be.disabled");
      }
    });
  });

  it("10. Products are displayed then message is not", () => {
    cy.get('[data-testid="product"]')
      .first()
      .within(() => {
        cy.get('[data-testid="increase"]').click();
        cy.get('[data-testid="add-to-cart"]').click();
      });
    cy.get('[data-testid="cart-icon"]').click();

    cy.get('[data-testid="cart-item"]').first().should("exist"); //26
    cy.get('[data-testid="empty-cart-msg"]').should("not.exist"); //27
  });

  it("11. Message are displayed then products are not", () => {
    cy.get('[data-testid="cart-icon"]').click();
    //clear cart if is not empty
    cy.get('[data-testid="clear-cart-button"]').then(($btn) => {
      if (!$btn.is(":disabled")) {
        cy.wrap($btn).click();
      }
    });
    cy.get('[data-testid="cart-item"]').should("not.exist"); //28
    cy.get('[data-testid="empty-cart-msg"]').should("exist"); //29
  });
});
