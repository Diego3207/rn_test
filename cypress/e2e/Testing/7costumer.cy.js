const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Clientes", function () {
    beforeEach(function () {
        cy.fixture("costumer").then(function (costumer) {
            this.costumer = costumer;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    });
    it("Añadir cliente válido", function () {
        //sección añadir provider
        //módulo administración
        cy.get(".p-element.ng-tns-c21-15").click();
        //módulo clientes
        cy.get(".ng-tns-c21-18.ng-tns-c21-15 > .p-element").click();
        //boton agregar
        cy.get(".p-button-success").click();
        //nombre
        cy.get("#costumerName").type(this.costumer.nombreValido);
        //nombre comercial
        cy.get("#costumerBussinessName").type(
            this.costumer.nombreComercialValido
        );
        //rfc
        cy.get("#costumerRfc").type(this.costumer.rfcValido);
        //direccion
        cy.get("#costumerAddress")
            .type(this.costumer.direccionValido)
            .wait(200)
            .type("{downarrow}")
            .wait(200)
            .type("{enter}");
        //sitio web
        cy.get("#costumerWebSite").type(this.costumer.sitioWebValido);
        //estatus
        cy.get(".p-inputswitch-slider").click();
        //grupo
        cy.get(".p-autocomplete-input")
            .type(this.costumer.grupoValido)
            .wait(200)
            .type("{downarrow}")
            .type("{downarrow}")
            .wait(200)
            .type("{enter}");
        //agregar contacto
        cy.get(
            ":nth-child(8) > .flex > p-button.p-element > .p-ripple"
        ).click();
        //nombre
        cy.get(":nth-child(1) > .col-12 > .p-inputtext").type(
            this.costumer.nombreContactoValido
        );
        //telefono
        cy.get(".ng-untouched > .p-inputtext").type(
            this.costumer.telefonoContactoValido
        );
        //email
        cy.get(":nth-child(3) > .col-12 > .p-inputtext").type(
            this.costumer.emailConctactoValido
        );
        //departamento
        cy.get(":nth-child(4) > .col-12 > .p-inputtext").type(
            this.costumer.departamentoConctactoValido
        );
        //agregar cuenta bancaria
        cy.get(
            ":nth-child(9) > .flex > p-button.p-element > .p-ripple"
        ).click();
        //selecciona uno
        cy.get(".p-dropdown-label").click();
        cy.get(".p-dropdown-filter").type(this.costumer.cuentaBancariaValido);
        cy.get("#pr_id_11_list > :nth-child(1) > .p-ripple").click();
        cy.intercept("POST", "http://localhost:1337/costumer/add").as(
            "agregarCostumer"
        );
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.wait("@agregarCostumer")
            .its("response.statusCode")
            .should("eq", 201);
        cy.url().should("eq", "http://localhost:4200/#/costumers");
        cy.wait(sleepLargo);
    });
    it("Añadir cliente inválido por cliente duplicado con error 400", function () {
        //sección añadir provider
        //módulo administración
        cy.get(".p-element.ng-tns-c21-15").click();
        //módulo clientes
        cy.get(".ng-tns-c21-18.ng-tns-c21-15 > .p-element").click();
        //boton agregar
        cy.get(".p-button-success").click();
        //nombre
        cy.get("#costumerName").type(this.costumer.nombreValido);
        //nombre comercial
        cy.get("#costumerBussinessName").type(
            this.costumer.nombreComercialValido
        );
        //rfc
        cy.get("#costumerRfc").type(this.costumer.rfcValido);
        //direccion
        cy.get("#costumerAddress")
            .type(this.costumer.direccionValido)
            .wait(2000)
            .type("{downarrow}")
            .wait(500)
            .type("{enter}");
        //sitio web
        cy.get("#costumerWebSite").type(this.costumer.sitioWebValido);
        //estatus
        cy.get(".p-inputswitch-slider").click();
        //grupo
        cy.get(".p-autocomplete-input")
            .type(this.costumer.grupoValido)
            .wait(400)
            .type("{downarrow}")
            .wait(400)
            .type("{enter}");
        //agregar contacto
        cy.get(
            ":nth-child(8) > .flex > p-button.p-element > .p-ripple"
        ).click();
        //nombre
        cy.get(":nth-child(1) > .col-12 > .p-inputtext").type(
            this.costumer.nombreContactoValido
        );
        //telefono
        cy.get(".ng-untouched > .p-inputtext").type(
            this.costumer.telefonoContactoValido
        );
        //email
        cy.get(":nth-child(3) > .col-12 > .p-inputtext").type(
            this.costumer.emailConctactoValido
        );
        //departamento
        cy.get(":nth-child(4) > .col-12 > .p-inputtext").type(
            this.costumer.departamentoConctactoValido
        );
        //agregar cuenta bancaria
        cy.get(
            ":nth-child(9) > .flex > p-button.p-element > .p-ripple"
        ).click();
        //selecciona uno
        cy.get(".p-dropdown-label").click();
        cy.get(".p-dropdown-filter").type(this.costumer.cuentaBancariaValido);
        cy.get("#pr_id_11_list > :nth-child(1) > .p-ripple").click();
        cy.intercept("POST", "http://localhost:1337/costumer/add").as(
            "agregarCostumer"
        );
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.wait("@agregarCostumer")
            .its("response.statusCode")
            .should("eq", 400);
        cy.url().should("eq", "http://localhost:4200/#/costumers/add");
        cy.wait(sleepLargo);
    });
    it("Añadir cliente inválido por campos no válidos", function () {
        //sección añadir provider
        //módulo administración
        cy.get(".p-element.ng-tns-c21-15").click();
        //módulo clientes
        cy.get(".ng-tns-c21-18.ng-tns-c21-15 > .p-element").click();
        //boton agregar
        cy.get(".p-button-success").click();
        //nombre
        cy.get("#costumerName").type(this.costumer.nombreInvalido);
        //nombre comercial
        cy.get("#costumerBussinessName").type(
            this.costumer.nombreComercialInvalido
        );
        //rfc
        cy.get("#costumerRfc").type(this.costumer.rfcInvalido);
        //direccion
        cy.get("#costumerAddress").type(this.costumer.direccionInvalido);
        //sitio web
        cy.get("#costumerWebSite").type(this.costumer.sitioWebInvalido);
        //agregar contacto
        cy.get(
            ":nth-child(8) > .flex > p-button.p-element > .p-ripple"
        ).click();
        //nombre
        cy.get(":nth-child(1) > .col-12 > .p-inputtext").type(
            this.costumer.nombreContactoInvalido
        );
        //email
        cy.get(":nth-child(3) > .col-12 > .p-inputtext").type(
            this.costumer.emailContactoInvalido
        );
        cy.wait(sleepCorto);
        //agregar cuenta bancaria
        cy.get(
            ":nth-child(9) > .flex > p-button.p-element > .p-ripple"
        ).click();
        //selecciona uno
        cy.get(".p-dropdown-label").click();
        cy.get(".p-dropdown-filter").type(this.costumer.cuentaBancariaValido);
        cy.get("#pr_id_11_list > :nth-child(1) > .p-ripple").click();
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.url().should("eq", "http://localhost:4200/#/costumers/add");
        cy.wait(sleepLargo);
    });
    it("Cliente inválido por campos sin llenar", function () {
        //sección añadir provider
        //módulo administración
        cy.get(".p-element.ng-tns-c21-15").click();
        //módulo clientes
        cy.get(".ng-tns-c21-18.ng-tns-c21-15 > .p-element").click();
        //boton agregar
        cy.get(".p-button-success").click();
        //nombre
        cy.get("#costumerName").type(this.costumer.nombreInvalido);
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.url().should("eq", "http://localhost:4200/#/costumers/add");
        cy.wait(sleepLargo);
    });
});
