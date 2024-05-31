import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { PurchaseOrderEvidence } from 'src/app/api/purchaseOrderEvidence';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'  
})
export class PurchaseOrderEvidenceService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/purchaseOrderEvidence`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  create(evidence: any){
    return this.http.post<PurchaseOrderEvidence>(this.url+"/add",evidence);
  }

  delete(id:number){
    const body = { id: id };
    return this.http.put<PurchaseOrderEvidence>(this.url+"/delete",body);
  }
  getAll(limit,page,sort):Observable<PurchaseOrderEvidence[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<PurchaseOrderEvidence[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<PurchaseOrderEvidence[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<PurchaseOrderEvidence>(this.url+"/find",options);
  }
  update(data:PurchaseOrderEvidence):Observable<any>{
    return this.http.put<PurchaseOrderEvidence>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<PurchaseOrderEvidence>(this.url+"/disable",body);
  }
}
