const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Cotizaciones de compra",function(){
    beforeEach(function(){
        cy.fixture("quotationPurchase").then(function (variable) {
            this.variable = variable;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    })
    it("Crear cotizacion de compra con 1 producto y 1 servicio valida",function(){
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //módulo cotizaciones
        cy.get('.p-element.ng-tns-c21-20').click();
        //compra
        cy.get('.ng-tns-c21-24.ng-tns-c21-20 > .p-element').click();
        //boton agregar
        cy.get(".p-button-success").click();
        cy.wait(200)
        //proveedor
        cy.get('.p-dropdown-label').click();
        //escribe "concox"
        cy.get('.p-dropdown-filter')
        .type(this.variable.proveedorValido)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //descripcion
        cy.get('#name').type(this.variable.descripcionValido);
        //agregar producto
        cy.get(':nth-child(3) > .flex > p-button.p-element > .p-ripple').click();
        //producto
        cy.get('.ng-untouched.ng-star-inserted > :nth-child(1) > :nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir "qbit"
        cy.get('.p-dropdown-filter')
        .type(this.variable.productoValido)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //unidad
        cy.get('.col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir primera opcion
        cy.get('[ng-reflect-label="Pieza"] > .p-ripple').click();
        //cantidad
        cy.get('#locale-us').type(this.variable.cantidadValido);
        //agregar servicio
        cy.get(':nth-child(4) > .flex-wrap > p-button.p-element > .p-ripple').click();
        //servicio
        cy.get('.ng-untouched.ng-star-inserted > :nth-child(1) > :nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir "instala"
        cy.get('.p-dropdown-filter')
        .type(this.variable.servicioValido)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //unidad
        cy.get('.ng-invalid.ng-star-inserted > :nth-child(2) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir primera opcion
        cy.get('[ng-reflect-label="Anual"] > .p-ripple').click();
        //cantidad
        cy.get('.ng-invalid.ng-star-inserted > :nth-child(3) > .col-12 > .p-inputwrapper > .p-inputnumber > #locale-us').type(this.variable.cantidadValido);
        cy.intercept("POST", "http://localhost:1337/quotationPurchase/add").as(
            "añadirProducto"
        );
        cy.wait(sleepLargo);
        cy.get(".p-button-primary").click();
        cy.wait("@añadirProducto").its("response.statusCode").should("eq", 201);
        cy.url().should("eq", "http://localhost:4200/#/quotationPurchases");
        cy.wait(sleepLargo);
    })
    it("Procesar cotización de compra valida",function(){
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //módulo cotizaciones
        cy.get('.p-element.ng-tns-c21-20').click();
        //compra
        cy.get('.ng-tns-c21-24.ng-tns-c21-20 > .p-element').click();
        //estatus
        cy.get('[psortablecolumn="quotationPurchaseStatus"]').click();
        //procesar
        cy.get('.flex > .p-button-success > .p-button-icon').first().click();
        //tiempo de entrega
        cy.get('.p-calendar > .p-inputtext').click();
        //dia 10
        cy.get('tbody.ng-tns-c88-59 > :nth-child(2) > :nth-child(4) > .p-ripple').click();
        //garantia
        cy.get('.p-inputswitch-slider').click();
        //precio 1
        cy.get('[formControlName="quotationPurchaseProductPrice"]').type(this.variable.precioValido);
        //precio 2
        cy.get('[formControlName="quotationPurchaseServicePrice"]').type(this.variable.precioValido);
        cy.intercept("PUT", "http://localhost:1337/quotationPurchase/update").as(
            "añadirProducto"
        );
        cy.wait(sleepLargo);
        cy.get(".p-button-primary").click();
        cy.wait("@añadirProducto").its("response.statusCode").should("eq", 200);
        cy.url().should("eq", "http://localhost:4200/#/quotationPurchases");
        cy.wait(sleepLargo);
    })
    it("Crear cotizacion de compra invalida por campos vacíos",function(){
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //módulo cotizaciones
        cy.get('.p-element.ng-tns-c21-20').click();
        //compra
        cy.get('.ng-tns-c21-24.ng-tns-c21-20 > .p-element').click();
        //boton agregar
        cy.get(".p-button-success").click();
        cy.wait(200)
        cy.wait(sleepLargo);
        cy.get(".p-button-primary").click();
        cy.url().should("eq", "http://localhost:4200/#/quotationPurchases/add");
        cy.wait(sleepLargo);
    })
    it("Crear cotizacion de compra con 1 producto y 1 servicio valida",function(){
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //módulo cotizaciones
        cy.get('.p-element.ng-tns-c21-20').click();
        //compra
        cy.get('.ng-tns-c21-24.ng-tns-c21-20 > .p-element').click();
        //boton agregar
        cy.get(".p-button-success").click();
        cy.wait(200)
        //proveedor
        cy.get('.p-dropdown-label').click();
        //escribe "concox"
        cy.get('.p-dropdown-filter')
        .type(this.variable.proveedorValido)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //descripcion
        cy.get('#name').type(this.variable.descripcionValido);
        //agregar producto
        cy.get(':nth-child(3) > .flex > p-button.p-element > .p-ripple').click();
        //producto
        cy.get('.ng-untouched.ng-star-inserted > :nth-child(1) > :nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir "qbit"
        cy.get('.p-dropdown-filter')
        .type(this.variable.productoValido)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //unidad
        cy.get('.col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir primera opcion
        cy.get('[ng-reflect-label="Pieza"] > .p-ripple').click();
        //cantidad
        cy.get('#locale-us').type(this.variable.cantidadValido);
        //agregar servicio
        cy.get(':nth-child(4) > .flex-wrap > p-button.p-element > .p-ripple').click();
        //servicio
        cy.get('.ng-untouched.ng-star-inserted > :nth-child(1) > :nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir "instala"
        cy.get('.p-dropdown-filter')
        .type(this.variable.servicioValido)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //unidad
        cy.get('.ng-invalid.ng-star-inserted > :nth-child(2) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir primera opcion
        cy.get('[ng-reflect-label="Anual"] > .p-ripple').click();
        //cantidad
        cy.get('.ng-invalid.ng-star-inserted > :nth-child(3) > .col-12 > .p-inputwrapper > .p-inputnumber > #locale-us').type(this.variable.cantidadValido);
        cy.get(".p-button-primary").click();
        cy.wait(sleepLargo);
    })
    it("Procesar cotización de compra invalida",function(){
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //módulo cotizaciones
        cy.get('.p-element.ng-tns-c21-20').click();
        //compra
        cy.get('.ng-tns-c21-24.ng-tns-c21-20 > .p-element').click();
        //estatus
        cy.get('[psortablecolumn="quotationPurchaseStatus"]').click();
        //procesar
        cy.get('.flex > .p-button-success > .p-button-icon').first().click();
        cy.wait(sleepLargo);
        cy.get(".p-button-primary").click();
    })
})