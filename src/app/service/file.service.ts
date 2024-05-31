import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  
})
export class FileService 
{
	bearer:string = "bearer";
	url:string = `${environment.apiUrl}/file`;
  
	constructor(private http: HttpClient) 
	{	  
	} 
  
	upload(file, path) 
	{
		const imageFile: File = file;
		const formData: FormData = new FormData();
		formData.append('file', imageFile);
			
		let params = new HttpParams();
		params = params.append('path', path);
		
		return this.http.post(this.url+'/upload', formData, {/*headers: headers,*/params: params});
	}

	deleteFileService(file) 
	{
		return this.http.delete(this.url+"/delete/?file="+file);
	}
	
	downloadServer(urlFile)
	{
		return this.url+"/download?id="+urlFile;
	}

}