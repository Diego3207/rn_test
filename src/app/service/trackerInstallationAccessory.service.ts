import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { TrackerInstallationAccessory } from 'src/app/api/trackerInstallationAccessory';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class TrackerInstallationAccessoryService 
{
	bearer:string = "bearer";
    trackerInstallationAccessoryUrl:string = `${environment.apiUrl}/trackerInstallationAccessory`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<TrackerInstallationAccessory[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<TrackerInstallationAccessory[]>(this.trackerInstallationAccessoryUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<TrackerInstallationAccessory[]>(this.trackerInstallationAccessoryUrl+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<TrackerInstallationAccessory>(this.trackerInstallationAccessoryUrl+"/find",options);
  }
  create(trackerInstallationAccessory: any){
    return this.http.post<TrackerInstallationAccessory>(this.trackerInstallationAccessoryUrl+"/add",trackerInstallationAccessory);
  }
  update(data:any):Observable<any>{
    return this.http.put<TrackerInstallationAccessory>(this.trackerInstallationAccessoryUrl+"/update",data);
   }
   
  disable(id:number){
    const body = { id: id };
    return this.http.put<TrackerInstallationAccessory>(this.trackerInstallationAccessoryUrl+"/disable",body);
  }

}
