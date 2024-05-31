import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Installer } from 'src/app/api/installer';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class InstallerService 
{
	bearer:string = "bearer";
    installerUrl:string = `${environment.apiUrl}/installer`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<Installer[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<Installer[]>(this.installerUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Installer[]>(this.installerUrl+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Installer>(this.installerUrl+"/find",options);
  }
  create(installer: any){
    return this.http.post<Installer>(this.installerUrl+"/add",installer);
  }
  update(data:any):Observable<any>{
    return this.http.put<Installer>(this.installerUrl+"/update",data);
   }
   
  disable(id:number){
    const body = { id: id };
    return this.http.put<Installer>(this.installerUrl+"/disable",body);
  }

}
