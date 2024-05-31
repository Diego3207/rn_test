import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControlOptions, ValidationErrors, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MessageService  } from 'primeng/api';
import { catchError  } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MiscService } from 'src/app/service/misc.service';

import { ModuleService} from 'src/app/service/module.service';


@Component({
    templateUrl: './add.modules.component.html',
})

export class AddModulesComponent 
{
	
	form: FormGroup | any;
    
	constructor(    
        private formBuilder: FormBuilder,        
        private messageService: MessageService,
        private router: Router,		
		private miscService:MiscService,
		private moduleService: ModuleService,
		) 
    {}

    ngOnInit(): void 
	{		 
		const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ;
       
		this.form = this.formBuilder.group
		({
            moduleName: [null,[Validators.required,Validators.maxLength(255)]],
			moduleDescription: [null,[Validators.maxLength(255)]],            
         }, formOptions);
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

		this.miscService.startRequest();
		this.saveForm();
    }
	cancel(event) {
		event.preventDefault(); 
		this.router.navigate(['/modules']);
	}
			
	saveForm()
	{
		let properties = {};        
        Object.keys(this.form.value).forEach(element => 
		{
            properties[element] = this.form.value[element];                      
        });
		
		this.moduleService.create(properties).subscribe(
		(data:any)=>
		{			
			this.miscService.endRquest();
			this.router.navigate(['/modules']);
		},
		(error:any)=>
		{			
			this.miscService.endRquest();
			this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar el registro", detail:error.message });
		});		
	}	
}
