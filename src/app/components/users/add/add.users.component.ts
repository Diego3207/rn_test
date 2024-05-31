import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControlOptions, ValidationErrors, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { UserService } from 'src/app/service/user.service'; 
import { RoleService } from 'src/app/service/role.service';
import { BranchService} from 'src/app/service/branch.service';
import {UserBranchService} from 'src/app/service/userBranch.service';
import { MiscService } from 'src/app/service/misc.service';
import { FileService } from 'src/app/service/file.service';

import { MessageService  } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { catchError  } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import { map } from 'rxjs/operators';

@Component({
    templateUrl: './add.users.component.html',
	styleUrls: ['./add.users.component.scss'],
})

export class AddUsersComponent 
{
	@ViewChild('fileUpload') fileUpload: FileUpload;
	branchList: any[]; // = ['..','..'];
	roleList: any[]; 	
    submitted: boolean = false;
    form: FormGroup | any;
    uploadedFiles: any[] = []; //lista de archivos por cargar
	image: any; //imagen que se muestra en el control
    objectURL: string = '';  //url de la imagen a cargar
	
	constructor(    
        private formBuilder: FormBuilder,
        private userService: UserService,
        private roleService: RoleService,
		private userBranchService: UserBranchService,
        private branchService: BranchService,
        private messageService: MessageService,
        private router: Router,		
		private miscService:MiscService,
		private fileService:FileService
		) 
    {}

    ngOnInit(): void 
	{		 
		const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ;
       
		this.form = this.formBuilder.group
		({
            userFullName: [null,[Validators.required,Validators.maxLength(255)]],
            userEmail: [null, [Validators.required, Validators.maxLength(255), Validators.email]], //this.isEmailDuplicated
            userPassword: [null,[Validators.required, Validators.maxLength(255), Validators.minLength(6)]],
			userEmailStatus: ['unconfirmed',[Validators.required]],
            userBranches: this.formBuilder.array([], [Validators.required, Validators.minLength(1), this.isUserBranchDuplicated]), 

         }, formOptions);
		 
		this.loadCatalogs();
	}
	
	loadCatalogs()
	{				
		 
		this.miscService.startRequest();
		
		const branchCatalogObservable = this.branchService.getAll(0,1,'[{"id":"asc"}]')
		.pipe(
			catchError((error) => 
			{
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de sucursales", detail:error.message });
				return of(null); 
			})
		);
		
		const rolCatalogObservable = this.roleService.getAll(0,1,'[{"id":"asc"}]')
		.pipe
		(
			catchError((error) => 
			{
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar catálogo de roles", detail:error.message });
				return of(null);
			})
		);	
		        
		forkJoin([branchCatalogObservable, rolCatalogObservable] ).subscribe(([ dataBranches, dataRoles]) => 
		{
			if(dataRoles!=null)
				this.roleList = dataRoles['object']['records'];
			
			if(dataBranches!=null)
				this.branchList = dataBranches['object']['records'];	
			
			this.miscService.endRquest(); 
		}, 
		err => 
		{		
			this.miscService.endRquest();
			this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error general al obtener catalogos", detail:err.message });
		});
	}
		

    ngOnDestroy() 
	{       
    }
	
	isUserBranchDuplicated(control: FormArray ) 
	{
			
		const uniqueValues = new Set(); //set  acepta solo elementos distintos

		for (const item of control.controls) 
		{
			const userBranchBranch = item.value.userBranchBranch;

			// Verificar si el valor ya está en el conjunto
			if (uniqueValues.has(userBranchBranch)) 
			{
			  return { duplicated: true }; //error custom de retorno para indicar duplicidad
			}
			uniqueValues.add(userBranchBranch);
		}

		return null; //en este punto no hay error, se regresa null	
	}
	
	/*
	isEmailDuplicated(control: FormArray ) //: Promise<ValidationErrors | null>
	{
		return new Promise((resolve, reject) => 
		{
			//this.userService.getByEmail(control.value)
            //    .subscribe((data:any) => 
			//	{
			//		console.log(data);
			//		resolve({ emailduplicated: true });
            //    },
			//	(error) => 
			//	{
            //        console.log(error);
			//		resolve(null);
            //    });
			
			console.log(this.objectURL);
				
			resolve({ emailduplicated: true });
		});
		
		this.userService.getByEmail(control.value).pipe
		(
			map((res) =>
			{		

				return { emailduplicated: true };
			})
		);
		
		
		return { emailduplicated: true };
	
	}*/
	
