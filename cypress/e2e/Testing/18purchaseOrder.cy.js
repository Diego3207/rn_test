const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Orden de compra",function(){
    beforeEach(function(){
        cy.fixture("purchaseOrder").then(function (variable) {
            this.variable = variable;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    })
    it("Crear orden de compra valida sin cotización con 1 producto y 1 servicio",function(){
        //?CREAR ORDEN DE COMPRA
        //sección añadir provider
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //ordenes
        cy.get('.p-element.ng-tns-c21-21').click();
        //de compra
        cy.get('.ng-tns-c21-26.ng-tns-c21-21 > .p-element').click();
        //boton agregar
        cy.get(".p-button-success").click();
        cy.wait(300)
        //nombre
        cy.get("#name").type(this.variable.descripcionValida);
        //proveedor
        cy.get(':nth-child(3) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir proveedor
        cy.get('.p-dropdown-filter')
        .type(this.variable.proveedorValida)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        cy.get(':nth-child(5) > .flex > p-button.p-element > .p-ripple').click();
        cy.wait(200)
        //producto
        cy.get(':nth-child(1) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir producto
        cy.get('.p-dropdown-filter').type(this.variable.productoValida)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //unidad
        cy.get(':nth-child(2) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir "pieza"
        cy.get('[ng-reflect-label="Pieza"] > .p-ripple').click();
        //cantidad
        cy.get('#locale-us').type(this.variable.cantidadValida);
        //precio
        cy.get(':nth-child(4) > .col-12 > .p-inputwrapper > .p-inputnumber > .p-inputtext').type(this.variable.precioValida);
        //agregar servicio
        cy.get(':nth-child(6) > .flex-wrap > p-button.p-element > .p-ripple').click();
        //servicio
        cy.get(':nth-child(1) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').last().click();
        //escribir "Material"
        cy.get('.p-dropdown-filter')
        .type(this.variable.servicioValida)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //unidad
        cy.get(':nth-child(2) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').last().click();
        //elegir "anual"
        cy.get('[ng-reflect-label="Anual"] > .p-ripple').click();
        //cantidad
        cy.get('[formControlName="purchaseOrderServiceQuantity"]').type(this.variable.cantidadValida);
        //precio
        cy.get(':nth-child(4) > .col-12 > .p-inputwrapper > .p-inputnumber > .p-inputtext').last().type(this.variable.precioValida);
        cy.intercept("POST", "http://localhost:1337/purchaseOrder/add").as(
            "añadirProducto"
        );
        cy.wait(sleepLargo);
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.wait("@añadirProducto").its("response.statusCode").should("eq", 201);
        cy.url().should("eq", "http://localhost:4200/#/orders");
        cy.wait(sleepLargo);
    })
    it("Abastecer compra válida con 1 producto y 1 servicio",function(){
        //?CREAR ORDEN DE COMPRA
        //sección añadir provider
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //ordenes
        cy.get('.p-element.ng-tns-c21-21').click();
        //de compra
        cy.get('.ng-tns-c21-26.ng-tns-c21-21 > .p-element').click();
        //estado
        cy.get('[psortablecolumn="purchaseOrderStatus"]').click();
        //boton abastecer
        cy.get(":nth-child(1) > :nth-child(6) > .flex > .p-button-success")
            .first()
            .click();
        //observaciones
        cy.wait(400)
        cy.get("#reason").type("eb");
        cy.get(".p-button-primary").click();
        //asignar persona
        cy.get(
            ".field > .p-inputwrapper > .p-dropdown > .p-dropdown-label"
        ).click();
        //elijo "administrador"
        cy.get(".p-element.ng-star-inserted > .p-ripple").click();
        //producto 1
        //serial
        cy.get('[ng-reflect-name="0"] > :nth-child(2) > .col-12 > #key').type(
            this.variable.serialValida
        );
        //ubicacion
        cy.get(':nth-child(3) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger').click();
        cy.wait(200)
        cy.get('.p-dropdown-filter')
        .type("Oficina")
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //estado
        cy.get(':nth-child(4) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger').click();
        //elegir "disponible"
        cy.get('[ng-reflect-label="Disponible"] > .p-ripple').click();
        //observacion
        cy.get(
            '[ng-reflect-name="0"] > :nth-child(5) > .col-12 > #reason'
        ).type("na");
        //boton abastecer
        cy.get("#p-tabpanel-0 > .mt-4 > .p-button-primary").click();
        cy.wait(sleepLargo);
        cy.url().should("eq", "http://localhost:4200/#/orders");
        cy.wait(sleepLargo);
    })
    it("Crear orden de compra invalida por exceso de caracteres y por productos duplicados",function(){
        //?CREAR ORDEN DE COMPRA
        //sección añadir provider
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //ordenes
        cy.get('.p-element.ng-tns-c21-21').click();
        //de compra
        cy.get('.ng-tns-c21-26.ng-tns-c21-21 > .p-element').click();
        //boton agregar
        cy.get(".p-button-success").click();
        cy.wait(300)
        //nombre
        cy.get("#name").type(this.variable.descripcionInvalida);
        //proveedor
        cy.get(':nth-child(3) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir proveedor
        cy.get('.p-dropdown-filter')
        .type(this.variable.proveedorValida)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //agregar producto
        cy.get(':nth-child(5) > .flex > p-button.p-element > .p-ripple').click();
        cy.wait(200)
        //producto
        cy.get(':nth-child(1) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir producto
        cy.get('.p-dropdown-filter').type(this.variable.productoValida)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //unidad
        cy.get(':nth-child(2) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir "pieza"
        cy.get('[ng-reflect-label="Pieza"] > .p-ripple').click();
        //cantidad
        cy.get('#locale-us').type(this.variable.cantidadValida);
        //precio
        cy.get(':nth-child(4) > .col-12 > .p-inputwrapper > .p-inputnumber > .p-inputtext').type(this.variable.precioValida);
        //agregar producto 2
        cy.get(':nth-child(5) > .flex > p-button.p-element > .p-ripple').click();
        cy.wait(200)
        //producto 2
        cy.get(':nth-child(1) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').last().click();
        //escribir producto 2
        cy.get('.p-dropdown-filter').type(this.variable.productoValida)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //agregar servicio
        cy.get(':nth-child(6) > .flex-wrap > p-button.p-element > .p-ripple').click();
        //servicio
        cy.get(':nth-child(1) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').last().click();
        //escribir "Material"
        cy.get('.p-dropdown-filter')
        .type(this.variable.servicioValida)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //unidad
        cy.get(':nth-child(2) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').last().click();
        //elegir "anual"
        cy.get('[ng-reflect-label="Anual"] > .p-ripple').click();
        //cantidad
        cy.get('[formControlName="purchaseOrderServiceQuantity"]').type(this.variable.cantidadValida);
        //precio
        cy.get(':nth-child(4) > .col-12 > .p-inputwrapper > .p-inputnumber > .p-inputtext').last().type(this.variable.precioValida);
        //agregar servicio 2
        cy.get(':nth-child(6) > .flex-wrap > p-button.p-element > .p-ripple').click();
        //servicio 2
        cy.get(':nth-child(1) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').last().click();
        //escribir "Material"
        cy.get('.p-dropdown-filter')
        .type(this.variable.servicioValida)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        cy.wait(sleepLargo);
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.url().should("eq", "http://localhost:4200/#/orders/add");
        cy.wait(sleepLargo);
    })
    it("Crear orden de compra invalida por campos vacíos",function(){
        //?CREAR ORDEN DE COMPRA
        //sección añadir provider
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //ordenes
        cy.get('.p-element.ng-tns-c21-21').click();
        //de compra
        cy.get('.ng-tns-c21-26.ng-tns-c21-21 > .p-element').click();
        //boton agregar
        cy.get(".p-button-success").click();
        cy.wait(300)
        cy.wait(sleepLargo);
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.url().should("eq", "http://localhost:4200/#/orders/add");
        cy.wait(sleepLargo);
    })
    it("Crear cotizacion de compra con 1 producto y 1 servicio",function(){
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //módulo cotizaciones
        cy.get('.p-element.ng-tns-c21-20').click();
        //compra
        cy.get('.ng-tns-c21-24.ng-tns-c21-20 > .p-element').click();
        //boton agregar
        cy.get(".p-button-success").click();
        cy.wait(400)
        //proveedor
        cy.get('.p-dropdown-label').click();
        //escribe "concox"
        cy.get('.p-dropdown-filter')
        .type(this.variable.proveedorValida)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //descripcion
        cy.get('#name').type(this.variable.descripcionValida);
        //agregar producto
        cy.get(':nth-child(3) > .flex > p-button.p-element > .p-ripple').click();
        //producto
        cy.get('.ng-untouched.ng-star-inserted > :nth-child(1) > :nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir "qbit"
        cy.get('.p-dropdown-filter')
        .type(this.variable.productoValida)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //unidad
        cy.get('.col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir primera opcion
        cy.get('[ng-reflect-label="Pieza"] > .p-ripple').click();
        //cantidad
        cy.get('#locale-us').type(this.variable.cantidadValida);
        //agregar servicio
        cy.get(':nth-child(4) > .flex-wrap > p-button.p-element > .p-ripple').click();
        //servicio
        cy.get('.ng-untouched.ng-star-inserted > :nth-child(1) > :nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir "instala"
        cy.get('.p-dropdown-filter')
        .type(this.variable.servicioValida)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //unidad
        cy.get('.ng-invalid.ng-star-inserted > :nth-child(2) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir primera opcion
        cy.get('[ng-reflect-label="Anual"] > .p-ripple').click();
        //cantidad
        cy.get('.ng-invalid.ng-star-inserted > :nth-child(3) > .col-12 > .p-inputwrapper > .p-inputnumber > #locale-us').type(this.variable.cantidadValida);
        cy.get(".p-button-primary").click();
        cy.wait(sleepLargo);
    })
    it("Procesar cotización de compra",function(){
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
        cy.wait(400)
        //tiempo de entrega
        cy.get('.p-calendar > .p-inputtext').click();
        //dia 10
        cy.get('tbody.ng-tns-c88-59 > :nth-child(2) > :nth-child(4) > .p-ripple').click();
        //garantia
        cy.get('.p-inputswitch-slider').click();
        //precio 1
        cy.get('[formControlName="quotationPurchaseProductPrice"]').type(this.variable.precioValida);
        //precio 2
        cy.get('[formControlName="quotationPurchaseServicePrice"]').type(this.variable.precioValida);
        cy.wait(sleepLargo);
        cy.get(".p-button-primary").click();
        cy.wait(sleepLargo);
    })
    it("Crear orden de compra valida con cotización con 1 producto y 1 servicio",function(){
        //?CREAR ORDEN DE COMPRA
        //sección añadir provider
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //ordenes
        cy.get('.p-element.ng-tns-c21-21').click();
        //de compra
        cy.get('.ng-tns-c21-26.ng-tns-c21-21 > .p-element').click();
        //boton agregar
        cy.get(".p-button-success").click();
        cy.wait(400)
        //nombre
        cy.get("#name").type(this.variable.descripcionValida);
        //cotización
        cy.get(':nth-child(2) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').first().click();
        //escribir "1 chip"
        cy.get('.p-dropdown-filter')
        .type(this.variable.cotizacionValida)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        cy.intercept("POST", "http://localhost:1337/purchaseOrder/add").as(
            "añadirProducto"
        );
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.wait("@añadirProducto").its("response.statusCode").should("eq", 201);
        cy.url().should("eq", "http://localhost:4200/#/orders");
        cy.wait(sleepLargo);
    })
    it("Abastecer compra invalida por campos vacíos al recibir",function(){
        //?CREAR ORDEN DE COMPRA
        //sección añadir provider
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //ordenes
        cy.get('.p-element.ng-tns-c21-21').click();
        //de compra
        cy.get('.ng-tns-c21-26.ng-tns-c21-21 > .p-element').click();
        //estado
        cy.get('[psortablecolumn="purchaseOrderStatus"]').click();
        //boton abastecer
        cy.get(":nth-child(1) > :nth-child(6) > .flex > .p-button-success")
            .first()
            .click();
        cy.wait(400)
        //siguiente
        cy.get(".p-button-primary").click();
        //nombre quien recibe
        cy.get('.field > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //boton abastecer para validar que salió de la ventana anterior
        cy.get("#p-tabpanel-0 > .mt-4 > .p-button-primary").click();
        cy.wait(sleepLargo);
        cy.url().should("eq", "http://localhost:4200/#/orders");
        cy.wait(sleepLargo);
        //aquí va a salir un error pero es necesario para la prueba.
    })
    it("Abastecer compra invalida por campos vacíos al abastecer",function(){
        //?CREAR ORDEN DE COMPRA
        //sección añadir provider
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //ordenes
        cy.get('.p-element.ng-tns-c21-21').click();
        //de compra
        cy.get('.ng-tns-c21-26.ng-tns-c21-21 > .p-element').click();
        //estado
        cy.get('[psortablecolumn="purchaseOrderStatus"]').click();
        //boton abastecer
        cy.get(":nth-child(1) > :nth-child(6) > .flex > .p-button-success")
            .first()
            .click();
        cy.wait(400)
        //observaciones
        cy.get("#reason").type("eb");
        //siguiente
        cy.get(".p-button-primary").click();
        //boton abastecer
        cy.get("#p-tabpanel-0 > .mt-4 > .p-button-primary").click();
        //agregar sólo para validar que pasó el test
        cy.get('.my-2 > .p-button-success')
        cy.wait(sleepLargo);
        cy.url().should("eq", "http://localhost:4200/#/orders");
        cy.wait(sleepLargo);
    })
})