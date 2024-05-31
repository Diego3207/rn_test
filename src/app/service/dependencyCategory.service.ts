import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { DependencyCategory} from 'src/app/api/dependencyCategory';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class DependencyCategoryService 
{
	bearer:string = "bearer";
    url:string = `${environment.apiUrl}/dependencyCategory`; 

  constructor(private http: HttpClient) 
  {	   
  }
  
  getAll(limit,page,sort):Observable<DependencyCategory[]> {
    const options = { params: new HttpParams({fromString: "limit="+limit+"&page="+page+"&sort="+sort}) };
	return this.http.get<DependencyCategory[]>(this.url+"/list",options);
  }
}
