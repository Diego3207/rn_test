import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControlOptions, ValidationErrors, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BranchService} from 'src/app/service/branch.service';
import { MiscService } from 'src/app/service/misc.service';
import { MessageService  } from 'primeng/api';
import { catchError  } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    templateUrl: './add.branches.component.html',
})

export class AddBranchesComponent 
{
	
	form: FormGroup | any;
    
	constructor(    
        private formBuilder: FormBuilder,
        private branchService: BranchService,
        private messageService: MessageService,
        private router: Router,		
		private miscService:MiscService,
		) 
    {}

    ngOnInit(): void 
	{		 
		const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ;
       
		this.form = this.formBuilder.group
		({
            branchName: [null,[Validators.required,Validators.maxLength(255)]],            
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
		event.preventDefault(); //tiene que tener esta linea y el paramentro en la funcion para no seguir con el ngubmit
		this.router.navigate(['/branches']);
	}
			
	saveForm()
	{
		let properties = {};        
        Object.keys(this.form.value).forEach(element => 
		{
            properties[element] = this.form.value[element];                      
        });
		
		this.branchService.create(properties).subscribe(
		(data:any)=>
		{			
			this.miscService.endRquest();
			this.router.navigate(['/branches']);
		},
		(error:any)=>
		{			
			this.miscService.endRquest();
			this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar el registro", detail:error.message });
		});		
	}	
}
