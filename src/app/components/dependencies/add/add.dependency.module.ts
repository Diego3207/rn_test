import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDependencyComponent } from './add.dependency.component';
import { AddDependencyRoutigModule } from './add.dependency-routing.module';
import { DependencyService } from 'src/app/service/dependency.service';
import { ProviderContactService } from 'src/app/service/providerContact.service';
import { ProviderLocationService } from 'src/app/service/providerLocation.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AutoCompleteModule } from 'primeng/autocomplete';





@NgModule({
	imports: [
		CommonModule,
		AddDependencyRoutigModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		MessageModule,
		ReactiveFormsModule,
		TableModule,
		InputMaskModule,
		MultiSelectModule,
		DropdownModule,
		InputNumberModule,
		CheckboxModule,
		CardModule,
		DividerModule,
		AutoCompleteModule
	],
	declarations: [AddDependencyComponent],
	providers: [DependencyService,ProviderContactService,ProviderLocationService, MessageService, ConfirmationService]
})
export class AddDependencyModule { }
