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

    it("should do a GET request", () => {
        cy.request({ url: "/users/2", method: "GET" }).as("user");
        cy.get("@user").then((res) => {
            const userID = res.body.data.id;
            const userEmail = res.body.data.email;
            const userLastName = res.body.data.last_name;

            expect(userID).equal(2);
            expect(userEmail).contain("janet.weaver@reqres.in");
            expect(userLastName).not.to.contain(/^\d+$/);
        });
    });

    it("should do a successful POST request", () => {
        cy.request({
            url: "/login",
            method: "POST",
            body: {
                email: "eve.holt@reqres.in",
                password: "cityslicka",
            },
        }).as("loginRequest");

        cy.get("@loginRequest").its("status").should("equal", 200);
        cy.get("@loginRequest").then((res) => {
            const loginToken = res.body.token;

            expect(loginToken).to.equal("QpwL5tke4Pnpja7X4");
        });
    });

    it("should do a failing POST request", () => {
        cy.request({
            url: "/login",
            method: "POST",
            body: {
                email: "eve.holt@reqres.in",
            },
            failOnStatusCode: false,
        }).as("loginRequest");

        cy.get("@loginRequest").its("status").should("equal", 400);
        cy.get("@loginRequest").then((res) => {
            const loginError = res.body.error;

            expect(loginError).to.equal("Missing password");
        });
    });

    it("should do a DELETE request", () => {
        cy.request({ url: "/users/2", method: "DELETE" }).as("deleteUser");

        cy.get("@deleteUser").its("status").should("equal", 204);
    });

    it("should do a PUT request", () => {
        cy.request({
            url: "/users/2",
            method: "PUT",
            body: {
                name: "morpheus",
            },
        }).as("updateUser");

        cy.get("@updateUser").its("status").should("equal", 200);
        cy.get("@updateUser").then((res) => {
            const userName = res.body.name;
            expect(userName).to.equal("morpheus");
        });
    });
});
