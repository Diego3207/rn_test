import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { CostumerContact } from 'src/app/api/costumerContact';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class CostumerContactService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/costumerContact`; 

  constructor(private http: HttpClient) 
  {	  
  }
  create(contact: any){
    return this.http.post<CostumerContact>(this.url+"/add",contact);
  }
  update(data:any):Observable<any>{
    return this.http.put<CostumerContact>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<CostumerContact>(this.url+"/disable",body);
  }
}

