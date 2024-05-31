import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class UserBranchService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/userBranch`;

  constructor(private http: HttpClient) 
  {	  
  }
  
 
  create(userBranch: any)
  {
    return this.http.post<any>(this.url+"/add",userBranch);
  }
  
  update(userBranch:any)
  {
    return this.http.put<any>(this.url+"/update",userBranch);
  }
   
  disable(id:number)
  {
    const body = { id: id };
    return this.http.put<any>(this.url+"/disable",body);
  }
  

}