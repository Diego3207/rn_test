import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ProductCategory } from 'src/app/api/productCategory';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class ProductCategoryService 
{
	bearer:string = "bearer";
    productCategoryUrl:string = `${environment.apiUrl}/productCategory`; 

  constructor(private http: HttpClient) 
  {	  
  }
  getAll(limit,page,sort):Observable<ProductCategory[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<ProductCategory[]>(this.productCategoryUrl+"/list",options);
  }
}