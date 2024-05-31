import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Provider } from 'src/app/api/provider';
import { ProviderContact } from 'src/app/api/providerContact';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class ProviderService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/provider`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<Provider[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<Provider[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Provider[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Provider>(this.url+"/find",options);
  }
  create(provider: any){
    return this.http.post<Provider>(this.url+"/add",provider);
  }
  update(data:any):Observable<any>{
    return this.http.put<Provider>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<Provider>(this.url+"/disable",body);
  }

}
