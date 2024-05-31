import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Costumer } from 'src/app/api/costumer';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class CostumerService 
{
	bearer:string = "bearer";
    costumerUrl:string = `${environment.apiUrl}/costumer`; //"http://localhost:1337/costumer";

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<Costumer[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<Costumer[]>(this.costumerUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Costumer[]>(this.costumerUrl+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Costumer>(this.costumerUrl+"/find",options);
  }
  create(costumer: any){
    return this.http.post<Costumer>(this.costumerUrl+"/add",costumer);
  }
  update(data:Costumer):Observable<any>{
    return this.http.put<Costumer>(this.costumerUrl+"/update",data);
   }
   
  disable(id:number){
    const body = { id: id };
    return this.http.put<Costumer>(this.costumerUrl+"/disable",body);
  }

}
