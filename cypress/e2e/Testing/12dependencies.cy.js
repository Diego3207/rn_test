const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Directorio/Dependencias",function(){
    beforeEach(function(){
        cy.fixture("dependencies").then(function (dependencies) {
            this.dependencies = dependencies;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    })
    it("Añadir dependencia válido",function(){
        //módulo operativo
        cy.get('.p-element.ng-tns-c21-44').click();
        //módulo directorio
        cy.get('.ng-tns-c21-49.ng-tns-c21-44 > .p-element').click();
        //agregar
        cy.get('.p-button-success').click();
        //nombre
        cy.get('#name').type(this.dependencies.nombreValido);
        //categoria
        cy.get('.p-dropdown-label').click();
        //escribir "recursos"
        cy.get('.p-dropdown-filter')
        .type(this.dependencies.categoriaValido)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //direccion
        cy.get(':nth-child(3) > .p-inputtext').type(this.dependencies.direccionValido);
        //agregar telefono
        cy.get('p-button.p-element > .p-ripple').click();
        //numero
        cy.get('#number > .p-inputtext').type(this.dependencies.numeroValido);
        //extension
        cy.get('#extension').type(this.dependencies.extensionValido);
        //via comunicacion
        cy.get('.p-autocomplete-input')
        .type(this.dependencies.viaComunicacionValido)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //ligado a una persona
        cy.get('.p-checkbox-box').click();
        //nombre
        cy.get('.p-formgrid > :nth-child(1) > #name').type(this.dependencies.nombrePersonaValido);
        //puesto
        cy.get('#job').type(this.dependencies.puestoValido);
        //correo
        cy.get('#email').type(this.dependencies.correoValido);
        cy.intercept("POST","http://localhost:1337/dependency/add").as("añadir");
        cy.wait(sleepLargo)
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.wait("@añadir").its("response.statusCode").should("eq",201);
        cy.url().should("eq","http://localhost:4200/#/directory");
        cy.wait(sleepLargo);
    })
    it("Añadir dependencia inválido por exceso de carecteres",function(){
        //módulo operativo
        cy.get('.p-element.ng-tns-c21-44').click();
        //módulo directorio
        cy.get('.ng-tns-c21-49.ng-tns-c21-44 > .p-element').click()
        //agregar
        cy.get('.p-button-success').click();
        //nombre
        cy.get('#name').type(this.dependencies.nombreInvalido);
        //direccion
        cy.get(':nth-child(3) > .p-inputtext').type(this.dependencies.direccionInvalido);
        //agregar telefono
        cy.get('p-button.p-element > .p-ripple').click();
        //numero
        cy.get('#number > .p-inputtext').type(this.dependencies.numeroValido);
        //extension
        cy.get('#extension').type(this.dependencies.extensionInvalido);
        //ligado a una persona
        cy.get('.p-checkbox-box').click();
        //nombre
        cy.get('.p-formgrid > :nth-child(1) > #name').type(this.dependencies.nombrePersonaInvalido);
        //puesto
        cy.get('#job').type(this.dependencies.puestoInvalido);
        //correo
        cy.get('#email').type(this.dependencies.correoInvalido);
        cy.wait(sleepLargo)
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.url().should("eq","http://localhost:4200/#/directory/add");
        cy.wait(sleepLargo);
    })
    it("Añadir dependencia inválido por campos vacíos",function(){
        //módulo operativo
        cy.get('.p-element.ng-tns-c21-44').click();
        //módulo directorio
        cy.get('.ng-tns-c21-49.ng-tns-c21-44 > .p-element').click()
        //agregar
        cy.get('.p-button-success').click();
        //agregar telefono
        cy.get('p-button.p-element > .p-ripple').click();
        //ligado a una persona
        cy.get('.p-checkbox-box').click();
        cy.wait(sleepLargo)
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.url().should("eq","http://localhost:4200/#/directory/add");
        cy.wait(sleepLargo);
    })
})