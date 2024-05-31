const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Login", function () {
    beforeEach(function () {
        cy.visit("localhost:4200/#/auth");
        cy.fixture("login").then(function (credenciales) {
            this.credenciales = credenciales;
        });
    });
    it("Login inválido", function () {
        cy.get("#email").type(this.credenciales.usuarioInvalido);
        cy.wait(sleepCorto);
        cy.get("#password").type(this.credenciales.contraseniaInvalido);
        cy.wait(sleepCorto);
        cy.intercept("POST", "/user/login").as("login");
        cy.get(".p-button-label").click();
        cy.wait("@login").its("response.statusCode").should("eq", 404);
        cy.url().should("eq", "http://localhost:4200/#/auth");
        cy.wait(sleepLargo);
    });
    it("Login válido", function () {
        cy.get("#email").type(this.credenciales.usuarioValido);
        cy.wait(sleepCorto);
        cy.get("#password").type(this.credenciales.contraseniaValido);
        cy.wait(sleepCorto);
        cy.intercept("POST", "http://localhost:1337/user/login").as("login");
        cy.get(".p-button-label").click();
        cy.wait("@login").its("response.statusCode").should("eq", 200);
        cy.url().should("eq", "http://localhost:4200/#/");
        cy.wait(sleepLargo);
    });
    it("Login inválido por campos vacíos", function () {
        cy.intercept("POST", "/user/login").as("login");
        cy.get(".p-button-label").click();
        cy.wait("@login").its("response.statusCode").should("eq", 400);
        cy.url().should("eq", "http://localhost:4200/#/auth");
        cy.wait(sleepLargo);
    });
});
