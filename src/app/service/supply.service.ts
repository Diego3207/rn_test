import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Supply } from 'src/app/api/supply';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class SupplyService 
{
	bearer:string = "bearer";
    supplyUrl:string = `${environment.apiUrl}/supply`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<Supply[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<Supply[]>(this.supplyUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Supply[]>(this.supplyUrl+"/list",options);
          
  }

  getList(type:number,parameters:any) : Observable<Supply[]>{
		const options = { params: new HttpParams({fromString: "type="+type}) };
		return this.http.get<Supply[]>(this.supplyUrl+"/native",options);
			  
	}
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Supply>(this.supplyUrl+"/find",options);
  }
  create(data: any){
    return this.http.post<Supply>(this.supplyUrl+"/add",data);
  }
  update(data:any):Observable<any>{
    return this.http.put<Supply>(this.supplyUrl+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<Supply>(this.supplyUrl+"/disable",body);
  }
  delete(id:number){
    const body = { id: id };
    return this.http.put<Supply>(this.supplyUrl+"/delete",body);
  }

}




