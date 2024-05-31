import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { SaleOrderPayMethod } from 'src/app/api/saleOrderPayMethod';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class SaleOrderPayMethodService 
{
	bearer:string = "bearer";
    saleOrderPayMethodUrl:string = `${environment.apiUrl}/saleOrderPayMethod`; 

  constructor(private http: HttpClient) 
  {	  
  }
  create(data: any){
    return this.http.post<SaleOrderPayMethod>(this.saleOrderPayMethodUrl+"/add",data);
  }
}
