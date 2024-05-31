import { Component } from '@angular/core';
import { DataBankService } from 'src/app/service/databank.service';
import { Router } from '@angular/router';
import { MiscService } from 'src/app/service/misc.service';
import { MessageService  } from 'primeng/api';
import {AbstractControlOptions, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

interface Type {
  name: string;
  code: string;
}

interface Player {
  name: string;
  code: string;
}

interface Bank {
  name: string;
  code: string;
}

@Component({
    templateUrl: './add.databank.component.html'
})
export class AddDataBankComponent  
{
    submitted: boolean = false;
    form: FormGroup | any;
    types: Type[] | any;
    selectedType: Type | any;
    players: Player[] | any;
    selectedPlayer: Player | any;
    banks: Bank[] | any;
    selectedBank: Bank | any;
    
    constructor(    
        private formBuilder: FormBuilder,
        private databankService: DataBankService,
        private messageService: MessageService,
        private miscService:MiscService,
        private router: Router ) 
    {
    }

    ngOnInit(): void 
    {

    const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };

    this.form = this.formBuilder.group
      ({
        dataBankBeneficiaryName: [null, [Validators.required,Validators.maxLength(100)]],
        dataBankInstitutionName: [null, [Validators.required,Validators.maxLength(100)]],
        dataBankType: [null, [Validators.required,Validators.maxLength(100)]],
        dataBankNumber: [null, [Validators.required, this.isRightNumber]],
        dataBankPlayer: [null, [Validators.required,Validators.maxLength(100)]],
      }, formOptions);

      this.types = [
        { name: 'Tarjeta Bancaria', code: 'card' },
        { name: 'Cuenta', code: 'account' },
        { name: 'CLABE', code: 'clabe' },
      ];

      this.players = [
        { name: 'Cliente', code: 'costumer' },
        { name: 'Proveedor', code: 'provider' },
        { name: 'Propia', code: 'owner' },
      ];

      this.banks = [
        { name: 'Actinver', code: 'actinver' },
        { name: 'Afirme', code: 'afirme' },
        { name: 'American Express', code: 'american' },
        { name: 'Banamex', code: 'banamex' },
        { name: 'Banca Mifel', code: 'mifel' },
        { name: 'Banco del bienestar', code: 'bienestar' },
        { name: 'Bancoppel', code: 'bancoppel' },
        { name: 'Banjercito', code: 'banjercito' },
        { name: 'Banregio', code: 'banregio' },
        { name: 'Bansi', code: 'bansi' },
        { name: 'Banorte', code: 'banorte' },
        { name: 'BBVA', code: 'bbva' },
        { name: 'Compartamos Banco', code: 'compartamos' },
        { name: 'HSBC', code: 'hsbc' },
        { name: 'Monex', code: 'monex' },
        { name: 'Nacional financiera', code: 'nacional financiera' },
        { name: 'Santander', code: 'santander' },
        { name: 'Scotiabank', code: 'scotiabank' },
      ];
    }

    ngOnDestroy() 
    {
       
    }

    isRightNumber(control: FormControl) {
      
      console.log(control.value);
    }

    onSubmit() 
    {
      // stop here if form is invalid
      if (this.form.invalid) 
      {
        return;
      }
        this.save();
    }
    cancel(event) {
      event.preventDefault(); //
      this.router.navigate(['/databanks']);
    }
  

    private save() 
    {
    // create DataBank 
      this.databankService.create(this.form.value)
      .subscribe(data => 
      {
        this.miscService.endRquest();
        this.messageService.add({ severity: 'success', key: 'msg', summary: 'Operación exitosa', life: 3000 });
        this.router.navigate(['/databanks']);
      }, (err: any) => 
      {
        this.messageService.add({ severity: 'error', key: 'msg', summary: 'Error', detail:err.message , life: 3000 });
        this.miscService.endRquest();
      });
    }

}

