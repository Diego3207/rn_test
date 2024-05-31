import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { InstallerService } from 'src/app/service/installer.service'
import { Router } from '@angular/router';
import { MiscService } from 'src/app/service/misc.service';
import { MessageService } from 'primeng/api';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';




@Component({
  templateUrl: './add.installer.component.html'
})

export class AddInstallerComponent {
  @ViewChild('search') searchElementRef!: ElementRef;
  submitted: boolean = false;
  form: FormGroup | any;
  locationCoordenates: string;
  constructor(
    private formBuilder: FormBuilder,
    private installerService: InstallerService,
    private messageService: MessageService,
    private ngZone: NgZone,
    private miscService: MiscService,
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

        this.form.controls.installerAddress.setValue(place.formatted_address);
      });
    });
  }

  ngOnInit(): void {
    const formOptions: AbstractControlOptions = { validators: Validators.nullValidator };
    this.form = this.formBuilder.group({
      installerName: [null, [Validators.required, Validators.maxLength(100)]],
      installerAddress: [null, [Validators.required, Validators.maxLength(250)]],
      installerPhone: [null, Validators.required],
    }, formOptions);
  }

  ngOnDestroy() {

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
    this.router.navigate(['/installers']);
  } 

  private save() {
    this.installerService.create(this.form.value)
      .subscribe(data => {
        this.miscService.endRquest();
        this.messageService.add({ severity: 'success', key: 'msg', summary: 'Operación exitosa', life: 3000 });
        this.router.navigate(['/installers']);
      }, (err: any) => {
        this.messageService.add({ severity: 'error', key: 'msg', summary: 'Error', detail: 'Problemas al guardar', life: 3000 });
        this.miscService.endRquest();
      });
      
  }
}

