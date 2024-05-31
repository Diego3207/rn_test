import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Stocktaking } from 'src/app/api/stocktaking';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class StocktakingService 
{
	bearer:string = "bearer";
    stocktakingUrl:string = `${environment.apiUrl}/stocktaking`; //"http://localhost:1337/provider";

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<Stocktaking[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<Stocktaking[]>(this.stocktakingUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Stocktaking[]>(this.stocktakingUrl+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Stocktaking>(this.stocktakingUrl+"/find",options);
  }
  create(product: any){
    return this.http.post<Stocktaking>(this.stocktakingUrl+"/add",product);
  }
  update(data:Stocktaking):Observable<any>{
    return this.http.put<Stocktaking>(this.stocktakingUrl+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<Stocktaking>(this.stocktakingUrl+"/disable",body);
  }

}
