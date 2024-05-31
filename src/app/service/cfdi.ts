import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Cfdi } from 'src/app/api/cfdi';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class CfdiService 
{
	bearer:string = "bearer";
    cfdiUrl:string = `${environment.apiUrl}/cfdi`; 

  constructor(private http: HttpClient) 
  {	  
  }
  getAll(limit,page,sort):Observable<Cfdi[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<Cfdi[]>(this.cfdiUrl+"/list",options);
  }
}
