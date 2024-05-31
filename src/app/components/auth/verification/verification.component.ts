import { Component, ElementRef , OnInit } from '@angular/core';
import { DomHandler } from 'primeng/dom';
import { InputNumber } from 'primeng/inputnumber';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/service/session.service'

@Component({
    templateUrl: './verification.component.html'
})
export class VerificationComponent implements OnInit {

    /*val1!: number;
    
    val2!: number;
    
    val3!: number;
    
    val4!: number;*/
	
	estadoVerificacion!:string;

	constructor(private route: ActivatedRoute, private sessionService:SessionService) { }

    focusOnNext(inputEl: InputNumber) 
	{
        inputEl.input.nativeElement.focus();
    }
	
	ngOnInit() 
	{
		this.route.queryParams
		.subscribe(params => 
		{
			console.log(params); // { orderby: "price" }
			//this.orderby = params.orderby;
			//console.log(this.orderby); // price
			
			this.sessionService.verification(params.token)
			.subscribe
			( 
				(data:any) => 
				{
					//todo bien
					//console.log(data);
					this.estadoVerificacion = "La cuenta ha sido verificada, puedes ingresar con tu usuario y contraseña";
				},
				(error:any) => 
				{
					if(error.status == 400) //error de peticion
					{
						//el token no s valido
						//console.log(error);
						this.estadoVerificacion = "El token proporcionado es invalido, ha expirado o ya ha sido usado";
					}
					else
					{
						//otro error
					}
													
				}			
			);
		}
		);
	}
}
