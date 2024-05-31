import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { SessionService } from 'src/app/service/session.service'
import { MiscService } from 'src/app/service/misc.service'

@Component({
	templateUrl: './register.component.html',
	providers: [MessageService] // por la instancia de p-toast en el html
})
export class RegisterComponent {

	confirmDisplay: boolean = false;
	content!:string;
	
	confirmed: boolean = false; //terminos y condiciones
	fullName!: string; //nombre completo
	email!: string; //correo
    password!: string; //contraseña
	
	constructor(private messageService: MessageService, private sessionService:SessionService, private miscService:MiscService, public router: Router) 
	{ 
	
	}
	
	register()
	{
		if(this.confirmed)
		{
			const user = {fullName: this.fullName ,email: this.email, password: this.password};		

		
			this.miscService.startRequest();
		
			this.sessionService.register(user)
			.subscribe
			( 
				(data:any) => 
				{
					//deshabilito el codigo de detencion
					this.miscService.endRquest();				
					//console.log(data);
					
					this.content = "Se ha creado una cuenta para la dirección "+this.email+" . Se te ha enviado un correo con un link de confirmación.";
					this.confirmDisplay=true;

				
				},
				(error:any) => 
				{
					//console.log(error);
					this.miscService.endRquest();
					
					
					
					if(error.status == 400) //error de peticion
					{
						if(error.error && error.error.problems) //error general de sails
						{
							//concatena los errores del cuerpo del mensaje
							this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: error.error.code, detail: error.error.problems.join('\n') });
						}
						else
						{
							this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: error.error.message, detail: error.error.error });
						}
					}
					else // error general
					{
						this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: error.name, detail:error.message });
					}								
				}			
			);
			
		}
		else
		{
			this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: 'Error', detail: 'No ha leído los términos y condiciones.' });
		}

	}
	
	confirmation()
	{
		this.router.navigate(['/auth/login']);
	}
}
