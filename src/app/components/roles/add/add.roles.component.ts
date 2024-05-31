import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControlOptions, ValidationErrors, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MessageService  } from 'primeng/api';
import { catchError  } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import {MiscService} from 'src/app/service/misc.service';

import { ModuleService } from 'src/app/service/module.service'; 
import { RoleService } from 'src/app/service/role.service';
import { RoleRightService} from 'src/app/service/roleRight.service';


@Component({
    templateUrl: './add.roles.component.html',
})

export class AddRolesComponent 
{

	moduleList: any[]; //catalogo de modulos	    
	form: FormGroup | any;
    
	constructor(    
        private formBuilder: FormBuilder,
		private messageService: MessageService,
        private router: Router,		
		private miscService:MiscService,
		
        private moduleService: ModuleService,
        private roleService: RoleService,
		private roleRightService: RoleRightService,
	) 
    {}

    ngOnInit(): void 
	{		 
		const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ;
       
		this.form = this.formBuilder.group
		({
            roleName: [null,[Validators.required,Validators.maxLength(512)]],
            roleRights: this.formBuilder.array([], [this.isUserBranchDuplicated]), 

         }, formOptions);
		 
		this.loadCatalogs();
	}
	
	loadCatalogs()
	{				
		 
		this.miscService.startRequest();
		
		const moduleCatalogObservable = this.moduleService.getAll(0,1,'[{"id":"asc"}]')
		.pipe(
			catchError((error) => 
			{
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de módulos", detail:error.message });
				return of(null); 
			})
		);
		        
		forkJoin([moduleCatalogObservable] ).subscribe(([ dataModules]) => 
		{
			if(dataModules!=null)
				this.moduleList = dataModules['object']['records'];
			
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
			
		/*const uniqueValues = new Set(); //set  acepta solo elementos distintos

		for (const item of control.controls) 
		{
			const userBranchBranch = item.value.userBranchBranch;

			// Verificar si el valor ya está en el conjunto
			if (uniqueValues.has(userBranchBranch)) 
			{
			  return { duplicated: true }; //error custom de retorno para indicar duplicidad
			}
			uniqueValues.add(userBranchBranch);
		}*/

		return null; //en este punto no hay error, se regresa null	
	}
	
    
    newRightElement() 
	{
        return this.formBuilder.group(
		{
            roleRightModule:  [null,Validators.required],
			roleRightAdd:  [false],
			roleRightUpdate:  [false],
			roleRightList:  [false],
			roleRightDelete:  [false],
			roleRightDisable:  [false],
        });
    }
    
    infoRightArray(): FormArray 
	{
        return this.form.get('roleRights') as FormArray;
    }
	   
    addRow()
	{
        this.infoRightArray().push(this.newRightElement());   
    }
	
    removeRow(index:number)
	{
        this.infoRightArray().removeAt(index); 
    }
    
	//se intenta guardar la informacion
    onSubmit() 
	{		
        	
		
		if (this.form.invalid)
		{
			return;
        }

		this.miscService.startRequest();
		this.saveForm();		
    }
	cancel(event) {
		event.preventDefault(); 
		this.router.navigate(['/roles']);
	}
	
			
	saveForm()
	{
		let dataProperties = {};
        
        Object.keys(this.form.value).forEach(element => 
		{
            if(element != "roleRights")
            {
                dataProperties[element] = this.form.value[element]; //copia las propiedades del objeto principal
            }          
        });
		
		this.roleService.create(dataProperties).subscribe(
		(data:any)=>
		{			
			this.saveRoleRight(data.newId);
		},
		(error:any)=>
		{
			
			this.miscService.endRquest(); //fin del proceso por error
			this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar registro", detail:error.message });
		});		
	}
	
	
	saveRoleRight(id:string)
	{		
		let roleRights = [];

        Object.keys(this.form.value).forEach(element => 
		{
            if(element == "roleRights")
            {
                roleRights = this.form.value[element]; //copia el arreglo de elementos externos
            }           
        });
		
		if( roleRights.length>0)
		{
			var peticiones: any[] = [];
			
			roleRights.forEach(obj => 
			{
				obj['roleRightRole'] = id;
				const ptt = this.roleRightService.create(obj).pipe
				(
					catchError((error) => 
					{
						this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar elemento", detail:error.message });
						return of(null);
					})
				);				
				peticiones.push(ptt);			
			});
					
			forkJoin(peticiones).subscribe((respuestas: any[]) => 
			{
				this.miscService.endRquest(); //fin del proceso por guardado
				this.router.navigate(['/roles']);
			}, 
			err => 
			{		
				this.miscService.endRquest(); //fin del proceso por error
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error general al guardar", detail:err.message });
			});
		}
		else
		{
			this.miscService.endRquest(); //fin del proceso por falta de elementos
			this.router.navigate(['/roles']);
		}
	}


}
