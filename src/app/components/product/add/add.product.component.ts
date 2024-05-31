import { Component, ViewChild } from '@angular/core';
import { Product } from 'src/app/api/product';
import { ProductService } from 'src/app/service/product.service';
import { ProductFileService } from 'src/app/service/productFile.service';
import { ProductCategoryService } from 'src/app/service/productCategory.service';
import { FileUpload } from 'primeng/fileupload';
import { Router } from '@angular/router';
import { FileService } from 'src/app/service/file.service';
import { MiscService } from 'src/app/service/misc.service';
import { ConfirmationService, MessageService  } from 'primeng/api';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';



@Component({
    templateUrl: './add.product.component.html'
})
export class AddProductComponent  {
    @ViewChild('fileUpload') fileUpload: FileUpload;
    submitted: boolean = false;
    files : any[] = [];
    uploadedFiles: any[] = []; //lista de archivos por cargar
    form: FormGroup | any;
    unitMeasures: any[] =  [];
    listCategory: any[] = [];

    constructor(    
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private productFileService: ProductFileService,
        private productCategoryService: ProductCategoryService,
        private messageService: MessageService,
        private miscService:MiscService,
        private fileService:FileService,
        private confirmationService: ConfirmationService,
        private router: Router ) 
    {
    }

    ngOnInit(): void 
	{

        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
       
		this.form = this.formBuilder.group
		({
            productBrand: [null, [Validators.required,Validators.maxLength(100)]],
            productModel: [null, [Validators.required,Validators.maxLength(100)]],
            productDescription: [null, Validators.required],
            productCategoryId: [null, Validators.required],
            productAsset: [null, Validators.required],
            productPrice: [null,[Validators.required ,Validators.min(0), Validators.max(999999999999)]],
            productGuaranteeUnit: [' ',[Validators.min(0), Validators.max(365)]],
            productGuaranteeUnitMeasure: [' ', [Validators.max(100)]],
            productGuaranteeSpecifications: ['Defectos de fabricación', [Validators.max(250)]], 
         }, formOptions);

         this.unitMeasures = [
            { name: 'Día(s)', value:"dia"},
            { name: 'Mes(es)', value:"mes"},
            { name: 'Año(s)', value:"año"},
        ];

        this.list();

    }

    ngOnDestroy() {
       
    }

    onSubmit() 
	{
     // stop here if form is invalid
        if (this.form.invalid) 
        {
            return;
        }
        this.save();
    }
    cancel(event) {
        event.preventDefault(); //
        this.router.navigate(['/product']);
    }

    onUpload(event: any) 
	{
        this.files = event.currentFiles;
        for(let i = 0 ; i < this.files.length; i++)
        {
            this.uploadedFiles.indexOf(this.files[i]) === -1 ? this.uploadedFiles.push(this.files[i]) : console.log("Este archivo ya existe"); 
        } 
    }

    //guarda el archivo al servidor
	saveFile(idProduct:string)
	{     
		if(this.uploadedFiles.length > 0)
		{	
            var peticiones: any[] = []; 
            for(let i = 0 ; i < this.uploadedFiles.length; i++)
            {
                const ptt = this.fileService.upload(this.uploadedFiles[i], 'product_documentation').pipe
                (
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar los archivos", detail:error.message });
				        return of(null);
                    })
                );				
                peticiones.push(ptt);			        
            }
            
            forkJoin(peticiones).subscribe((data: any[]) => 
            {
                var idFiles: any[] = []; 
                var nameFiles: any[] = [];
                var sizeFiles: any[] = [];
                for(let i = 0 ; i < data.length; i++)
                {
                    if(data[i] != null){
                        idFiles.push( data[i].files[0].fd );
                        nameFiles.push( data[i].files[0].filename );
                        sizeFiles.push( (data[i].files[0].size / 1024).toFixed(2) );
                    }           
                }
                this.saveProductFiles(idProduct,idFiles,nameFiles,sizeFiles);
            }, 
            err => 
            {		
                this.miscService.endRquest(); //fin del proceso error de imagen
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar archivo", detail:err.message });
            }); 
		}
		else
		{
			this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Elemento guardado exitosamente', life: 3000 }); 
            this.miscService.endRquest(); //fin del proceso por guardado
            this.router.navigate(['/product']);
        }

    }

    private saveProductFiles(idP,idF,nameF,sizeF)
    {
    
        var peticiones: any[] = [];

        for(let i = 0 ; i < idF.length; i++)
        {
            let productFileProperties = {
                productFileProductId: idP.toString(),
                productFileDocumentation: idF[i].toString(),
                productFileName: nameF[i].toString(),
                productFileSize: sizeF[i].toString() 
            };
            peticiones.push(this.productFileService.create(productFileProperties));
        }

        forkJoin(peticiones).subscribe((data: any[]) => 
        {
            this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Elemento guardado exitosamente', life: 3000 }); 
            this.miscService.endRquest(); //fin del proceso por guardado
            this.router.navigate(['/product']);
        }, 
        err => 
        {		
            this.miscService.endRquest(); //fin del proceso error de imagen
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar archivo", detail:err.message });
        }); 
    }

    private save()
    {
        let productProperties = {};       
        Object.keys(this.form.value).forEach(element => 
		{
            productProperties[element] = this.form.value[element]; //copia las propiedades del objeto principal        
        });

        this.productService.create(productProperties).subscribe(
        (data:any) =>{
            this.saveFile(data.newId);
        }, 
        (err:any) => {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error al guardar', detail: err.message , life: 3000 });

        }); 
    }

    list()
    {

        this.miscService.startRequest();
  
        //Método para listar Categorías
        const categories = this.productCategoryService.getAll(0,1,'[{"id":"asc"}]')
        .pipe(
          catchError((error) => 
          {
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo", detail:error.message });
            return of(null); 
          })
        );
        
        
        //Hacemos fork join para mandar las peticiones
        forkJoin([categories]).subscribe(([dataCategories])=>
        {
            //console.log(dataCategories);
          //Envia las categorias
          if(dataCategories != null )
          {                    
              dataCategories['object']['records'].forEach(element => {
                  this.listCategory.push({'label': element['productCategoryDescription'],'value': element['id'].toString()});
                  console.log(this.listCategory);
              });
          }
          this.miscService.endRquest(); 
        },
  
        (err:any)=>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error general al obtener los catalogos', life: 3000 });
            this.miscService.endRquest();
        });
            
    }

}

