import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Product } from 'src/app/api/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class ProductService 
{
	bearer:string = "bearer";
    productUrl:string = `${environment.apiUrl}/product`; //"http://localhost:1337/provider";

  constructor(private http: HttpClient) 
  {	  
  }
  
  getAll(limit,page,sort):Observable<Product[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<Product[]>(this.productUrl+"/list",options);
  }
  getFilter(text,limit,page,sort) {
    const options = { params: new HttpParams({fromString: "filters="+text+"&limit="+limit+"&page="+page+"&sort="+sort}) };
    return this.http.get<Product[]>(this.productUrl+"/list",options);
          
  }
  getById(id:number){
    const options = { params: new HttpParams({fromString: "id="+ id}) };

    return this.http.get<Product>(this.productUrl+"/find",options);
  }
  create(product: any){
    return this.http.post<Product>(this.productUrl+"/add",product);
  }
  update(data:Product):Observable<any>{
    return this.http.put<Product>(this.productUrl+"/update",data);
   }
   
  disable(id:number){
    const body = { id: id };
    return this.http.put<Product>(this.productUrl+"/disable",body);
  }

}
