import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { SaleOrderCfdi } from 'src/app/api/saleOrderCfdi';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class SaleOrderCfdiService 
{
	bearer:string = "bearer";
    saleOrderCfdiUrl:string = `${environment.apiUrl}/saleOrderCfdi`; 

  constructor(private http: HttpClient) 
  {	  
  }
  create(data: any){
    return this.http.post<SaleOrderCfdi>(this.saleOrderCfdiUrl+"/add",data);
  }
}
