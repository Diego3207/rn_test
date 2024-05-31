const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Paquetes",function(){
    beforeEach(function(){
        cy.fixture("package").then(function (paquete) {
            this.paquete = paquete;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    })
    it("Añadir paquete válido",function(){
        //sección añadir producto
        //módulo inventario
        cy.get('.p-element.ng-tns-c21-16').click();
        //módulo paquete
        cy.get('.ng-tns-c21-31.ng-tns-c21-16 > .p-element > .layout-menuitem-text').click();
        //boton agregar
        cy.get('.p-button-success').click();
        //?agregar producto
        cy.wait(500);
        //nombre
        cy.get('#name').type(this.paquete.nombreValido)
        //añadir producto
        cy.get(':nth-child(2) > .flex > p-button.p-element > .p-ripple').click();
        cy.get('.p-dropdown-label').click();
        cy.get('.p-dropdown-filter').type(this.paquete.productoValido).wait(500).type("{downarrow}").wait(500).type("{enter}");
        //cantidad
        cy.wait(500);
        cy.get('[formControlName="packageProductQuantity"]').type(this.paquete.cantidadValido);
        //añadir servicio
        cy.get(':nth-child(3) > .flex > p-button.p-element > .p-ripple').click();
        cy.get('.ng-untouched.ng-star-inserted > :nth-child(1) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        cy.get('.p-dropdown-filter').type(this.paquete.servicioValido).wait(500).type("{downarrow}").wait(500).type("{enter}");
        //cantidad
        cy.get('[formControlName="packageServiceQuantity"]').type(this.paquete.cantidadValido);
        cy.intercept("POST", "http://localhost:1337/package/add").as(
            "agregar"
        );
        cy.wait(sleepLargo);
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.wait("@agregar")
            .its("response.statusCode")
            .should("eq", 201);
        cy.url().should("eq", "http://localhost:4200/#/packages");
        cy.wait(sleepLargo);
    })
    it("Añadir paquete inválido por exceso de caracteres",function(){
        //sección añadir producto
        //módulo inventario
        cy.get('.p-element.ng-tns-c21-16').click();
        //módulo paquete
        cy.get('.ng-tns-c21-31.ng-tns-c21-16 > .p-element > .layout-menuitem-text').click();
        //boton agregar
        cy.get('.p-button-success').click();
        //?agregar producto
        cy.wait(500);
        //nombre
        cy.get('#name').type(this.paquete.nombreInvalido)
        //añadir producto
        cy.get(':nth-child(2) > .flex > p-button.p-element > .p-ripple').click();
        cy.get('.p-dropdown-label').click();
        cy.get('.p-dropdown-filter').type(this.paquete.productoInvalido).wait(500).type("{downarrow}").wait(500).type("{enter}");
        //cantidad
        cy.wait(500);
        cy.get('[formControlName="packageProductQuantity"]').type(this.paquete.cantidadValido);
        //añadir servicio
        cy.get(':nth-child(3) > .flex > p-button.p-element > .p-ripple').click();
        cy.get('.ng-untouched.ng-star-inserted > :nth-child(1) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        cy.get('.p-dropdown-filter').type(this.paquete.servicioInvalido).wait(500).type("{downarrow}").wait(500).type("{enter}");
        //cantidad
        cy.get('[formControlName="packageServiceQuantity"]').type(this.paquete.cantidadValido);
        cy.wait(sleepLargo);
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.url().should("eq", "http://localhost:4200/#/packages/add");
        cy.wait(sleepLargo);
    })
    it("Añadir paquete inválido por campos vacíos",function(){
        //sección añadir producto
        //módulo inventario
        cy.get('.p-element.ng-tns-c21-16').click();
        //módulo paquete
        cy.get('.ng-tns-c21-31.ng-tns-c21-16 > .p-element > .layout-menuitem-text').click();
        //boton agregar
        cy.get('.p-button-success').click();
        //?agregar producto
        //nombre
        //añadir producto
        cy.get(':nth-child(2) > .flex > p-button.p-element > .p-ripple').click();
        //añadir servicio
        cy.get(':nth-child(3) > .flex > p-button.p-element > .p-ripple').click();
        cy.wait(sleepLargo);
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.url().should("eq", "http://localhost:4200/#/packages/add");
        cy.wait(sleepLargo);
    })
})