const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Orden de venta",function(){
    beforeEach(function(){
        cy.fixture("saleOrder").then(function (variable) {
            this.variable = variable;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    })
    it("Crear orden de compra valida 2 chips y 2 qbit ",function(){
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
        .type(this.variable.proveedor)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //añadir producto
        cy.get(':nth-child(5) > .flex > p-button.p-element > .p-ripple').click();
        cy.wait(200)
        //seleccionar producto
        cy.get(':nth-child(1) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir producto
        cy.get('.p-dropdown-filter').type(this.variable.producto1)
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
        cy.get(':nth-child(4) > .col-12 > .p-inputwrapper > .p-inputnumber > .p-inputtext').type(this.variable.precio);
        //añadir producto 2
        cy.get(':nth-child(5) > .flex-wrap > p-button.p-element > .p-ripple').click();
        //seleccionar producto 2
        cy.get(':nth-child(1) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').last().click();
        //escribir producto 2
        cy.get('.p-dropdown-filter').type(this.variable.producto2)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //unidad
        cy.get(':nth-child(2) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').last().click();
        //elegir "pieza"
        cy.get('[ng-reflect-label="Pieza"] > .p-ripple').click();
        //cantidad
        cy.get('.ng-invalid.ng-star-inserted > :nth-child(3) > .col-12 > .p-inputwrapper > .p-inputnumber > #locale-us').type(this.variable.cantidadValida);
        //precio
        cy.get(':nth-child(4) > .col-12 > .p-inputwrapper > .p-inputnumber > .p-inputtext').last().type(this.variable.precio);
        //boton guardar
        cy.get(".p-button-primary").click();
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
        cy.get("#reason").type("eb");
        cy.wait(4200)
        //cambiar switch para abastecer uno por uno
        cy.get('.p-inputswitch-slider').click();
        //asignar persona
        cy.get(
            ".field > .p-inputwrapper > .p-dropdown > .p-dropdown-label"
        ).click();
        //elijo "administrador"
        cy.get(".p-element.ng-star-inserted > .p-ripple").click();
        //producto 1
        //serial
        cy.get('[ng-reflect-name="0"] > :nth-child(2) > .col-12 > #key').type(
            this.variable.serial1
        );
        //ubicacion
        cy.get('[ng-reflect-name="0"] > :nth-child(3) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        cy.wait(200)
        cy.get('.p-dropdown-filter')
        .type("Oficina")
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        cy.wait(500)
        //estado
        cy.get('[ng-reflect-name="0"] > :nth-child(4) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir "disponible"
        cy.get('[ng-reflect-label="Disponible"] > .p-ripple').click();
        //producto 2
        //serial
        cy.get('[ng-reflect-name="1"] > :nth-child(2) > .col-12 > #key').type(
            this.variable.serial2
        );
        //ubicacion
        cy.get('[ng-reflect-name="1"] > :nth-child(3) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        cy.wait(200)
        cy.get('.p-dropdown-filter')
        .type("Oficina")
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        cy.wait(500)
        //estado
        cy.get('[ng-reflect-name="1"] > :nth-child(4) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir "disponible"
        cy.get('[ng-reflect-label="Disponible"] > .p-ripple').click();
        //producto 3
        //serial
        cy.get('[ng-reflect-name="2"] > :nth-child(2) > .col-12 > #key').type(
            this.variable.serial2
        );
        //ubicacion
        cy.get('[ng-reflect-name="2"] > :nth-child(3) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        cy.wait(200)
        cy.get('.p-dropdown-filter')
        .type("Oficina")
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        cy.wait(500)
        //estado
        cy.get('[ng-reflect-name="2"] > :nth-child(4) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir "disponible"
        cy.get('[ng-reflect-label="Disponible"] > .p-ripple').click();
        //producto 4
        //serial
        cy.get('[ng-reflect-name="3"] > :nth-child(2) > .col-12 > #key').type(
            this.variable.serial2
        );
        //ubicacion
        cy.get('[ng-reflect-name="3"] > :nth-child(3) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        cy.wait(200)
        cy.get('.p-dropdown-filter')
        .type("Oficina")
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        cy.wait(500)
        //estado
        cy.get('[ng-reflect-name="3"] > :nth-child(4) > .col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //elegir "disponible"
        cy.get('[ng-reflect-label="Disponible"] > .p-ripple').click();
        //boton abastecer
        //cy.get("#p-tabpanel-0 > .mt-4 > .p-button-primary").click();
        cy.wait(sleepLargo);
    })
    it("Crear cotizacion de venta válida",function(){
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //módulo cotizaciones
        cy.get('.p-element.ng-tns-c21-20').click();
        //venta
        cy.get('.ng-tns-c21-23.ng-tns-c21-20 > .p-element').click();
        //boton agregar
        cy.get('.p-button-success').click();
        //descripcion
        cy.get('#name').type(this.variable.descripcionValida);
        //cliente
        cy.get(':nth-child(2) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir "mattel"
        cy.get('.p-dropdown-filter')
        .type(this.variable.clienteValida)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //garantia
        cy.get('.p-inputswitch-slider').click();
        //tipo condiciones comerciales
        cy.get(':nth-child(5) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir "equipo"
        cy.get('.p-dropdown-filter')
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //tipo moneda
        cy.get('#pr_id_13_label').click();
        cy.get('.p-dropdown-filter').last()
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //agregar producto
        cy.get(':nth-child(8) > .flex > p-button.p-element > .p-ripple').click();
        //producto
        cy.get('.col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribrir "qbit"
        cy.get('.p-dropdown-filter')
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //cantidad
        cy.get(':nth-child(3) > .col-12 > .p-inputwrapper > .p-inputnumber > #locale-us').type(this.variable.cantidadValida);
        //descuento
        cy.get(':nth-child(4) > .col-12 > .p-inputwrapper > .p-inputnumber > #locale-us').type(this.variable.descuentoValida);
        //porcentaje
        cy.get('.p-checkbox-box').first().click();
        //agregar servicio
        cy.get(':nth-child(9) > .flex > p-button.p-element > .p-ripple').click();
        //servicio
        cy.get(':nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').last().click();
        //escribir "Instalacion"
        cy.get('.p-dropdown-filter')
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //cantidad
        cy.get(':nth-child(3) > .col-12 > .p-inputwrapper > .p-inputnumber > #locale-us').last().type(this.variable.cantidadValida);
        //descuento
        cy.get(':nth-child(4) > .col-12 > .p-inputwrapper > .p-inputnumber > #locale-us').last().type(this.variable.descuentoValida);
        //agregar paquete
        cy.get(':nth-child(10) > .flex > p-button.p-element > .p-ripple').click();
        //paquete
        cy.get('.col-12 > .p-inputwrapper > .p-dropdown > .p-dropdown-label').last().click();
        //escribir "PAQUETE"
        cy.get('.p-dropdown-filter')
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //cantidad
        cy.get(':nth-child(3) > .col-12 > .p-inputwrapper > .p-inputnumber > #locale-us').last().type(this.variable.cantidadValida);
        //descuento
        cy.get(':nth-child(4) > .col-12 > .p-inputwrapper > .p-inputnumber > #locale-us').last().type(this.variable.descuentoValida);
        //descuento general
        //cy.get('.mt-5 > .p-inputwrapper > .p-inputnumber > #locale-us').type(this.variable.descuentoGeneralValida);
        cy.intercept("POST","http://localhost:1337/quotationSale/add").as("añadir");
        cy.wait(sleepLargo)
        //boton guardar
        cy.get('.p-button-primary').click();
        cy.wait("@añadir").its("response.statusCode").should("eq",201);
        cy.url().should("eq","http://localhost:4200/#/quotationSales");
        cy.wait(sleepLargo)
    })
    it("Aceptar cotizacion valida",function(){
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //módulo cotizaciones
        cy.get('.p-element.ng-tns-c21-20').click();
        //venta
        cy.get('.ng-tns-c21-23.ng-tns-c21-20 > .p-element').click();
        //ocultar barra de navegacion
        cy.get('.menu-button > .pi').click();
        //estado
        cy.get('[psortablecolumn="quotationSaleStatus"]').click();
        //aceptar cotización
        cy.get(':nth-child(1) > :nth-child(8) > .flex > .p-button-success > .p-button-icon').click();
        //aceptar
        cy.get('.p-confirm-dialog-accept').click();
        cy.url().should("eq","http://localhost:4200/#/quotationSales");
        cy.wait(sleepLargo)
    })
    it("Reanudar orden de valida",function(){
        //?CREAR ORDEN DE COMPRA
        //sección añadir provider
        //módulo administración
        cy.get('.p-element.ng-tns-c21-15').click();
        //ordenes
        cy.get('.p-element.ng-tns-c21-21').click();
        //venta
        cy.get('.ng-tns-c21-25.ng-tns-c21-21 > .p-element').click()
        //estatus
        cy.get('[psortablecolumn="saleOrderStatus"]').click();
        //reanudar venta
        cy.get(':nth-child(1) > :nth-child(9) > .flex > .p-button-help > .p-button-icon').click();
        cy.wait(700)
        //boton asignar
        cy.get(':nth-child(2) > .col-3 > .p-element').click();
        //seleccionar primer producto
        cy.get(':nth-child(1) > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').click();
        //asignar
        cy.get('.p-dialog-footer > .p-button-success').click();
        //direccion envio
        cy.get('#saleOrderShippingAddress').type(this.variable.direccionPagovalida);
        //cfdi
        cy.get(':nth-child(6) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').type(this.variable.cfdiValida);
        //escribir
        cy.get('.p-dropdown-filter')
        .type(this.variable.formaPagoValida)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //forma pago
        cy.get(':nth-child(7) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir
        cy.get('.p-dropdown-filter')
        .type(this.variable.formaPagoValida)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //metodo pago
        cy.get(':nth-child(8) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').click();
        //escribir
        cy.get('.p-dropdown-filter')
        .type(this.variable.formaPagoValida)
        .wait(200)
        .type("{downarrow}")
        .wait(200)
        .type("{enter}");
        //notas
        cy.get('#saleOrderAdditionalComments').type(this.variable.notasValida);
        cy.intercept("POST", "http://localhost:1337/saleOrder/add").as(
            "añadirProducto"
        );
        cy.wait(sleepLargo);
        //boton guardar
        cy.get(".p-button-primary").click();
        cy.wait("@añadirProducto").its("response.statusCode").should("eq", 201);
        cy.url().should("eq", "http://localhost:4200/#/orders");
        cy.wait(sleepLargo);
    })
})