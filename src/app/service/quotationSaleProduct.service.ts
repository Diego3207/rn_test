import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { QuotationSaleProduct } from 'src/app/api/quotationSaleProduct';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class QuotationSaleProductService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/quotationSaleProduct`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<QuotationSaleProduct[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<QuotationSaleProduct[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<QuotationSaleProduct[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<QuotationSaleProduct>(this.url+"/find",options);
  }
  create(data: any){
    return this.http.post<QuotationSaleProduct>(this.url+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<QuotationSaleProduct>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<QuotationSaleProduct>(this.url+"/disable",body);
  }

}
