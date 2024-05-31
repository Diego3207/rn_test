import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Association } from 'src/app/api/association';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class AssociationService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/associationTrackerService`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<Association[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<Association[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<any[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Association>(this.url+"/find",options);
  }
  create(data: any){
    return this.http.post<Association>(this.url+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<Association>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<Association>(this.url+"/disable",body);
  }

}
