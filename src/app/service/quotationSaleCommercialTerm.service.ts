import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { QuotationSaleCommercialTerm } from 'src/app/api/quotationSaleCommercialTerm';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class QuotationSaleCommercialTermService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/quotationSaleCommercialTerm`; 

  constructor(private http: HttpClient) 
  {	  
  }
  getAll(limit,page,sort):Observable<QuotationSaleCommercialTerm[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<QuotationSaleCommercialTerm[]>(this.url+"/list",options);
  }
}