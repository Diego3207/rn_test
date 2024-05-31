import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControlOptions, ValidationErrors, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MessageService  } from 'primeng/api';
import { catchError  } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';

import { ModuleService} from 'src/app/service/module.service';

@Component({
    templateUrl: './edit.modules.component.html',
})

export class EditModulesComponent 
{
	id:number; 	
    form: FormGroup | any;
	
	constructor(    
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private router: Router,		
		private miscService:MiscService,
		private route: ActivatedRoute,
		
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
			moduleName: [null,[Validators.required,Validators.maxLength(255)]],
			moduleDescription: [null,[Validators.maxLength(255)]],
        }, formOptions);

		this.load();
	}
	
	load()
	{
		this.miscService.startRequest();
		this.moduleService.getById(this.id).subscribe(res => 
		{
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
		this.router.navigate(['/modules']);
	}
		
	updateForm()
	{
		let properties = {};
        
		this.miscService.startRequest();
		
        Object.keys(this.form.value).forEach(element => 
		{
            properties[element] = this.form.value[element];
        });
		
		
		this.moduleService.update(properties).subscribe(
		(data:any)=>
		{
			this.miscService.endRquest(); //fin del proceso por guardado
			this.router.navigate(['/modules']);
		},
		(error:any)=>{
			
			this.miscService.endRquest();
			this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar el registro", detail:error.message });
		});		
	}

}
