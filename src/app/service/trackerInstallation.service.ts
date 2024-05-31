import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { TrackerInstallation } from 'src/app/api/trackerInstallation';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class TrackerInstallationService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/trackerInstallation`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<TrackerInstallation[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<TrackerInstallation[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<TrackerInstallation[]>(this.url+"/list",options);
          
  }
  getList(type:number,parameters:any) : Observable<TrackerInstallation[]>{
		const options = { params: new HttpParams({fromString: "type="+type+"&parameters="+parameters}) };
		return this.http.get<TrackerInstallation[]>(this.url+"/native",options);
			  
	}

  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<TrackerInstallation>(this.url+"/find",options);
  }
  create(trackerInstallation: any){
    return this.http.post<TrackerInstallation>(this.url+"/add",trackerInstallation);
  }
  update(data:any):Observable<any>{
    return this.http.put<TrackerInstallation>(this.url+"/update",data);
   }
   
  disable(id:number){
    const body = { id: id };
    return this.http.put<TrackerInstallation>(this.url+"/disable",body);
  }

}
