const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Servicio",function(){
    beforeEach(function(){
        cy.fixture("service").then(function (service) {
            this.service = service;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    })
    it("Añadir Servicio válido",function(){
        //sección añadir producto
        //módulo inventario
        cy.get(".p-element.ng-tns-c21-16").click();
        //módulo servicio
        cy.get('.ng-tns-c21-30.ng-tns-c21-16 > .p-element').click();
        //boton agregar
        cy.get('.p-button-success').click();
        //formulario
        //nombre
        cy.get('#name').type(this.service.descripcionValido);
        //precio
        cy.get('[formControlName="servicePrice"]').type(this.service.precioValido);
        //renovación
        cy.get('.grid > :nth-child(2) > .p-inputwrapper > .p-inputnumber > #locale-us').type(this.service.renovacionValido);
        //selecciona uno
        cy.get('.p-dropdown-label').click();
        cy.get('.p-dropdown-filter').type(this.service.cadaXTiempoValido);
        cy.get('.p-element.ng-star-inserted > .p-ripple > .ng-star-inserted').click();
        cy.intercept("POST","http://localhost:1337/service/add").as("añadirServicio");
        //boton guardar
        cy.wait(sleepLargo)
        cy.get('.p-button-primary').click();
        cy.wait("@añadirServicio").its("response.statusCode").should("eq",201);
        cy.url().should("eq","http://localhost:4200/#/services");
        cy.wait(sleepLargo)
    })
    it("Añadir Servicio inválido por campos vacíos",function(){
        //sección añadir producto
        //módulo inventario
        cy.get(".p-element.ng-tns-c21-16").click();
        //módulo servicio
        cy.get('.ng-tns-c21-30.ng-tns-c21-16 > .p-element').click();
        //boton agregar
        cy.get('.p-button-success').click();
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.url().should("eq","http://localhost:4200/#/services/add")
        cy.wait(sleepLargo)
    })
    it("Añadir Servicio inválido por exceso de caracteres",function(){
        //sección añadir producto
        //módulo inventario
        cy.get(".p-element.ng-tns-c21-16").click();
        //módulo servicio
        cy.get('.ng-tns-c21-30.ng-tns-c21-16 > .p-element').click();
        //boton agregar
        cy.get('.p-button-success').click();
        //formulario
        //
        cy.get('#name').type(this.service.descripcionInvalido);
        cy.get('[formControlName="servicePrice"]').type(this.service.precioInvalido);
        //selecciona uno
        cy.get('.p-dropdown-label').click();
        cy.get('.p-dropdown-filter').type(this.service.cadaXTiempoValido);
        cy.get('.p-element.ng-star-inserted > .p-ripple > .ng-star-inserted').click();
        //boton guardar
        cy.wait(sleepLargo)
        cy.get('.p-button-primary').click();
        cy.url().should("eq","http://localhost:4200/#/services/add");
        cy.wait(sleepLargo)
    })
})