import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { PurchaseOrder } from 'src/app/api/purchaseOrder';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class PurchaseOrderService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/purchaseOrder`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<PurchaseOrder[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<PurchaseOrder[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) : Observable<PurchaseOrder[]>{
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<PurchaseOrder[]>(this.url+"/list",options);
          
  }
  
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<PurchaseOrder>(this.url+"/find",options);
  }
  create(quotation: any){
    return this.http.post<PurchaseOrder>(this.url+"/add",quotation);
  }
  update(data:any):Observable<any>{
    return this.http.put<PurchaseOrder>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<PurchaseOrder>(this.url+"/disable",body);
  }

}
