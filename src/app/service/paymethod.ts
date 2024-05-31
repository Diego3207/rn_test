import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { PayMethod } from 'src/app/api/payMethod';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class PayMethodService 
{
	bearer:string = "bearer";
    payMethodUrl:string = `${environment.apiUrl}/payMethod`; 

  constructor(private http: HttpClient) 
  {	  
  }
  getAll(limit,page,sort):Observable<PayMethod[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<PayMethod[]>(this.payMethodUrl+"/list",options);
  }
}
