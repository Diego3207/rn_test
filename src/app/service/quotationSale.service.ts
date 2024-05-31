import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { QuotationSale } from 'src/app/api/quotationSale';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class QuotationSaleService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/quotationSale`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<QuotationSale[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<QuotationSale[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<QuotationSale[]>(this.url+"/list",options);
          
  }
  getList(type:number) : Observable<QuotationSale[]>{
    const options = { params: new HttpParams({fromString: "type="+type}) };
    return this.http.get<QuotationSale[]>(this.url+"/native",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<QuotationSale>(this.url+"/find",options);
  }
  create(data: any){
    return this.http.post<QuotationSale>(this.url+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<QuotationSale>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<QuotationSale>(this.url+"/disable",body);
  }

}
