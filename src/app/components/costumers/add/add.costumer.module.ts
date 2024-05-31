import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCostumerComponent } from './add.costumer.component';
import { AddCostumerRoutingModule } from './add.costumer-routing.module';
import { ProviderService } from 'src/app/service/provider.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { AutoCompleteModule } from 'primeng/autocomplete';


@NgModule({
	imports: [
		CommonModule,
		AddCostumerRoutingModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		RadioButtonModule,
		MessageModule,
		ReactiveFormsModule,
		DropdownModule,
		TableModule,
		InputMaskModule,
		InputSwitchModule,
		TooltipModule,
		AutoCompleteModule
	],
	declarations: [AddCostumerComponent],
	providers: [ProviderService, MessageService, ConfirmationService]
})
export class AddCostumerModule { }
