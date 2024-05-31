import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ProviderProduct } from 'src/app/api/providerProduct';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class ProviderProductService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/providerProduct`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<ProviderProduct[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<ProviderProduct[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<ProviderProduct[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<ProviderProduct>(this.url+"/find",options);
  }
  create(data: any){
    return this.http.post<ProviderProduct>(this.url+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<ProviderProduct>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<ProviderProduct>(this.url+"/disable",body);
  }
}
