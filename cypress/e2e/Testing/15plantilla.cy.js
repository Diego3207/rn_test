const sleepCorto = 1000;
const sleepLargo = 2500;
describe("Plantilla",function(){
    beforeEach(function(){
        cy.fixture("product").then(function (variable) {
            this.variable = variable;
        });
        cy.visit("/");
        cy.get("#email").type("admin@reportnow.com.mx");
        cy.get("#password").type("123456");
        cy.get('[label="CONTINUAR"]').click();
    })
    it("Crear  valida",function(){
        
    })
})