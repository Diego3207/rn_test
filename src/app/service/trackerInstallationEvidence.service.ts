import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TrackerInstallationEvidence } from 'src/app/api/trackerInstallationEvidence';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  
})
export class TrackerInstallationEvidenceService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/trackerInstallationEvidence`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  create(data: any){
    return this.http.post<TrackerInstallationEvidence>(this.url+"/add",data);
  }

  delete(id:number){
    const body = { id: id };
    return this.http.put<TrackerInstallationEvidence>(this.url+"/delete",body);
  }
  update(data:any):Observable<any>{
    console.log(data);
    return this.http.put<TrackerInstallationEvidence>(this.url+"/update",data);
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