	//carga el elemento al preview cuando se selecciona una foto
	onUpload(event: any) 
	{
        let file = event.files[0];
        file.objectURL = file.objectURL ? file.objectURL : this.objectURL;

        if (!file.objectURL) 
		{
            return;
        }
        else 
		{
            this.image = file;
            this.objectURL = file.objectURL;
        }
    }

	//se limpia la imagen
    removeImage() 
	{
        this.image = null;
    }
    
    newBrancheElement() 
	{
        return this.formBuilder.group(
		{
            userBranchBranch:  [null,Validators.required],
			userBranchRole:  [null,Validators.required],
        });
    }
    
    infoBranchesArray(): FormArray 
	{
        return this.form.get('userBranches') as FormArray;
    }
	   
    addRow(type)
	{
		//this.submitted = false;       
		if(type == 'branches')
        {
            this.infoBranchesArray().push(this.newBrancheElement());   
        }             
    }
	
    removeRow(type,index:number)
	{
        if(type == 'branches')
        {
            this.infoBranchesArray().removeAt(index); 
        }
    }
    
	//se intenta guardar la informacion
    onSubmit() 
	{		

		console.log(this.form);

		//this.submitted = true;
        
		if (this.form.invalid )
		{
			return;
        }

		this.miscService.startRequest();
		this.checkEmail();		
    }
	cancel(event) {
		event.preventDefault(); 
		this.router.navigate(['/users']);
	}
	
	checkEmail()
	{
		this.userService.getByEmail(this.form.controls.userEmail.value).subscribe(
		(data:any)=>
		{			
			if(data.data)
			{
				this.miscService.endRquest(); //fin de intento por correo duplicado
				this.messageService.add({ life:5000, key: 'msg', severity: 'warn', summary: "Correo no disponible", detail:"El correo seleccionado ya ha sido usado" });
			}
			else
			{
				this.saveImage(); //el usuario es valido, se inicia el guardado
			}
							
		},
		(error:any)=>
		{			
			this.miscService.endRquest(); 
			this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al consultar la disponibilidad del correo", detail:error.message });
		});
	}
	
    //guarda el archivo de imagen al servidor
	saveImage()
	{        
		if(this.image)
		{			
			this.fileService.upload(this.image, 'user_img').subscribe(
			(data:any)=>{
				
				this.saveForm(data.files[0].fd);
			},
			(error:any)=>{
				
				this.miscService.endRquest(); //fin del proceso error de imagen
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar archivo", detail:error.message });
			});
		}
		else
		{
			this.saveForm();
		}

    }
		
	saveForm(img?:string)
	{
		let userProperties = {};
        
        Object.keys(this.form.value).forEach(element => 
		{
            if(element != "userBranches")
            {
                userProperties[element] = this.form.value[element]; //copia las propiedades del objeto principal
            }          
        });
		
		if(img)
			userProperties['userImage'] = img;
		
		this.userService.create(userProperties).subscribe(
		(data:any)=>{
			
			this.saveBranches(data.newId);
		},
		(error:any)=>{
			
			this.miscService.endRquest(); //fin del proceso por error
			this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar registro de usuario", detail:error.message });
		});		
	}
	
	
	saveBranches(id:string)
	{
		let userBranches = [];

        Object.keys(this.form.value).forEach(element => 
		{
            if(element == "userBranches")
            {
                userBranches = this.form.value[element]; //copia el arreglo de elementos externos
            }           
        });
		
		if( userBranches.length>0)
		{
			var peticiones: any[] = [];
			
			userBranches.forEach(obj => 
			{
				obj['userBranchUser'] = id;
				const ptt = this.userBranchService.create(obj).pipe(
					catchError((error) => 
					{
						this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar elemento de sucursales", detail:error.message });
						return of(null);
					})
				);				
				peticiones.push(ptt);			
			});
					
			forkJoin(peticiones).subscribe((respuestas: any[]) => 
			{
				this.miscService.endRquest(); //fin del proceso por guardado
				this.router.navigate(['/users']);
			}, 
			err => 
			{		
				this.miscService.endRquest(); //fin del proceso por error
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error general al guardar sucursales", detail:err.message });
			});
		}
		else
		{
			this.miscService.endRquest(); //fin del proceso por falta de elementos
			this.router.navigate(['/users']);
		}
	}


}
