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

    it("should validate status code 200", () => {
        cy.request("/users/2").as("existingUser");

        cy.get("@existingUser").its("status").should("equal", 200);
    });

    it("should validate status code 404", () => {
        cy.request({ url: "/users/non-exist", failOnStatusCode: false }).as(
            "nonExstingUser"
        );

        cy.get("@nonExstingUser").its("status").should("equal", 404);
    });
});
