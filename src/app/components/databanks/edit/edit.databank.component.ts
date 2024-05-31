import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataBank } from 'src/app/api/databank';
import { DataBankService } from 'src/app/service/databank.service'
import { ActivatedRoute,Router } from '@angular/router';
import { MessageService  } from 'primeng/api';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MiscService } from 'src/app/service/misc.service';

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
    templateUrl: './edit.databank.component.html'
})
export class EditDataBankComponent implements OnInit, OnDestroy {
    submitted: boolean = false;
    databanks: DataBank[];
    databank: DataBank;
    types: Type[] | any;
    selectedType: Type | any;
    players: Player[] | any;
    selectedPlayer: Player | any;
    banks: Bank[] | any;
    selectedBank: Bank | any;
    id:number;
    form: FormGroup | any;

   
    constructor(
        private formBuilder: FormBuilder,
        private dataBankService: DataBankService, 
        private messageService: MessageService, 
        private miscService:MiscService,
        private route: ActivatedRoute,
        private router: Router ) 
    {
    }

    ngOnInit(): void 
	{
        const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ; //MustMatch('password', 'confirmPassword') };
        this.id = parseInt(this.route.snapshot.params['idx']);
		this.form = this.formBuilder.group
		({
            id:[this.id, Validators.required],
            dataBankBeneficiaryName: [null, [Validators.required,Validators.maxLength(100)]],
            dataBankInstitutionName: [null, [Validators.required,Validators.maxLength(100)]],
            dataBankType: [null, [Validators.required,Validators.maxLength(100)]],
            dataBankNumber: [null, [Validators.required,Validators.maxLength(100)]],
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

        this.dataBankService.getById(this.id)
        .subscribe(data => {
            this.form.patchValue(data); //Agrega la data a los inputs
        })		
    }

    
    ngOnDestroy() {
       
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
        let properties = {};
        
		this.miscService.startRequest();
		
        Object.keys(this.form.value).forEach(element => 
		{
            properties[element] = this.form.value[element];
        });
		
		
		this.dataBankService.update(properties).subscribe(
		(data:any)=>
		{
			this.miscService.endRquest(); //fin del proceso por guardado
			this.router.navigate(['/databanks']);
		},
		(error:any)=>{
			
			this.miscService.endRquest();
			this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al actualizar el registro", detail:error.message });
		});		
    } 
}
