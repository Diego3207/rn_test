import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { PurchaseOrderService } from 'src/app/api/purchaseOrderService';
//import { ProviderContact } from 'src/app/api/providerContact';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class PurchaseOrderServiceService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/purchaseOrderService`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<PurchaseOrderService[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<PurchaseOrderService[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<PurchaseOrderService[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<PurchaseOrderService>(this.url+"/find",options);
  }
  create(detail: any){
    return this.http.post<PurchaseOrderService>(this.url+"/add",detail);
  }
  update(data:any):Observable<any>{
  
    return this.http.put<PurchaseOrderService>(this.url+"/update",data);
  }
  disable(id:number){
    const body = { id: id };
    return this.http.put<PurchaseOrderService>(this.url+"/disable",body);
  }

}
