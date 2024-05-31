import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { QuotationPurchase } from 'src/app/api/quotationPurchase';
//import { ProviderContact } from 'src/app/api/providerContact';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class QuotationPurchaseService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/quotationPurchase`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<QuotationPurchase[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<QuotationPurchase[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<QuotationPurchase[]>(this.url+"/list",options);
          
  }
  getList(type:number) : Observable<QuotationPurchase[]>{
    const options = { params: new HttpParams({fromString: "type="+type}) };
    return this.http.get<QuotationPurchase[]>(this.url+"/native",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<QuotationPurchase>(this.url+"/find",options);
  }
  create(data: any){
    return this.http.post<QuotationPurchase>(this.url+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<QuotationPurchase>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<QuotationPurchase>(this.url+"/disable",body);
  }

}
