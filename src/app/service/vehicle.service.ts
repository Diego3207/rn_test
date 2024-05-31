import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Vehicle } from 'src/app/api/vehicle';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class VehicleService 
{
	bearer:string = "bearer";
    vehicleUrl:string = `${environment.apiUrl}/vehicle`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<Vehicle[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<Vehicle[]>(this.vehicleUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Vehicle[]>(this.vehicleUrl+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Vehicle>(this.vehicleUrl+"/find",options);
  }
  create(Vehicle: any){
    return this.http.post<Vehicle>(this.vehicleUrl+"/add",Vehicle);
  }
  update(data:any):Observable<any>{
    return this.http.put<Vehicle>(this.vehicleUrl+"/update",data);
   }
   
  disable(id:number){
    const body = { id: id };
    return this.http.put<Vehicle>(this.vehicleUrl+"/disable",body);
  }

}
