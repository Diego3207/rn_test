import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Service } from 'src/app/api/service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root' 
})
export class ServiceService 
{
  bearer:string = "bearer";
  serviceUrl:string = `${environment.apiUrl}/service`; //"http://localhost:1337/service";

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<Service[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Service[]>(this.serviceUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Service[]>(this.serviceUrl+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Service>(this.serviceUrl+"/find",options);
  }
  create(service: any){
    return this.http.post<Service>(this.serviceUrl+"/add",service);
  }
  update(data:Service):Observable<any>{
    return this.http.put<Service>(this.serviceUrl+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<Service>(this.serviceUrl+"/disable",body);
  }

}
