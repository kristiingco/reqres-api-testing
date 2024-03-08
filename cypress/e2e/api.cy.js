/// <reference types="Cypress"/>

describe("API Tests", () => {
    it("should validate headers", () => {
        cy.request("/users/2").as("user");

        cy.get("@user")
            .its("headers")
            .its("content-type")
            .should("include", "application/json");

        cy.get("@user")
            .its("headers")
            .its("connection")
            .should("include", "keep-alive");
    });
});
