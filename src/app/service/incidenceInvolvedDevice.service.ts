import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { IncidenceInvolvedDevice } from 'src/app/api/incidenceInvolvedDevice';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'  
})
export class  IncidenceInvolvedDeviceService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/incidenceInvolvedDevice`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  create(evidence: any){
    return this.http.post<IncidenceInvolvedDevice>(this.url+"/add",evidence);
  }

  delete(id:number){
    const body = { id: id };
    return this.http.put<IncidenceInvolvedDevice>(this.url+"/delete",body);
  }
  getAll(limit,page,sort):Observable<IncidenceInvolvedDevice[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<IncidenceInvolvedDevice[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<IncidenceInvolvedDevice[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<IncidenceInvolvedDevice>(this.url+"/find",options);
  }
  update(data: IncidenceInvolvedDevice):Observable<any>{
    return this.http.put<IncidenceInvolvedDevice>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<IncidenceInvolvedDevice>(this.url+"/disable",body);
  }
}
