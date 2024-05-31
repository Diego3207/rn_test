import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ProductFile } from 'src/app/api/productFile';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class ProductFileService 
{
	bearer:string = "bearer";
    productFileUrl:string = `${environment.apiUrl}/productFile`; 

  constructor(private http: HttpClient) 
  {	  
  }
  
  create(productFile: any){
    return this.http.post<ProductFile>(this.productFileUrl+"/add",productFile);
  }

  delete(id:number){
    const body = { id: id };
    return this.http.put<ProductFile>(this.productFileUrl+"/delete",body);
  }
  /*getAll(limit,page,sort):Observable<Product[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<Product[]>(this.productFileUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Product[]>(this.productFileUrl+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Product>(this.productFileUrl+"/find",options);
  }
  update(data:Product):Observable<any>{
    return this.http.put<Product>(this.productFileUrl+"/update",data);
   }
  disable(id:number){
    const body = { id: id };
    return this.http.put<Product>(this.productFileUrl+"/disable",body);
  }*/
}
