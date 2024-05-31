const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Dispositivos",function(){
    beforeEach(function(){
        cy.fixture("monitoringDevices").then(function (monitoringDevices) {
            this.monitoringDevices = monitoringDevices;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    })
    it("Añadir dispositivo válido",function(){
        //módulo operativo
        cy.get('.p-element.ng-tns-c21-44').click();
        //módulo dispositivos
        cy.get('.ng-tns-c21-46.ng-tns-c21-44 > .p-element').click();
        //agregar
        cy.get('.p-button-success').click();
        //nombre
        cy.get('#monitoringDeviceName').type(this.monitoringDevices.nombreValido);
        //cliente
        cy.get(':nth-child(2) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir cliente
        cy.get('.p-dropdown-filter').type(this.monitoringDevices.clienteValido)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //tipo dispositivo
        cy.get(':nth-child(3) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir primera opcion camara
        cy.get('[ng-reflect-label="Cámara"] > .p-ripple').click();
        //proveedor interno
        cy.get('.p-inputswitch-slider').click();
        cy.intercept("POST","http://localhost:1337/monitoringDevice/add").as("añadir");
        cy.wait(sleepLargo)
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.wait("@añadir").its("response.statusCode").should("eq",201);
        cy.url().should("eq","http://localhost:4200/#/monitoringDevices");
        cy.wait(sleepLargo);
    })
    it("Añadir dispositivo inválido por exceso de caracteres",function(){
        //módulo operativo
        cy.get('.p-element.ng-tns-c21-44').click();
        //módulo dispositivos
        cy.get('.ng-tns-c21-46.ng-tns-c21-44 > .p-element').click();
        //agregar dispositivo
        cy.get('.p-button-success').click();
        //nombre
        cy.get('#monitoringDeviceName').type(this.monitoringDevices.nombreInvalido);
        cy.wait(sleepLargo)
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.url().should("eq","http://localhost:4200/#/monitoringDevices/add");
        cy.wait(sleepLargo);
    })
    it("Añadir dispositivo inválido por campos vacíos",function(){
        //módulo operativo
        cy.get('.p-element.ng-tns-c21-44').click();
        //módulo dispositivos
        cy.get('.ng-tns-c21-46.ng-tns-c21-44 > .p-element').click()
        //agregar dispositivo
        cy.get('.p-button-success').click();
        cy.wait(sleepLargo)
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.url().should("eq","http://localhost:4200/#/monitoringDevices/add");
        cy.wait(sleepLargo);
    })
})