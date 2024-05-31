import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/api/product';
import { ProductService } from 'src/app/service/product.service';
import { ProductCategoryService } from 'src/app/service/productCategory.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ConfirmationService, MessageService  } from 'primeng/api';
import { AbstractControlOptions, FormArray , ValidationErrors, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { FileService } from 'src/app/service/file.service';
import { ProductFileService } from 'src/app/service/productFile.service'
import { MiscService } from 'src/app/service/misc.service';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';



@Component({
    templateUrl: './edit.product.component.html'
})
export class EditProductComponent implements OnInit, OnDestroy {
    @ViewChild('fileUpload') fileUpload: FileUpload;
    submitted: boolean = false;
    productsFile: any [] = [];
    productsFileDelete: any [] = [];
    files : any[] = [];
    uploadedFiles: any[] = []; //lista de archivos por cargar
    products: Product[];
    product: Product;
    id:number;
    form: FormGroup | any;
    unitMeasures: any[] =  [];
    listCategory: any[] = [];
    visible: boolean = false;
    valueChange;

    constructor(
        private formBuilder: FormBuilder,
        private productService: ProductService, 
        private confirmationService: ConfirmationService,
        private messageService: MessageService, 
        private miscService:MiscService,
        private fileService:FileService,
        private productFileService: ProductFileService,
        private productCategoryService: ProductCategoryService,
        private route: ActivatedRoute,
        private router: Router ) 
    {
    }

    ngOnInit(): void 
	{
        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
        this.id = parseInt(this.route.snapshot.params['idx']);
		this.form = this.formBuilder.group
		({
            id:[this.id, Validators.required],
            productBrand: [null, [Validators.required,Validators.maxLength(100)]],
            productModel: [null, [Validators.required,Validators.maxLength(100)]],
            productCategoryId: [null, Validators.required],
            productDescription: [null, Validators.required],
            productAsset: [null, Validators.required],
            productPrice: [null,[Validators.required ,Validators.min(0), Validators.max(999999999999)]],
            productGuaranteeUnit: [null,[Validators.required ,Validators.min(1), Validators.max(365)]],
            productGuaranteeUnitMeasure: [null, [Validators.required,]],
            productGuaranteeSpecifications: [" ", [Validators.max(250)]], 
         }, formOptions);

         this.unitMeasures = [
            { name: 'Día(s)', value:"dia"},
            { name: 'Mes(es)', value:"mes"},
            { name: 'Año(s)', value:"año"},
        ];

        this.list();

        this.productService.getById(this.id)
        .subscribe(data => {
            this.valueChange = data.productCategoryId;
            data.productCategoryId = data.productCategoryId.toString();
            //console.log(data);
            this.form.patchValue(data); //Agrega la data a los inputs
            this.productsFile = data['productFile']; //Agrega los archivos a un array para mostrar
        });

        this.form.get("productCategoryId").valueChanges.subscribe(selectedValue => {
            this.valueChange != selectedValue ? this.visible = true : this.visible = false;
        });
    }

    cancelModal(){
        this.visible = false;
        this.form.controls.productCategoryId.setValue(this.valueChange.toString());
    }

    hideModal(){
        this.visible = false;
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


    pushFile(fileName,fileId){
        this.productsFileDelete.push({"id": fileId , "name": fileName});
        this.productsFile = this.productsFile.filter(e => e['productFileDocumentation'] != fileName);
    }

    private save()
    {
        this.deleteFile(); //Llama a la función que borra los archivos del servidor
        this.productService.update(this.form.value).subscribe
        (data =>{
            this.saveFile(this.form.value.id);
            this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa',  life: 3000 });
            setTimeout(() => {
                this.router.navigate(['/product']);
            }, 1000);
            
        }, err => {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error al guardar', detail: err.message , life: 3000 });
        });
    }

    deleteFile()
    {
        var peticiones: any[] = [];
        for(let i = 0 ; i < this.productsFileDelete.length; i++)
        {
            //delete product file from server
            const pfs = this.fileService.deleteFileService(this.productsFileDelete[i].name).pipe
            (
                catchError((error) => 
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar los archivos", detail:error.message });
                    return of(null);
                })
            );	
            peticiones.push(pfs);
            
            //delete product file from database
            const pfdb = this.productFileService.delete(this.productsFileDelete[i].id).pipe
            (
                catchError((error) => 
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar los archivos", detail:error.message });
                    return of(null);
                })
            );	
            peticiones.push(pfdb); 
        }

        forkJoin(peticiones).subscribe((respuestas: any[]) => 
        {
            this.miscService.endRquest(); //fin del proceso por guardado
            this.router.navigate(['/product']);
        }, 
        err => 
        {		
            this.miscService.endRquest(); //fin del proceso por error
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error general al eliminar archivos de producto", detail:err.message });
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
            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de categorias", detail:error.message });
            return of(null); 
          })
        );
        
        
        //Hacemos fork join para mandar las peticiones
        forkJoin([categories]).subscribe(([dataCategories])=>
        {
            console.log(dataCategories);
          //Envia las categorias
          if(dataCategories != null )
          {                    
              dataCategories['object']['records'].forEach(element => {
                  this.listCategory.push({'label': element['productCategoryDescription'],'value': element['id'].toString()});
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
