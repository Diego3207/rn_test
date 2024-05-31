import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { SimCard } from 'src/app/api/simCard';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class SimCardService 
{
	bearer:string = "bearer";
    SimCardUrl:string = `${environment.apiUrl}/simCard`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<SimCard[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<SimCard[]>(this.SimCardUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<SimCard[]>(this.SimCardUrl+"/list",options);
          
  }
  getList(type:number,parameters:any) : Observable<SimCard[]>{
		const options = { params: new HttpParams({fromString: "type="+type}) };
		return this.http.get<SimCard[]>(this.SimCardUrl+"/native",options);
			  
	  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<SimCard>(this.SimCardUrl+"/find",options);
  }
  create(data: any){
    return this.http.post<SimCard>(this.SimCardUrl+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<SimCard>(this.SimCardUrl+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<SimCard>(this.SimCardUrl+"/disable",body);
  }

}

