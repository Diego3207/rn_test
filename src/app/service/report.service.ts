import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders  } from "@angular/common/http";
import { environment } from '../../environments/environment';
import {Provider} from "../api/provider";

@Injectable({
    providedIn: 'root'
})
export class ReportService
{
    bearer:string = "bearer";
    url:string = `${environment.apiUrl}/report`;

    constructor(private http: HttpClient)
    {
    }

    quotationSale(id)
    {
        const params = new URLSearchParams();
        params.set('quotationSaleId', id);
        const apiUrl = this.url+"/quotationSale"+'?'+ params.toString();

        const options = {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
            responseType: 'blob' as 'json' // Define el tipo de respuesta como blob
        };
        //si se usa solo blob causa error por incompatibilidad ?

        return this.http.get(apiUrl, options);
    }

    saleOrder(id)
    {
        const params = new URLSearchParams();
        params.set('saleOrderId', id);
        const apiUrl = this.url+"/saleOrder"+'?'+ params.toString();

        const options = {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
            responseType: 'blob' as 'json' // Define el tipo de respuesta como blob
        };
        //si se usa solo blob causa error por incompatibilidad ?

        return this.http.get(apiUrl, options);
    }
}
