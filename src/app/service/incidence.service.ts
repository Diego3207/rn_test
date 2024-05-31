import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Incidence } from 'src/app/api/incidence';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class IncidenceService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/incidence`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<Incidence[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<Incidence[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Incidence[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Incidence>(this.url+"/find",options);
  }
  create(data: any){
    return this.http.post<Incidence>(this.url+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<Incidence>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<Incidence>(this.url+"/disable",body);
  }

}
