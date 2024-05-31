import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from 'src/app/service/session.service'

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

    constructor(private sessionService: SessionService)
    { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        // clona petición para agregar la nueva cabecera

        var tkn = "";

        if(this.sessionService.getToken()!=null)
            tkn = this.sessionService.getToken() as string;

        const reqClonada = req.clone({


            headers: req.headers.set('x-access-token', tkn)
        });

        // Envía la petición clonada con la cabecera agregada
        return next.handle(reqClonada);
    }
}
