import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { MonitoringDevice } from 'src/app/api/monitoringDevice';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class MonitoringDeviceService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/monitoringDevice`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<MonitoringDevice[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<MonitoringDevice[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<any[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<MonitoringDevice>(this.url+"/find",options);
  }
  create(data: any){
    return this.http.post<MonitoringDevice>(this.url+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<MonitoringDevice>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<MonitoringDevice>(this.url+"/disable",body);
  }

}
