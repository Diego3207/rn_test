import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { TrackerUninstall} from 'src/app/api/trackerUninstall';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class TrackerUninstallService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/trackerUninstall`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<TrackerUninstall[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<TrackerUninstall[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<TrackerUninstall[]>(this.url+"/list",options);
          
  }  

  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<TrackerUninstall>(this.url+"/find",options);
  }
  create(data: any){
    return this.http.post<TrackerUninstall>(this.url+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<TrackerUninstall>(this.url+"/update",data);
   }
   
  disable(id:number){
    const body = { id: id };
    return this.http.put<TrackerUninstall>(this.url+"/disable",body);
  }

}
