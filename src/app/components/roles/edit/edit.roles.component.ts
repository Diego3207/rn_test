import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControlOptions, ValidationErrors, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MessageService  } from 'primeng/api';
import { catchError  } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';

import { ModuleService} from 'src/app/service/module.service';
import { RoleService } from 'src/app/service/role.service';
import { RoleRightService } from 'src/app/service/roleRight.service';

@Component({
    templateUrl: './edit.roles.component.html',
})

export class EditRolesComponent 
{
	id:number; 	
    form: FormGroup | any;
	moduleList: any[]; //catalogo de modulos
	deletedModules = [];
	constructor(    
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private router: Router,		
		private miscService:MiscService,
		private route: ActivatedRoute,
		private roleService: RoleService,
		private roleRightService: RoleRightService,
		private moduleService: ModuleService,
        
		) 
    {}

    ngOnInit(): void 
	{		 
		this.id = parseInt(this.route.snapshot.params['id']);
		
		const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ;
       
		this.form = this.formBuilder.group
		({
            id:[this.id, Validators.required],
			roleName: [null,[Validators.required,Validators.maxLength(512)]],
            roleRights: this.formBuilder.array([], [this.isUserBranchDuplicated]), 
        }, formOptions);
		this.load()
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
	
	load()
	{
		this.miscService.startRequest();
		this.roleService.getById(this.id).subscribe(res => 
		{
			console.log(res)
			for (let i=0; i < res.data['roleRights'].length; i++){
				this.addRow();
			}  
			this.form.patchValue(res.data);
			this.miscService.endRquest();
		},
		err=>
		{
			this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al recuperar datos del registro", detail:err.message });
			this.miscService.endRquest();
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
			id:null,
        	roleRightRole: null, 
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

	onSubmit() 
	{		
		if (this.form.invalid )
		{
			return;
        }
		
		this.updateForm();
    }
	cancel(event) {
		event.preventDefault(); 
		this.router.navigate(['/roles']);
	}
		
	updateForm()
	{
		let properties = {};
        
		this.miscService.startRequest();
		
        Object.keys(this.form.value).forEach(element => 
		{
            properties[element] = this.form.value[element];
        });
		
		
		this.roleService.update(properties).subscribe(
		(data:any)=>
		{
			console.log(properties);
		 	const actions = [];
            //-update/create
            this.form.value['roleRights'].forEach(element => {
                if(element['id'] == null)
                {
                    // -------- role rights --------
                    // create
					console.log(element['roleRightModule'].toString());
					element['roleRightRole'] = (this.form.value['id']).toString();
					element['roleRightModule'] = (element['roleRightModule']).toString();

                    const ptt = this.roleRightService.create(element).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar elemento nuevo contacto", detail:error.message });
                            return of(null);
                        })
                    );		
    
                   actions.push(ptt);
                }else{
                    // update
					element['roleRightRole'] = (element['roleRightRole']).toString();
					element['roleRightModule'] = (element['roleRightModule']).toString();
					const ptt = this.roleRightService.update(element).pipe(
                        catchError((error) => 
                        {
                            this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar contacto existente", detail:error.message });
                            return of(null);
                        })
                    );		
    
                   actions.push(ptt);

                }
            });
            //-Disable ("delete")
            this.deletedModules.forEach(id => {
                // update

                const ptt = this.roleRightService.disable(id).pipe(
                    catchError((error) => 
                    {
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar contacto existente", detail:error.message });
                        return of(null);
                    })
                );		

               actions.push(ptt);
                
            });
               
            if(actions != null){
                forkJoin(actions).subscribe(([] :any)=>
                {
                    this.router.navigate(['/roles']);
                    this.miscService.endRquest();  
                },
                (err : any)=>{
                    console.log(err.message);
                    this.miscService.endRquest(); //fin del proceso por error
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error general al elementos múltiples ", detail:err.message });
                }); 
            }  
			this.miscService.endRquest(); //fin del proceso por guardado
			this.router.navigate(['/roles']);
		},
		(error:any)=>{
			
			this.miscService.endRquest();
			this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar el registro", detail:error.message });
		});		
	}

}
