import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ProviderContact } from 'src/app/api/providerContact';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class ProviderContactService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/providerContact`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  /*getAll(limit,page,sort):Observable<Provider[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<Provider[]>(this.providerUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Provider[]>(this.providerUrl+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Provider>(this.providerUrl+"/find",options);
  }*/
  create(contact: any){
    return this.http.post<ProviderContact>(this.url+"/add",contact);
  }
  update(data:any):Observable<any>{
    return this.http.put<ProviderContact>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<ProviderContact>(this.url+"/disable",body);
  }
}
