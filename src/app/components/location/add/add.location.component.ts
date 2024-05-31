import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { LocationService } from 'src/app/service/location.service'
import { Router } from '@angular/router';
import { MiscService } from 'src/app/service/misc.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControlOptions, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';




@Component({
  templateUrl: './add.location.component.html'
})

export class AddLocationComponent {
  @ViewChild('search') searchElementRef!: ElementRef;
  submitted: boolean = false;
  form: FormGroup | any;
  locationCoordenates: string;
  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private messageService: MessageService,
    private miscService: MiscService,
    private ngZone: NgZone,
    private confirmationService: ConfirmationService,
    private router: Router) {
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

        this.form.controls.locationAddress.setValue(place.formatted_address);
        this.form.controls.locationCoordenates.setValue(place.geometry.location?.lat() + ',' + place.geometry.location?.lng());
      });
    });
  }

  ngOnInit(): void {
    const formOptions: AbstractControlOptions = { validators: Validators.nullValidator };
    this.form = this.formBuilder.group({
      locationName: [null, [Validators.required, Validators.maxLength(100)]],
      locationAddress: [null, [Validators.required, Validators.maxLength(250)]],
      locationPhone: [null, Validators.required],
      locationCoordenates: [null, [Validators.required, this.isValidLocation]],
    }, formOptions);
  }

  ngOnDestroy() {

  }

  isValidLocation(control: FormControl) {
    if (control.value == null) {
      return { invalidated: true };
    }
    return null;
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.save();
  }
  cancel(event) {
    event.preventDefault(); //
    this.router.navigate(['/location']);
  }

  private save() {
    let productProperties = {};
    Object.keys(this.form.value).forEach(element => {
      if (element == 'locationCoordenates') {
        let coords = (this.form.value[element]).split(",");
        productProperties['locationLat'] = coords[0];
        productProperties['locationLng'] = coords[1];
      } else {
        productProperties[element] = this.form.value[element]; //copia las propiedades del objeto principal        
      }
    });

    // create Location 
    this.locationService.create(productProperties)
      .subscribe(data => {
        this.miscService.endRquest();
        this.messageService.add({ severity: 'success', key: 'msg', summary: 'Operación exitosa', life: 3000 });
        this.router.navigate(['/location']);
      }, (err: any) => {
        this.messageService.add({ severity: 'error', key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });
        this.miscService.endRquest();
      });
      
  }
}

