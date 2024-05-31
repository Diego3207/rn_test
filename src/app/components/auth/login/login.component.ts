import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { SessionService } from 'src/app/service/session.service'
import { MiscService } from 'src/app/service/misc.service'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
	`
        i {
            opacity: 0.6;
            transition-duration: .12s;
            color: #2196F3;
            
            &:hover {
                opacity: 1;
            }
        }
    `
	],
	providers: [MessageService]
})
export class LoginComponent 
{ 
	email!: string;
    password!: string;
	
	constructor(private messageService: MessageService, private sessionService:SessionService, private miscService:MiscService, public router: Router) 
	{ 
	}
	
	login()
	{
		/*var user;		
		if (!this.email || !this.password) 
		{
			//this.messageService.add({ life:5000, key: 'msg', severity: 'warn', summary: 'Alerta', detail: 'Los campo de email y password son obligatorios.' });
			//return;			
		}
		else
		{
			user = {email: this.email, password: this.password};
		}*/
		
		const user = {email: this.email, password: this.password};		
		
		//habilito el codigo de detencion
		this.miscService.startRequest();
		
		//suscribe es observable no promesa
		this.sessionService.login(user)
		.subscribe
		( 
			(data:any) => 
			{
				//console.log(data);
				
				//deshabilito el codigo de detencion
				this.miscService.endRquest();				
				this.sessionService.setToken(data.token);
				this.sessionService.setUserId(data.data.id);
				this.sessionService.setUserFullName(data.data.userFullName);
				this.sessionService.setUserImage(data.data.userImage);
				this.router.navigate(['/']);
			
			},
			(error:any) => 
			{
				//console.log(error);
				//deshabilito el codigo de detencion
				this.miscService.endRquest();
				
				if(error.status == 400) //error de peticion
				{
					if(error.error && error.error.problems) //error general de sails
					{
						//concatena los errores del cuerpo del mensaje
						this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: error.error.code, detail: error.error.problems.join('\n') });
					}
				}
				else if(error.status == 401)
				{
					this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: 'Error', detail: 'Usuario y/o contraseña incorrecta.' });
				}
				else if(error.status == 403)
				{				
					this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: 'Error', detail: 'Usuario deshabilitado.' });
				}
				else if(error.status == 404)
				{	
					this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: 'Error', detail: 'Usuario no registrado.' });
				}
				else if(error.status == 406)
				{				
					this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: 'Error', detail: 'Cuenta no confirmada.' });
				}
				else // error general
				{
					this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: error.name, detail:error.message });
				}								
			}			
		);		
	}
}
