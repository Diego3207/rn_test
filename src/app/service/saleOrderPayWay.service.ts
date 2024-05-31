import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { SaleOrderPayWay } from 'src/app/api/saleOrderPayWay';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class SaleOrderPayWayService 
{
	bearer:string = "bearer";
    saleOrderPayWayUrl:string = `${environment.apiUrl}/saleOrderPayWay`; 

  constructor(private http: HttpClient) 
  {	  
  }
  create(data: any){
    return this.http.post<SaleOrderPayWay>(this.saleOrderPayWayUrl+"/add",data);
  }
}
