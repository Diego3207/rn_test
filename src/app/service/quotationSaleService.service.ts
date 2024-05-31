import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { QuotationSaleService } from 'src/app/api/quotationSaleService';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class QuotationSaleServiceService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/quotationSaleService`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<QuotationSaleService[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<QuotationSaleService[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<QuotationSaleService[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<QuotationSaleService>(this.url+"/find",options);
  }
  create(data: any){
    return this.http.post<QuotationSaleService>(this.url+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<QuotationSaleService>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<QuotationSaleService>(this.url+"/disable",body);
  }

}
