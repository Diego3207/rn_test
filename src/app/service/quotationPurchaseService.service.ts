import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { QuotationPurchaseService } from 'src/app/api/quotationPurchaseService';
//import { ProviderContact } from 'src/app/api/providerContact';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class QuotationPurchaseServiceService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/quotationPurchaseService`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<QuotationPurchaseService[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<QuotationPurchaseService[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<QuotationPurchaseService[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<QuotationPurchaseService>(this.url+"/find",options);
  }
  create(data: any){
    return this.http.post<QuotationPurchaseService>(this.url+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<QuotationPurchaseService>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<QuotationPurchaseService>(this.url+"/disable",body);
  }

}
