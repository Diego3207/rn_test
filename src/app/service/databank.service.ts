import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataBank } from 'src/app/api/databank';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class DataBankService 
{
	bearer:string = "bearer";
    databankUrl:string = `${environment.apiUrl}/databank`; //"http://localhost:1337/DataBank";

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<DataBank[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<DataBank[]>(this.databankUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<DataBank[]>(this.databankUrl+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<DataBank>(this.databankUrl+"/find",options);
  }
  create(DataBank: any){
    return this.http.post<DataBank>(this.databankUrl+"/add",DataBank);
  }
  update(data:DataBank):Observable<any>{
    return this.http.put<DataBank>(this.databankUrl+"/update",data);
   }
   
  disable(id:number){
    const body = { id: id };
    return this.http.put<DataBank>(this.databankUrl+"/disable",body);
  }

}
