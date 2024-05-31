import { Component } from '@angular/core';
import { Service } from 'src/app/api/service';
//import { Provider } from 'src/app/api/provider';
import { ServiceService } from 'src/app/service/service.service';
//import { ProviderService } from 'src/app/service/provider.service';
import { Router } from '@angular/router';
import {ConfirmationService, MessageService  } from 'primeng/api';
import {AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError  } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { MiscService } from 'src/app/service/misc.service';



@Component({
    templateUrl: './add.service.component.html'
})
export class AddServiceComponent  {
    //providersList: Provider[];
    form: FormGroup | any;
    listItem: any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private serviceService: ServiceService,
        //private providerService : ProviderService, 
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private miscService:MiscService,
        private router: Router ) 
    {
    }
    ngOnInit(): void 
	{

        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
       
		this.form = this.formBuilder.group
		({
            serviceDescription: [null, [Validators.required,Validators.maxLength(255)]], 
            servicePrice: [null,[Validators.required ,Validators.min(1), Validators.max(999999999999)]],
            serviceQuantityTemporality:null,
            serviceTemporality:null, 
        }, formOptions);

		this.listItem= [
            { label: 'Día(s)', value:"dia"},
            { label: 'Mes(es)', value:"mes"},
            { label: 'Año(s)', value:"año"}
        ];
       
    }   
    onSubmit() 
	{
        if (this.form.invalid) {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error',  detail:'Revisar formulario', life: 3000 });

            return;
        }
        this.miscService.startRequest();

        this.save();
    }
    cancel(event) {
        event.preventDefault(); //
        this.router.navigate(['/services']);
    }
  
    private save(){
        //console.log(this.form.value);
        this.serviceService.create(this.form.value)
        .subscribe(data =>{

            this.miscService.endRquest();
            this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa',  life: 3000 });
            
              this.router.navigate(['/services']);
     
            
        }, (err : any) => {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: err.message, life: 3000 });
            this.miscService.endRquest();
        });
    }
    
}

