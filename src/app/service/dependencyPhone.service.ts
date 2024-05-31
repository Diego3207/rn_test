import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import {DependencyPhone} from 'src/app/api/dependencyPhone';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class DependencyPhoneService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/dependencyPhone`; 

  constructor(private http: HttpClient) 
  {	   
  }
  
  getAll(limit,page,sort):Observable<DependencyPhone[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<DependencyPhone[]>(this.url+"/list",options);
  }
  /*getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Provider[]>(this.providerUrl+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Provider>(this.providerUrl+"/find",options);
  }*/
  create(data: any){
    return this.http.post<DependencyPhone>(this.url+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<DependencyPhone>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<DependencyPhone>(this.url+"/disable",body);
  }
}
