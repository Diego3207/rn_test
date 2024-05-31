import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { HttpClient , HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SessionService } from 'src/app/service/session.service'
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
}) 

export class AuthGuard implements CanActivateChild 
{

    validatorURL = `${environment.apiUrl}/user/validator`;

    constructor(private router: Router, private sessionService: SessionService, private http: HttpClient) 
	{}

    canActivateChild(route: ActivatedRouteSnapshot, 
		state: RouterStateSnapshot): Observable < boolean | UrlTree > | Promise < boolean | UrlTree > | boolean | UrlTree 
	{

		//tengo una sesion activa?
		try
		{
			//verifico si el token aun existe y es valido, esta es la primer etapa de validacion
			const val:any = jwt_decode(this.sessionService.getToken());
			const expirationTime = val.exp * 1000;
			if (Date.now() >= expirationTime) 
			{
				//console.log('Token expirado');
				this.sessionService.logout();
				return this.router.navigate(['/auth']);//this.router.parseUrl('/auth');
			} 
		}
		catch(error)
		{
			//console.log("Token invalido");
			this.sessionService.logout();
			return this.router.navigate(['/auth']);//this.router.parseUrl('/auth');
		}
		
		//en este punto mi token es valido, pero tengo que verificar los permiso del usuario		
        const httpHeaders = new HttpHeaders({'x-access-token': this.sessionService.getToken() as string});        
		const options = {headers: httpHeaders};
		const module = route.data.module;
		const params = new HttpParams().set('module', module);

        return new Promise < boolean | UrlTree > ((resolve, reject) => 
		{
            this.http.post(this.validatorURL, params, options).subscribe
			((response:any) => 
			{
				//el modulo existe y tienes permiso de ingresar a el
				resolve(true);
			},
			(error:any) => 
			{				
				
				if(error.status == 401) //token invalido o expirado
				{	
					//console.log("invalido");
					this.sessionService.logout();
					resolve(this.router.navigate(['/auth']));//(this.router.parseUrl('/auth'));
				}
				else if(error.status == 404)//el modelo no existe, no lo saco de sesion, solo indico que no existe
				{	
					//console.log("no existe");
					resolve(this.router.navigate(['/notfound']));//(this.router.parseUrl('/notfound'));
				}	
				else if(error.status == 403)//no tienes permisos para ingresar al modulo				
				{	
					//console.log("permiso");					
					resolve(this.router.navigate(['/']));//(this.router.parseUrl('/')); // regreso a un lugar seguro
				}
				
				//console.log("otro error");
				//resolve(this.router.navigate(['/error']));
				
			});
        })
		.catch((reason: any) => 
		{
			  //console.log("error en la promesa");
			  this.router.navigate(['/error']);
			  return false;
		});
		
    }



}