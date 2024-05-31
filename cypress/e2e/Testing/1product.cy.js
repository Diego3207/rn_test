const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Añadir producto", function () {
    beforeEach(function () {
        cy.fixture("product").then(function (producto) {
            this.producto = producto;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    });
    it("Añadir Producto válido de tipo gps", function () {
        //módulo inventario
        cy.get(".p-element.ng-tns-c21-16").click();
        //módulo productos
        cy.get('.ng-tns-c21-29.ng-tns-c21-16 > .p-element > .layout-menuitem-text').click();
        cy.get(".p-button-success").click();
        //formulario
        //marca
        cy.get("#brand").type(this.producto.marcaValido);
        cy.wait(sleepCorto);
        //modelo
        cy.get("#model").type(this.producto.modeloValido);
        //descripcion
        cy.get("#description").type(this.producto.descripcionValido);
        //categoría
        cy.get(
            ":nth-child(4) > .p-inputwrapper > .p-dropdown > .p-dropdown-label"
        ).click();
        cy.get('.p-dropdown-filter')
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        cy.wait(500);
        //precio
        cy.get("#price > .p-inputnumber > #locale-us").type(
            this.producto.precioValido
        );
        cy.wait(sleepCorto);
        //garantia para el cliente
        cy.get(
            ":nth-child(2) > .p-inputwrapper > .p-inputnumber > #locale-us"
        ).type(this.producto.garantiaValido);
        cy.wait(sleepCorto);
        cy.get(
            ":nth-child(3) > .p-inputwrapper > .p-dropdown > .p-dropdown-label"
        ).click();
        cy.get("[ng-reflect-label='Día(s)'] > .p-ripple").click();
        cy.get(
            ":nth-child(4) > .p-element > .p-radiobutton > .p-radiobutton-box"
        ).click();
        cy.intercept("POST", "http://localhost:1337/product/add").as(
            "añadirProducto"
        );
        cy.wait(sleepLargo);
        cy.get(".p-button-primary").click();
        cy.wait("@añadirProducto").its("response.statusCode").should("eq", 201);
        cy.url().should("eq", "http://localhost:4200/#/product");
        cy.wait(sleepLargo);
    });
    
    it("Añadir Producto inválido por campos sin llenar", function () {
        //módulo inventario
        cy.get(".p-element.ng-tns-c21-16").click();
        //módulo productos
        cy.get('.ng-tns-c21-29.ng-tns-c21-16 > .p-element > .layout-menuitem-text').click();
        cy.get(".p-button-success").click();
        cy.wait(sleepLargo);
        cy.get("#brand").type(this.producto.marcaValido);
        //botón de guardar
        cy.get(".p-button-primary > .p-button-label").click();
        cy.wait(sleepLargo);
        cy.url().should("eq", "http://localhost:4200/#/product/add");
        cy.wait(sleepLargo);
    });
    it("Añadir Producto inválido por exceder la longitud de valores máximos", function () {
        //módulo inventario
        cy.get(".p-element.ng-tns-c21-16").click();
        //módulo productos
        cy.get('.ng-tns-c21-29.ng-tns-c21-16 > .p-element > .layout-menuitem-text').click();
        cy.get(".p-button-success").click();
        cy.wait(sleepLargo);
        //formulario
        cy.get("#brand").type(this.producto.marcaInvalido);
        cy.get("#model").type(this.producto.modeloInvalido);
        cy.get("#price").type(this.producto.precioInvalido);
        cy.get(
            ":nth-child(2) > .p-inputwrapper > .p-inputnumber > #locale-us"
        ).type(366);
        //botón de guardar
        //cy.get(".p-button-primary > .p-button-label").click();
        cy.wait(sleepLargo);
        cy.url().should("eq", "http://localhost:4200/#/product/add");
        cy.wait(sleepLargo);
    });
});
/*
describe.only("Buscar producto", function () {
    beforeEach(function () {
        cy.fixture("product").then(function (producto) {
            this.producto = producto;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get("#continuar").click();
    });
    it("Buscar por marca", function () {
        cy.get(".p-element.ng-tns-c21-16").click();
        cy.get(
            ".ng-tns-c21-28.ng-tns-c21-16 > .p-element > .layout-menuitem-text"
        ).click();
    });
});
*/
