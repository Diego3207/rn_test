import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { QuotationSaleTemplate } from 'src/app/api/quotationSaleTemplate';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class QuotationSaleTemplateService 
{
	bearer:string = "bearer";
    quotationSaleTemplateUrl:string = `${environment.apiUrl}/quotationSaleTemplate`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  create(quotationSaleTemplate: any){
    return this.http.post<QuotationSaleTemplate>(this.quotationSaleTemplateUrl+"/add",quotationSaleTemplate);
  }

  delete(id:number){
    const body = { id: id };
    return this.http.put<QuotationSaleTemplate>(this.quotationSaleTemplateUrl+"/delete",body);
  }
  /*getAll(limit,page,sort):Observable<Product[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<Product[]>(this.QuotationSaleTemplateUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Product[]>(this.QuotationSaleTemplateUrl+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Product>(this.QuotationSaleTemplateUrl+"/find",options);
  }
  update(data:Product):Observable<any>{
    return this.http.put<Product>(this.QuotationSaleTemplateUrl+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<Product>(this.QuotationSaleTemplateUrl+"/disable",body);
  }*/
}
