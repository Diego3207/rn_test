import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { PayWay } from 'src/app/api/payWay';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class PayWayService 
{
	bearer:string = "bearer";
    payWayUrl:string = `${environment.apiUrl}/payWay`; 

  constructor(private http: HttpClient) 
  {	  
  }
  getAll(limit,page,sort):Observable<PayWay[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<PayWay[]>(this.payWayUrl+"/list",options);
  }
}