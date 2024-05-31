import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeletedSupply } from 'src/app/api/deletedSupply';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class DeletedSupplyService 
{
	bearer:string = "bearer";
    deletedSupplyUrl:string = `${environment.apiUrl}/deletedSupply`; //"http://localhost:1337/DeletedSupply";

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<DeletedSupply[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<DeletedSupply[]>(this.deletedSupplyUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<DeletedSupply[]>(this.deletedSupplyUrl+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<DeletedSupply>(this.deletedSupplyUrl+"/find",options);
  }
  create(DeletedSupply: any){
    return this.http.post<DeletedSupply>(this.deletedSupplyUrl+"/add",DeletedSupply);
  }
  update(data:DeletedSupply):Observable<any>{
    return this.http.put<DeletedSupply>(this.deletedSupplyUrl+"/update",data);
   }
   
  disable(id:number){
    const body = { id: id };
    return this.http.put<DeletedSupply>(this.deletedSupplyUrl+"/disable",body);
  }

}
