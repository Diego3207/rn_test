import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { IncidenceCoordination } from 'src/app/api/incidenceCoordination';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'  
})
export class  IncidenceCoordinationService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/incidenceCoordination`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  create(evidence: any){
    return this.http.post<IncidenceCoordination>(this.url+"/add",evidence);
  }

  delete(id:number){
    const body = { id: id };
    return this.http.put<IncidenceCoordination>(this.url+"/delete",body);
  }
  getAll(limit,page,sort):Observable<IncidenceCoordination[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<IncidenceCoordination[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<IncidenceCoordination[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<IncidenceCoordination>(this.url+"/find",options);
  }
  update(data: IncidenceCoordination):Observable<any>{
    return this.http.put<IncidenceCoordination>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<IncidenceCoordination>(this.url+"/disable",body);
  }
}
