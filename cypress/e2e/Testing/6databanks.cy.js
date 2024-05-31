const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Cuentas bancaria",function(){
    beforeEach(function(){
        cy.fixture("databank").then(function (databank) {
            this.databank = databank;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    })
    it("Añadir Cuenta bancaria válido",function(){
        //sección añadir provider
        //módulo administración
        cy.get(".p-element.ng-tns-c21-15").click();
        //módulo cuentas de banco
        cy.get('.ng-tns-c21-19.ng-tns-c21-15 > .p-element').click();
        //boton agregar
        cy.get('.p-button-success').click();
        //nombre beneficiario
        cy.get('#dataBankBeneficiaryName').type(this.databank.nombreBeneficiarioValido);
        //nombre institución bancaria
        cy.get(':nth-child(2) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        cy.get('.p-dropdown-filter').type(this.databank.nombreInstitucionValido).wait(200).type("{downarrow}").wait(200).type("{enter}");
        //medio pago
        cy.get(':nth-child(3) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //primera opcion
        cy.get('[ng-reflect-label="Tarjeta Bancaria"] > .p-ripple').click();
        cy.wait(sleepCorto);
        //numero
        cy.get('#dataBankNumber').type(this.databank.numeroValido);
        //propietario
        cy.get(':nth-child(5) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //primera opcion
        cy.get('[ng-reflect-label="Cliente"] > .p-ripple').click();
        cy.intercept("POST","http://localhost:1337/databank/add").as("añadirCuentaBanco");
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.wait("@añadirCuentaBanco").its("response.statusCode").should("eq",201)
        cy.url().should("eq","http://localhost:4200/#/databanks")
        cy.wait(sleepLargo)
    })
    it("Añadir Cuenta bancaria por un campo inexistente",function(){
        //sección añadir provider
        //módulo administración
        cy.get(".p-element.ng-tns-c21-15").click();
        //módulo cuentas de banco
        cy.get('.ng-tns-c21-19.ng-tns-c21-15 > .p-element').click();
        //boton agregar
        cy.get('.p-button-success').click();
        //nombre beneficiario
        cy.get('#dataBankBeneficiaryName').type(this.databank.nombreBeneficiarioValido);
        //nombre institución bancaria
        cy.get(':nth-child(2) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        cy.get('.p-dropdown-filter').type(this.databank.nombreInstitucionValido).wait(200).type("{downarrow}").wait(200).type("{enter}");
        //medio pago
        cy.get(':nth-child(3) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //primera opcion
        cy.get('[ng-reflect-label="Tarjeta Bancaria"] > .p-ripple').click();
        cy.wait(sleepCorto);
        //numero
        //propietario
        cy.get(':nth-child(5) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //primera opcion
        cy.get('[ng-reflect-label="Cliente"] > .p-ripple').click();
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.url().should("eq","http://localhost:4200/#/databanks/add")
        cy.wait(sleepLargo)
    })
    it("Añadir Cuenta bancaria inválido por exceso de caracteres",function(){
        //sección añadir provider
        //módulo administración
        cy.get(".p-element.ng-tns-c21-15").click();
        //módulo cuentas de banco
        cy.get('.ng-tns-c21-19.ng-tns-c21-15 > .p-element').click();
        //boton agregar
        cy.get('.p-button-success').click();
        //nombre beneficiario
        cy.get('#dataBankBeneficiaryName').type(this.databank.nombreBeneficiarioInvalido);
        //numero
        cy.get('#dataBankNumber').type(this.databank.numeroInvalido);
        cy.wait(sleepCorto);
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.url().should("eq","http://localhost:4200/#/databanks/add")
        cy.wait(sleepLargo)
    })
})