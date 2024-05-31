import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { User } from 'src/app/api/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class UserService 
{
	bearer:string = "bearer";
	url:string = `${environment.apiUrl}/user`;
  
	constructor(private http: HttpClient) 
	{	  
	} 
  
	getAll(limit,page,sort):Observable<User[]> 
	{
		const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
		return this.http.get<User[]>(this.url+"/list",options);
	}
  
	getFilter(text,limit,page,sort) 
	{
		const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
		return this.http.get<User[]>(this.url+"/list",options);
    }
	
  
	getById(id:number)
	{
		const options = { params: new HttpParams({fromString: "id="+ id}) };
		return this.http.get<any>(this.url+"/find",options);
	}
	
	getByEmail(email:string)
	{
		const options = { params: new HttpParams({fromString: "email="+ email}) };
		return this.http.get<any>(this.url+"/find",options);
	}

	create(User: any)
	{
		return this.http.post<User>(this.url+"/add",User);
	}

	update(data:any):Observable<any>
	{
		return this.http.put<User>(this.url+"/update",data);
	}

	disable(id:number)
	{
		const body = { id: id };
		return this.http.put<User>(this.url+"/disable",body);
	}

}