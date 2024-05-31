import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { TrackerInstallationReview } from 'src/app/api/trackerInstallationReview';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class TrackerInstallationReviewService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/trackerInstallationReview`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<TrackerInstallationReview[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<TrackerInstallationReview[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<TrackerInstallationReview[]>(this.url+"/list",options);
          
  }
  

  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<TrackerInstallationReview>(this.url+"/find",options);
  }
  create(trackerInstallation: any){
    return this.http.post<TrackerInstallationReview>(this.url+"/add",trackerInstallation);
  }
  update(data:any):Observable<any>{
    return this.http.put<TrackerInstallationReview>(this.url+"/update",data);
   }
   
  disable(id:number){
    const body = { id: id };
    return this.http.put<TrackerInstallationReview>(this.url+"/disable",body);
  }

}
