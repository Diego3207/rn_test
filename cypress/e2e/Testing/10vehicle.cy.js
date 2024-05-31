const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Vehículos",function(){
    beforeEach(function(){
        cy.fixture("vehicle").then(function (vehicle) {
            this.vehicle = vehicle;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    })
    it("Añadir Vehículo válido",function(){
       //módulo instalaciones
       cy.get('.p-element.ng-tns-c21-34').click();
       //módulo instalación
       cy.get('.ng-tns-c21-37.ng-tns-c21-34 > .p-element').click();
       //boton agregar
        cy.get('.p-button-success').click();
        //cliente
        cy.get('.p-dropdown-label').click();
        cy.get('[formControlName="vehicleCostumerId"]').type(this.vehicle.clienteValido).wait(500).type("{downarrow}").wait(500).type("{enter}");
        cy.get('#vehicleBrand').type(this.vehicle.marcaValido);
        cy.get('#vehicleModel').type(this.vehicle.modeloValido);
        cy.get('#vehicleYear').type(this.vehicle.anoValido);
        cy.get('#vehicleVin').type(this.vehicle.vinValido);
        cy.get('#vehiclePlateNumber').type(this.vehicle.placaValido);
        cy.get('#vehicleColor').type(this.vehicle.colorValido);
        cy.intercept("POST","http://localhost:1337/vehicle/add").as("añadir");
        //boton guardar
        cy.wait(sleepLargo)
        cy.get('.p-button-primary').click();
        cy.wait("@añadir").its("response.statusCode").should("eq",201);
        cy.url().should("eq","http://localhost:4200/#/vehicles");
        cy.wait(sleepLargo)
    })
    it("Añadir Vehículo inválido por exceso de caracteres",function(){
       //módulo instalaciones
       cy.get('.p-element.ng-tns-c21-34').click();
       //módulo instalación
       cy.get('.ng-tns-c21-37.ng-tns-c21-34 > .p-element').click();
       //boton agregar
        cy.get('.p-button-success').click();
        //cliente
        cy.get('.p-dropdown-label').click();
        cy.get('[formControlName="vehicleCostumerId"]').type(this.vehicle.clienteValido).wait(500).type("{downarrow}").wait(500).type("{enter}");
        cy.get('#vehicleBrand').type(this.vehicle.marcaInvalido);
        cy.get('#vehicleModel').type(this.vehicle.modeloInvalido);
        cy.get('#vehicleYear').type(this.vehicle.anoInvalido);
        cy.get('#vehicleVin').type(this.vehicle.vinInvalido);
        cy.get('#vehiclePlateNumber').type(this.vehicle.placaInvalido);
        cy.get('#vehicleColor').type(this.vehicle.colorInvalido);
        //boton guardar
        cy.wait(sleepLargo)
        cy.get('.p-button-primary').click();
        cy.url().should("eq","http://localhost:4200/#/vehicles/add");
        cy.wait(sleepLargo);
    })
    it("Añadir Vehículo inválido por campos vacíos",function(){
       //módulo instalaciones
       cy.get('.p-element.ng-tns-c21-34').click();
       //módulo instalación
       cy.get('.ng-tns-c21-37.ng-tns-c21-34 > .p-element').click();
       //boton agregar
        cy.get('.p-button-success').click();
        //boton guardar
        cy.wait(sleepLargo)
        cy.get('.p-button-primary').click();
        cy.url().should("eq","http://localhost:4200/#/vehicles/add");
        cy.wait(sleepLargo);
    })
})