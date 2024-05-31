import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Location } from 'src/app/api/location';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class LocationService 
{
	bearer:string = "bearer";
    locationUrl:string = `${environment.apiUrl}/location`; //"http://localhost:1337/provider";

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<Location[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<Location[]>(this.locationUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Location[]>(this.locationUrl+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Location>(this.locationUrl+"/find",options);
  }
  create(location: any){
    return this.http.post<Location>(this.locationUrl+"/add",location);
  }
  update(data:any):Observable<any>{
    return this.http.put<Location>(this.locationUrl+"/update",data);
   }
   
  disable(id:number){
    const body = { id: id };
    return this.http.put<Location>(this.locationUrl+"/disable",body);
  }

}
