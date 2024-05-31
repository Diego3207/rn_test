import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControlOptions, ValidationErrors, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BranchService} from 'src/app/service/branch.service';
import { MiscService } from 'src/app/service/misc.service';

import { MessageService  } from 'primeng/api';
import { catchError  } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    templateUrl: './edit.branches.component.html',
})

export class EditBranchesComponent 
{
	id:number; 	
    form: FormGroup | any;
	
	constructor(    
        private formBuilder: FormBuilder,
        private branchService: BranchService,
        private messageService: MessageService,
        private router: Router,		
		private miscService:MiscService,
		private route: ActivatedRoute,
		) 
    {}

    ngOnInit(): void 
	{		 
		this.id = parseInt(this.route.snapshot.params['id']);
		
		const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ;
       
		this.form = this.formBuilder.group
		({
            id:[this.id, Validators.required],
			branchName: [null,[Validators.required,Validators.maxLength(255)]],
        }, formOptions);

		this.load();
	}
	
	load()
	{
		this.miscService.startRequest();
		this.branchService.getById(this.id).subscribe(res => 
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
		event.preventDefault(); //
		this.router.navigate(['/branches']);
	}
		
	updateForm()
	{
		let properties = {};
        
		this.miscService.startRequest();
		
        Object.keys(this.form.value).forEach(element => 
		{
            properties[element] = this.form.value[element];
        });
		
		
		this.branchService.update(properties).subscribe(
		(data:any)=>
		{
			this.miscService.endRquest(); //fin del proceso por guardado
			this.router.navigate(['/branches']);
		},
		(error:any)=>{
			
			this.miscService.endRquest();
			this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar el registro", detail:error.message });
		});		
	}

}
