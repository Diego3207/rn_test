import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { TrackerUninstallEvidence} from 'src/app/api/trackerUninstallEvidence';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class TrackerUninstallEvidenceService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/trackerUninstallEvidence`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<TrackerUninstallEvidence[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<TrackerUninstallEvidence[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<TrackerUninstallEvidence[]>(this.url+"/list",options);
          
  }  
  delete(id:number){
    const body = { id: id };
    return this.http.put<TrackerUninstallEvidence>(this.url+"/delete",body);
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<TrackerUninstallEvidence>(this.url+"/find",options);
  }
  create(data: any){
    return this.http.post<TrackerUninstallEvidence>(this.url+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<TrackerUninstallEvidence>(this.url+"/update",data);
   }
   
  disable(id:number){
    const body = { id: id };
    return this.http.put<TrackerUninstallEvidence>(this.url+"/disable",body);
  }

}
