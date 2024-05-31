import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { QuotationSaleRecord } from 'src/app/api/quotationSaleRecord';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'  
})
export class  QuotationSaleRecordService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/quotationSaleRecord`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  create(evidence: any){
    return this.http.post<QuotationSaleRecord>(this.url+"/add",evidence);
  }

  delete(id:number){
    const body = { id: id };
    return this.http.put<QuotationSaleRecord>(this.url+"/delete",body);
  }
  getAll(limit,page,sort):Observable<QuotationSaleRecord[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<QuotationSaleRecord[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<QuotationSaleRecord[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<QuotationSaleRecord>(this.url+"/find",options);
  }
  update(data: any):Observable<any>{
    return this.http.put<QuotationSaleRecord>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<QuotationSaleRecord>(this.url+"/disable",body);
  }
}