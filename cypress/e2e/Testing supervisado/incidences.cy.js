const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Incidencias",function(){
    beforeEach(function(){
        cy.fixture("incidences").then(function (incidences) {
            this.incidences = incidences;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    })
    it("Añadir Incidencia válido",function(){
        //módulo operativo
        cy.get('.p-element.ng-tns-c21-44').click();
        //módulo incidencias
        cy.get('.ng-tns-c21-48.ng-tns-c21-44 > .p-element').click();
        //agregar
        cy.get('.p-button-success').click();
        cy.wait(300)
        //cliente
        cy.get(':nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir cliente
        cy.get('.p-dropdown-filter')
        .type(this.incidences.clienteValido)
        .wait(400)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //fuente información
        cy.get(':nth-child(2) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir "personal del centro de monitoreo"
        cy.get('[ng-reflect-label="Personal del centro de monitor"] > .p-ripple').click();
        //datos informante
        cy.get(':nth-child(3) > #name').type(this.incidences.datosInformanteValido);
        //clasificación de incidencia
        cy.get(':nth-child(4) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir "operativa"
        cy.get('[ng-reflect-label="Operativa"] > .p-ripple').click();
        //cuadrante
        cy.get(':nth-child(5) > #name').type(this.incidences.cuadranteValido);
        //seleccionar primer dispositivo
        cy.get(':nth-child(1) > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').click();
        //presento falla
        cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(6) > .p-element').click();
        //fecha inicio
        cy.get(':nth-child(1) > .p-inputwrapper > .p-calendar > .p-inputtext').click();
        //día 10
        cy.get('tbody.ng-tns-c88-59 > :nth-child(2) > :nth-child(4) > .p-ripple').click();
        //fecha fin
        cy.get(':nth-child(2) > .p-inputwrapper > .p-calendar > .p-inputtext').click();
        //día 11
        cy.get('tbody.ng-tns-c88-60 > :nth-child(2) > :nth-child(5)').click();
        //descripcion hechos
        cy.get(':nth-child(8) > :nth-child(2) > .ng-untouched').type(this.incidences.descripcionValido);
        cy.wait(sleepLargo);
        //personas involucradas
        cy.get(':nth-child(9) > div > .ng-untouched').type(this.incidences.personaInvolucradaValido);
        //vehiculos involucrados
        cy.get(':nth-child(10) > div > .ng-untouched').type(this.incidences.vehiculoInvolucradoValido);
        //agregar via coordinación
        cy.get('p-button.p-element > .p-ripple').click();
        //elegir via
        cy.get('.col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        cy.get('.p-dropdown-filter')
        .type(this.incidences.viaCoordinacionValido)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //evidencia
        cy.get('.p-fileupload-buttonbar > .p-ripple').click();
        cy.wait(3000)
        //observaciones
        cy.get(':nth-child(13) > div > .ng-untouched').type(this.incidences.observacionesValido);
        //validacion - falso positivo
        cy.get(':nth-child(2) > .p-element > .p-radiobutton > .p-radiobutton-box').click();
        cy.intercept("POST","http://localhost:1337/incidence/add").as("añadir");
        cy.wait(sleepLargo)
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.wait("@añadir").its("response.statusCode").should("eq",201);
        cy.url().should("eq","http://localhost:4200/#/incidences");
        cy.wait(sleepLargo)
    })
    it("Añadir Incidencia inválido por duplicado",function(){
        //módulo operativo
        cy.get('.p-element.ng-tns-c21-44').click();
        //módulo incidencias
        cy.get('.ng-tns-c21-48.ng-tns-c21-44 > .p-element').click();
        //agregar
        cy.get('.p-button-success').click();
        cy.wait(300)
        //cliente
        cy.get(':nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir cliente
        cy.get('.p-dropdown-filter')
        .type(this.incidences.clienteValido)
        .wait(400)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //fuente información
        cy.get(':nth-child(2) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir "personal del centro de monitoreo"
        cy.get('[ng-reflect-label="Personal del centro de monitor"] > .p-ripple').click();
        //datos informante
        cy.get(':nth-child(3) > #name').type(this.incidences.datosInformanteValido);
        //clasificación de incidencia
        cy.get(':nth-child(4) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir "operativa"
        cy.get('[ng-reflect-label="Operativa"] > .p-ripple').click();
        //cuadrante
        cy.get(':nth-child(5) > #name').type(this.incidences.cuadranteValido);
        //seleccionar primer dispositivo
        cy.get(':nth-child(1) > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').click();
        //presento falla
        cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(6) > .p-element').click();
        //fecha inicio
        cy.get(':nth-child(1) > .p-inputwrapper > .p-calendar > .p-inputtext').click();
        //día 10
        cy.get('tbody.ng-tns-c88-59 > :nth-child(2) > :nth-child(4) > .p-ripple').click();
        //fecha fin
        cy.get(':nth-child(2) > .p-inputwrapper > .p-calendar > .p-inputtext').click();
        //día 11
        cy.get('tbody.ng-tns-c88-60 > :nth-child(2) > :nth-child(5)').click();
        //descripcion hechos
        cy.get(':nth-child(8) > :nth-child(2) > .ng-untouched').type(this.incidences.descripcionValido);
        cy.wait(sleepLargo);
        //personas involucradas
        cy.get(':nth-child(9) > div > .ng-untouched').type(this.incidences.personaInvolucradaValido);
        //vehiculos involucrados
        cy.get(':nth-child(10) > div > .ng-untouched').type(this.incidences.vehiculoInvolucradoValido);
        //agregar via coordinación
        cy.get('p-button.p-element > .p-ripple').click();
        //elegir via
        cy.get('.col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        cy.get('.p-dropdown-filter')
        .type(this.incidences.viaCoordinacionValido)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //agregar via coordinación 2
        cy.get('p-button.p-element > .p-ripple').click();
        //elegir via 2
        cy.get('.col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').last().click();
        cy.get('.p-dropdown-filter')
        .type(this.incidences.viaCoordinacionValido)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //evidencia
        cy.get('.p-fileupload-buttonbar > .p-ripple').click();
        cy.wait(3000)
        //observaciones
        cy.get(':nth-child(13) > div > .ng-untouched').type(this.incidences.observacionesValido);
        //validacion - falso positivo
        cy.get(':nth-child(2) > .p-element > .p-radiobutton > .p-radiobutton-box').click();
        cy.wait(sleepLargo)
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.url().should("eq","http://localhost:4200/#/incidences/add");
    })
    it("Añadir Incidencia inválido por enviar equipo sin falla",function(){
        //módulo operativo
        cy.get('.p-element.ng-tns-c21-44').click();
        //módulo incidencias
        cy.get('.ng-tns-c21-48.ng-tns-c21-44 > .p-element').click();
        //agregar
        cy.get('.p-button-success').click();
        cy.wait(300)
        //cliente
        cy.get(':nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir cliente
        cy.get('.p-dropdown-filter')
        .type(this.incidences.clienteValido)
        .wait(400)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //fuente información
        cy.get(':nth-child(2) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir "personal del centro de monitoreo"
        cy.get('[ng-reflect-label="Personal del centro de monitor"] > .p-ripple').click();
        //datos informante
        cy.get(':nth-child(3) > #name').type(this.incidences.datosInformanteValido);
        //clasificación de incidencia
        cy.get(':nth-child(4) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir "operativa"
        cy.get('[ng-reflect-label="Operativa"] > .p-ripple').click();
        //cuadrante
        cy.get(':nth-child(5) > #name').type(this.incidences.cuadranteValido);
        //seleccionar primer dispositivo
        cy.get(':nth-child(1) > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').click();
        //fecha inicio
        cy.get(':nth-child(1) > .p-inputwrapper > .p-calendar > .p-inputtext').click();
        //día 10
        cy.get('tbody.ng-tns-c88-59 > :nth-child(2) > :nth-child(4) > .p-ripple').click();
        //fecha fin
        cy.get(':nth-child(2) > .p-inputwrapper > .p-calendar > .p-inputtext').click();
        //día 11
        cy.get('tbody.ng-tns-c88-60 > :nth-child(2) > :nth-child(5)').click();
        //descripcion hechos
        cy.get(':nth-child(8) > :nth-child(2) > .ng-untouched').type(this.incidences.descripcionValido);
        cy.wait(sleepLargo);
        //personas involucradas
        cy.get(':nth-child(9) > div > .ng-untouched').type(this.incidences.personaInvolucradaValido);
        //vehiculos involucrados
        cy.get(':nth-child(10) > div > .ng-untouched').type(this.incidences.vehiculoInvolucradoValido);
        //agregar via coordinación
        cy.get('p-button.p-element > .p-ripple').click();
        //elegir via
        cy.get('.col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        cy.get('.p-dropdown-filter')
        .type(this.incidences.viaCoordinacionValido)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //evidencia
        cy.get('.p-fileupload-buttonbar > .p-ripple').click();
        cy.wait(3000)
        //observaciones
        cy.get(':nth-child(13) > div > .ng-untouched').type(this.incidences.observacionesValido);
        //validacion - falso positivo
        cy.get(':nth-child(2) > .p-element > .p-radiobutton > .p-radiobutton-box').click();
        cy.intercept("POST","http://localhost:1337/incidence/add").as("añadir");
        cy.wait(sleepLargo)
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.wait("@añadir").its("response.statusCode").should("eq",201);
        cy.url().should("eq","http://localhost:4200/#/incidences");
    })
    it.only("Añadir Incidencia inválido por enviar equipo sin falla",function(){
        //módulo operativo
        cy.get('.p-element.ng-tns-c21-44').click();
        //módulo incidencias
        cy.get('.ng-tns-c21-48.ng-tns-c21-44 > .p-element').click();
        //agregar
        cy.get('.p-button-success').click();
        cy.wait(sleepLargo)
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.url().should("eq","http://localhost:4200/#/incidences/add");
    })
})