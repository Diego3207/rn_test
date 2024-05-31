import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { EvidenceInstallation } from 'src/app/api/evidenceInstallation';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class EvidenceInstallationService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/evidenceInstallation`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<EvidenceInstallation[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<EvidenceInstallation[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<EvidenceInstallation[]>(this.url+"/list",options);
          
  }  
  delete(id:number){
    const body = { id: id };
    return this.http.put<EvidenceInstallation>(this.url+"/delete",body);
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<EvidenceInstallation>(this.url+"/find",options);
  }
  create(data: any){
    return this.http.post<EvidenceInstallation>(this.url+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<EvidenceInstallation>(this.url+"/update",data);
   }
   
  disable(id:number){
    const body = { id: id };
    return this.http.put<EvidenceInstallation>(this.url+"/disable",body);
  }

}
