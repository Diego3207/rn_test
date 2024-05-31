import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { TicketCoordination } from 'src/app/api/ticketCoordination';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'  
})
export class  TicketCoordinationService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/ticketCoordination`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  create(evidence: any){
    return this.http.post<TicketCoordination>(this.url+"/add",evidence);
  }

  delete(id:number){
    const body = { id: id };
    return this.http.put<TicketCoordination>(this.url+"/delete",body);
  }
  getAll(limit,page,sort):Observable<TicketCoordination[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<TicketCoordination[]>(this.url+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<TicketCoordination[]>(this.url+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<TicketCoordination>(this.url+"/find",options);
  }
  update(data: TicketCoordination):Observable<any>{
    return this.http.put<TicketCoordination>(this.url+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<TicketCoordination>(this.url+"/disable",body);
  }
}