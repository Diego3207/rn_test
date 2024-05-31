import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ProviderLocation } from 'src/app/api/providerLocation';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class ProviderLocationService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/providerLocation`; 

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
  create(location: any){
    return this.http.post<ProviderLocation>(this.url+"/add",location);
  }
  update(data:ProviderLocation):Observable<any>{
    return this.http.put<ProviderLocation>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<ProviderLocation>(this.url+"/disable",body);
  }

}
