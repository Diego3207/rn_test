import { Injectable } from '@angular/core';
import { HttpClient , HttpParams } from "@angular/common/http";
import { environment } from '../../environments/environment';
import jwt_decode from 'jwt-decode';

const baseUrl:string = `${environment.apiUrl}/user`;

@Injectable({
  providedIn: 'root' // 'Type<any> | "root" | "platform" | "any" | null'.
})
export class SessionService
{

  public bearer:string = "bearer";
  public userFullName:string;
  public userImage:string;
  public userId:string;//ya que lo requiere como cadena para guardarlo en el modelo

  constructor(private http: HttpClient)
  {
	this.userFullName = this.getUserFullName();
	this.userImage = this.getUserImage();
  this.userId = this.getUserId();
  }

  register(user: any)
  {
	  return this.http.post(`${baseUrl}/register`, user);
  }

  verification(token:string)
  {
	  console.log(token);
	  let params = new HttpParams().set('token', token);
	  return this.http.get(`${baseUrl}/confirm`, { params: params });
  }

  login(user: any)
  {
    return this.http.post(`${baseUrl}/login`, user);
  }

  logout()
  {
	localStorage.clear(); //sessionStorage  Local storage: One of the best ways to store data. Local storage is not vulnerable to CSRF attacks.
	//delete from white list
  }

  forgotPassword(email:any)
  {
      return this.http.post(`${baseUrl}/login`, email);
  }


  setToken(token: string)
  {
	localStorage.setItem(this.bearer, token);
	//console.log(jwt_decode(token)); //en este punto puedo extraer informacion del token
	//console.log(jwt_decode(token).);
  }

  getToken():string |null
  {
	  return localStorage.getItem(this.bearer);
  }

  //-------------------------------------------------------

  setUserFullName(name:string)
  {
	  localStorage.setItem('name',name);
  }
  getUserFullName():string |null
  {
	  return localStorage.getItem('name');
  }

  setUserImage(uimage:string)
  {
	  localStorage.setItem('image',uimage);
  }
  getUserImage():string |null
  {
	  return `${environment.apiUrl}/file/download?id=`+localStorage.getItem('image');
  }

  setUserId(name:string)
  {
	  localStorage.setItem('id',name);
  }
  getUserId():string |null
  {
	  return localStorage.getItem('id');
  }
}
