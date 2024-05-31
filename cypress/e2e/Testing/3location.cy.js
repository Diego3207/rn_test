const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Ubicaciones", function () {
    beforeEach(function () {
        cy.fixture("location").then(function (location) {
            this.location = location;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    });
    it("Añadir ubicación válido", function () {
        //sección añadir producto
        //módulo inventario
        cy.get('.p-element.ng-tns-c21-16').click();
        //módulo ubicaciones
        cy.get('.ng-tns-c21-28.ng-tns-c21-16 > .p-element').click();
        //boton agregar
        cy.get(".p-button-success").click();
        //nombre
        cy.get("#locationName").type(this.location.nombreValido);
        //direccion
        cy.get("#locationAddress").type(this.location.direccionValido)
        .wait(900)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //telefono
        cy.get('.ng-untouched > .p-inputtext').type(this.location.telefonoValido);
        cy.wait(sleepLargo)
        cy.intercept("POST", "http://localhost:1337/location/add").as("añadirUbicacion");
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.wait("@añadirUbicacion").its("response.statusCode").should("eq", 201);
        cy.url().should("eq", "http://localhost:4200/#/location");
        cy.wait(sleepLargo)
    });
    it("Añadir ubicación inválido por exceso de caracteres", function () {
        //sección añadir producto
        //módulo inventario
        cy.get('.p-element.ng-tns-c21-16').click();
        //módulo ubicaciones
        cy.get('.ng-tns-c21-28.ng-tns-c21-16 > .p-element').click();
        //boton agregar
        cy.get(".p-button-success").click();
        //nombre
        cy.get("#locationName").type(this.location.nombreInvalido);
        //direccion
        cy.get("#locationAddress").type(this.location.direccionInvalido);
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.url().should("eq", "http://localhost:4200/#/location/add");
        cy.wait(sleepLargo)
    });
    it("Añadir ubicación inválido por campos vacíos", function () {
        //sección añadir producto
        //módulo inventario
        cy.get('.p-element.ng-tns-c21-16').click();
        //módulo ubicaciones
        cy.get('.ng-tns-c21-28.ng-tns-c21-16 > .p-element').click();
        //boton agregar
        cy.get(".p-button-success").click();
        //nombre
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.url().should("eq", "http://localhost:4200/#/location/add");
        cy.wait(sleepLargo)
    });
});
