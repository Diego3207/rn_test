const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Proveedor", function () {
    beforeEach(function () {
        cy.fixture("provider").then(function (provider) {
            this.provider = provider;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    });
    it("Añadir Proveedor válido con 1 producto y 1 servicio", function () {
        //sección añadir provider
        //módulo administración
        cy.get(".p-element.ng-tns-c21-15").click();
        //módulo proveedores
        cy.get(".ng-tns-c21-17.ng-tns-c21-15 > .p-element").click();
        //boton agregar
        cy.get(".p-button-success").click();
        //formulario
        cy.get("#name").type(this.provider.nombreValido);
        cy.get("#nationality").type(this.provider.nacionalidadValido);
        //giro comercial
        cy.get(".p-dropdown-label").click();
        cy.get(".p-dropdown-filter").type(this.provider.giroComercialValido);
        cy.get(".p-element.ng-star-inserted > .p-ripple").click();
        //añadir producto
        cy.get(
            ":nth-child(4) > .flex > p-button.p-element > .p-ripple"
        ).click();
        //?selecciona producto
        cy.get(
            ":nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-label"
        ).click();
        cy.get(".p-dropdown-filter")
            .type(this.provider.productoValido)
            .type("{downarrow}")
            .wait(500)
            .type("{enter}");
        //garantia
        cy.get("#locale-us").type(this.provider.garantiaValido);
        //temporalidad
        cy.get(
            ":nth-child(4) > .p-inputwrapper > .p-dropdown > .p-dropdown-label"
        ).click();
        cy.get('[ng-reflect-label="Día(s)"] > .p-ripple').click();
        cy.wait(sleepCorto);
        //añadir servicio
        cy.get(
            ":nth-child(5) > .flex > p-button.p-element > .p-ripple"
        ).click();
        //?selecciona servicio
        cy.get("[formControlName='providerServiceServiceId']").click();
        cy.get(".p-dropdown-filter")
            .type(this.provider.servicioValido)
            .type("{downarrow}")
            .wait(500)
            .type("{enter}");
        //garantia
        cy.get('[formControlName="providerProductGuaranteeUnit"]').last().type(this.provider.garantiaValido);
        cy.get(
            "#pr_id_10-table > .p-datatable-tbody > .ng-star-inserted.ng-dirty > :nth-child(4) > .p-inputwrapper > .p-dropdown > .p-dropdown-label"
        ).click();
        cy.get(
            '[ng-reflect-label="Día(s)"] > .p-ripple > .ng-star-inserted'
        ).click();
        //agregar contacto
        cy.get(
            ":nth-child(6) > .flex-wrap > p-button.p-element > .p-ripple"
        ).click();
        //nombre
        cy.get(":nth-child(1) > .col-12 > .p-inputtext").type(
            this.provider.nombreContactoValido
        );
        //telefono
        cy.get(":nth-child(2) > .col-12 > .p-inputtext").type(
            this.provider.telefonoContactoValido
        );
        //email
        cy.get(":nth-child(3) > .col-12 > .p-inputtext").type(
            this.provider.emailConctactoValido
        );
        //agregar direccion
        cy.get(
            ":nth-child(7) > .flex-wrap > p-button.p-element > .p-ripple"
        ).click();
        //descipcion
        cy.get(
            "#pr_id_12-table > .p-datatable-tbody > .p-element.ng-star-inserted > :nth-child(1) > .col-12 > .p-inputtext"
        ).type(this.provider.descripcionDireccionesValido);
        //direccion
        cy.get("#providerLocationAddress")
            .type(this.provider.direccionDireccionesValido)
            .wait(2000)
            .type("{downarrow}")
            .wait(500)
            .type("{enter}");
        cy.intercept("POST", "http://localhost:1337/provider/add").as(
            "agregarProveedor"
        );
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.wait("@agregarProveedor")
            .its("response.statusCode")
            .should("eq", 201);
        cy.url().should("eq", "http://localhost:4200/#/providers");
        cy.wait(sleepLargo);
    });
    it("Añadir Proveedor duplicado con error 400", function () {
        //sección añadir provider
        //módulo administración
        cy.get(".p-element.ng-tns-c21-15").click();
        //módulo proveedores
        cy.get(".ng-tns-c21-17.ng-tns-c21-15 > .p-element").click();
        //boton agregar
        cy.get(".p-button-success").click();
        //formulario
        cy.get("#name").type(this.provider.nombreValido);
        cy.get("#nationality").type(this.provider.nacionalidadValido);
        //giro comercial
        cy.get(".p-dropdown-label").click();
        cy.get(".p-dropdown-filter").type(this.provider.giroComercialValido);
        cy.get(".p-element.ng-star-inserted > .p-ripple").click();
        //añadir producto
        cy.get(
            ":nth-child(4) > .flex > p-button.p-element > .p-ripple"
        ).click();
        //?selecciona producto
        cy.get(
            ":nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-label"
        ).click();
        cy.get(".p-dropdown-filter")
            .type(this.provider.productoValido)
            .type("{downarrow}")
            .wait(500)
            .type("{enter}");
        //garantia
        cy.get("#locale-us").type(this.provider.garantiaValido);
        //temporalidad
        cy.get(
            ":nth-child(4) > .p-inputwrapper > .p-dropdown > .p-dropdown-label"
        ).click();
        cy.get('[ng-reflect-label="Día(s)"] > .p-ripple').click();
        cy.wait(sleepCorto);
        //añadir servicio
        cy.get(
            ":nth-child(5) > .flex > p-button.p-element > .p-ripple"
        ).click();
        //?selecciona servicio
        cy.get("[formControlName='providerServiceServiceId']").click();
        cy.get(".p-dropdown-filter")
            .type(this.provider.servicioValido)
            .type("{downarrow}")
            .wait(500)
            .type("{enter}");
        //garantia
        cy.get('[formControlName="providerProductGuaranteeUnit"]').last().type(this.provider.garantiaValido);
        cy.get(
            "#pr_id_10-table > .p-datatable-tbody > .ng-star-inserted.ng-dirty > :nth-child(4) > .p-inputwrapper > .p-dropdown > .p-dropdown-label"
        ).click();
        cy.get(
            '[ng-reflect-label="Día(s)"] > .p-ripple > .ng-star-inserted'
        ).click();
        //agregar contacto
        cy.get(
            ":nth-child(6) > .flex-wrap > p-button.p-element > .p-ripple"
        ).click();
        //nombre
        cy.get(":nth-child(1) > .col-12 > .p-inputtext").type(
            this.provider.nombreContactoValido
        );
        //telefono
        cy.get(":nth-child(2) > .col-12 > .p-inputtext").type(
            this.provider.telefonoContactoValido
        );
        //email
        cy.get(":nth-child(3) > .col-12 > .p-inputtext").type(
            this.provider.emailConctactoValido
        );
        //agregar direccion
        cy.get(
            ":nth-child(7) > .flex-wrap > p-button.p-element > .p-ripple"
        ).click();
        //descipcion
        cy.get(
            "#pr_id_12-table > .p-datatable-tbody > .p-element.ng-star-inserted > :nth-child(1) > .col-12 > .p-inputtext"
        ).type(this.provider.descripcionDireccionesValido);
        //direccion
        cy.get("#providerLocationAddress")
            .type(this.provider.direccionDireccionesValido)
            .wait(2000)
            .type("{downarrow}")
            .wait(500)
            .type("{enter}");
        cy.intercept("POST", "http://localhost:1337/provider/add").as(
            "agregarProveedor"
        );
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.wait("@agregarProveedor")
            .its("response.statusCode")
            .should("eq", 400);
        cy.url().should("eq", "http://localhost:4200/#/providers/add");
        cy.wait(sleepLargo);
    });
    it("Añadir Proveedor inválido por exceder valores máximos", function () {
        //sección añadir provider
        //módulo administración
        cy.get(".p-element.ng-tns-c21-15").click();
        //módulo proveedores
        cy.get(".ng-tns-c21-17.ng-tns-c21-15 > .p-element").click();
        //boton agregar
        cy.get(".p-button-success").click();
        //formulario
        cy.get("#name").type(this.provider.nombreInvalido);
        cy.get("#nationality").type(this.provider.nacionalidadInvalido);
        //giro comercial
        cy.get(".p-dropdown-label").click();
        cy.get(".p-dropdown-filter").type(this.provider.giroComercialValido);
        cy.get(".p-element.ng-star-inserted > .p-ripple").click();
        //añadir producto
        cy.get(
            ":nth-child(4) > .flex > p-button.p-element > .p-ripple"
        ).click();
        //?selecciona producto
        cy.get(
            ":nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-label"
        ).click();
        cy.get(".p-dropdown-filter")
            .type(this.provider.productoValido)
            .type("{downarrow}")
            .wait(500)
            .type("{enter}");
        //garantia
        cy.get("#locale-us").type(this.provider.garantiaValido);
        //temporalidad
        cy.get(
            ":nth-child(4) > .p-inputwrapper > .p-dropdown > .p-dropdown-label"
        ).click();
        cy.get('[ng-reflect-label="Día(s)"] > .p-ripple').click();
        cy.wait(sleepCorto);
        //añadir servicio
        cy.get(
            ":nth-child(5) > .flex > p-button.p-element > .p-ripple"
        ).click();
        //?selecciona servicio
        cy.get("[formControlName='providerServiceServiceId']").click();
        cy.get(".p-dropdown-filter")
            .type(this.provider.servicioValido)
            .type("{downarrow}")
            .wait(500)
            .type("{enter}");
        //garantia
        cy.get('[formControlName="providerProductGuaranteeUnit"]').last().type(this.provider.garantiaValido)
        cy.get(
            "#pr_id_10-table > .p-datatable-tbody > .ng-star-inserted.ng-dirty > :nth-child(4) > .p-inputwrapper > .p-dropdown > .p-dropdown-label"
        ).click();
        cy.get(
            '[ng-reflect-label="Día(s)"] > .p-ripple > .ng-star-inserted'
        ).click();
        //agregar contacto
        cy.get(
            ":nth-child(6) > .flex-wrap > p-button.p-element > .p-ripple"
        ).click();
        //nombre
        cy.get(":nth-child(1) > .col-12 > .p-inputtext").type(
            this.provider.nombreContactoValido
        );
        //telefono
        cy.get(":nth-child(2) > .col-12 > .p-inputtext").type(
            this.provider.telefonoContactoValido
        );
        //email
        cy.get(":nth-child(3) > .col-12 > .p-inputtext").type(
            this.provider.emailConctactoValido
        );
        //agregar direccion
        cy.get(
            ":nth-child(7) > .flex-wrap > p-button.p-element > .p-ripple"
        ).click();
        //descipcion
        cy.get(
            "#pr_id_12-table > .p-datatable-tbody > .p-element.ng-star-inserted > :nth-child(1) > .col-12 > .p-inputtext"
        ).type(this.provider.descripcionDireccionesValido);
        //direccion
        cy.get("#providerLocationAddress")
            .type(this.provider.direccionDireccionesValido)
            .wait(200)
            .type("{downarrow}")
            .wait(200)
            .type("{enter}");
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.url().should("eq", "http://localhost:4200/#/providers/add");
        cy.wait(sleepLargo);
    });
    it("Añadir Proveedor inválido por campos vacíos", function () {
        //sección añadir provider
        //módulo administración
        cy.get(".p-element.ng-tns-c21-15").click();
        //módulo proveedores
        cy.get(".ng-tns-c21-17.ng-tns-c21-15 > .p-element").click();
        //boton agregar
        cy.get(".p-button-success").click();
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.wait(sleepLargo);
        cy.url().should("eq", "http://localhost:4200/#/providers/add");
    });
});
