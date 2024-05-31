import { Component, OnDestroy, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { MiscService } from 'src/app/service/misc.service';
import { InstallerService } from 'src/app/service/installer.service'
import { ActivatedRoute,Router } from '@angular/router';
import { MessageService  } from 'primeng/api';
import {AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
    templateUrl: './edit.installer.component.html'
})
export class EditInstallerComponent implements OnInit, OnDestroy {
    @ViewChild('search') searchElementRef!: ElementRef;
    submitted: boolean = false;
    id:number;
    form: FormGroup | any;
    locationCoordenates: string;
    constructor(
        private formBuilder: FormBuilder,
        private installerService: InstallerService, 
        private messageService: MessageService, 
        private miscService:MiscService,
        private ngZone: NgZone,
        private route: ActivatedRoute,
        private router: Router ) 
    {
    }

    ngAfterViewInit(): void {
        // Binding autocomplete to search input control
        let autocomplete = new google.maps.places.Autocomplete(
          this.searchElementRef.nativeElement
        );
    
        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    
            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
    
            this.form.controls.installerAddress.setValue(place.formatted_address);
          });
        });
      }

    ngOnInit(): void 
	{
        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
        this.id = parseInt(this.route.snapshot.params['idx']);
		    this.form = this.formBuilder.group
		({
            id:[this.id, Validators.required],
            installerName: [null, [Validators.required, Validators.maxLength(100)]],
            installerAddress: [null, [Validators.required, Validators.maxLength(250)]],
            installerPhone: [null, Validators.required],
         }, formOptions);


        this.installerService.getById(this.id)
        .subscribe(data => {
           this.form.patchValue(data);

        })		
    }

    ngOnDestroy() {
       
    }

    onSubmit() 
	{
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
           this.save();
    }
    cancel(event) {
        event.preventDefault(); //
        this.router.navigate(['/installers']);
    } 

    private save()  
    {
    this.installerService.update(this.form.value)
    .subscribe(data =>
        {
        this.miscService.endRquest();
        this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa',  life: 3000 });
        this.router.navigate(['/installers']);  
        }, (err : any) => 
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });
            this.miscService.endRquest();
        }); 
    } 
      
    list()
    {
    this.installerService.getAll(500,1,'[{"id":"asc"}]')
        .subscribe((data: any)=>{
            
        }, err => {
            // Entra aquí si el servicio entrega un código http de error EJ: 404, 
            if(err.error['code'] == 301){
                // success  info  warn  error

                //this.loading = false;
                this.messageService.add({severity:'warn', key: 'msg',summary:  err.error['message'],life: 3000});
            }
        });
    }
}
