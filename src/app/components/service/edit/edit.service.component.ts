import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Service } from 'src/app/api/service';
import { Provider } from 'src/app/api/provider';
import { ServiceService } from 'src/app/service/service.service'
import { ActivatedRoute,Router } from '@angular/router';
import {ConfirmationService, MessageService  } from 'primeng/api';
import {AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError  } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { MiscService } from 'src/app/service/misc.service';



@Component({
    templateUrl: './edit.service.component.html'
})
export class EditServiceComponent implements OnInit, OnDestroy {
    providersList: Provider[];
    id:number;
    form: FormGroup | any;
    listItem: any[] = [];


    constructor(private miscService:MiscService,private formBuilder: FormBuilder,private serviceService: ServiceService, private messageService: MessageService, private confirmationService: ConfirmationService,private route: ActivatedRoute,private router: Router ) 
    {
    }

    ngOnInit(): void 
	{
        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
        this.id = parseInt(this.route.snapshot.params['idx']);
        this.form = this.formBuilder.group
		({
             id:[this.id, Validators.required], 
             serviceDescription: [null, [Validators.required,Validators.maxLength(255)]], 
             servicePrice: [null,[Validators.required ,Validators.min(1), Validators.max(999999999999)]],
             serviceQuantityTemporality:0,
             serviceTemporality:'',

        }, formOptions);;

       
        this.listItem= [
            { label: 'Día(s)', value:"dia"},
            { label: 'Mes(es)', value:"mes"},
            { label: 'Año(s)', value:"año"}
        ];

        
        this.getData();

        
		//console.log(this.form);
    }

    ngOnDestroy() {
       
    }
    onSubmit() 
	{

        // stop here if form is invalid
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
        
        
        this.serviceService.update(this.form.value)
        .subscribe(data =>{
            //console.log(data);
            this.miscService.endRquest();
            this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa',  life: 3000 });        
            this.router.navigate(['/services']);          
            
        },  (err : any) => {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: err.message, life: 3000 });

        });
    }

    
    getData(){

        this.serviceService.getById(this.id)
        .subscribe(data => {
            this.form.patchValue(data);
            this.miscService.endRquest();
                    
        },  (err : any) => {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: err.message, life: 3000 });
            this.miscService.endRquest();
        });
		
    }
}
