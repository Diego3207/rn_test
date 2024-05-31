import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { IncidenceEvidence } from 'src/app/api/incidenceEvidence';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'  
})
export class  IncidenceEvidenceService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/incidenceEvidence`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  create(evidence: any){
    return this.http.post< IncidenceEvidence>(this.url+"/add",evidence);
  }

  delete(id:number){
    const body = { id: id };
    return this.http.put<IncidenceEvidence>(this.url+"/delete",body);
  }
  getAll(limit,page,sort):Observable< IncidenceEvidence[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get< IncidenceEvidence[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<IncidenceEvidence[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<IncidenceEvidence>(this.url+"/find",options);
  }
  update(data: IncidenceEvidence):Observable<any>{
    return this.http.put<IncidenceEvidence>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put< IncidenceEvidence>(this.url+"/disable",body);
  }
}
