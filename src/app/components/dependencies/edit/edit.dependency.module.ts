import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDependencyComponent } from './edit.dependency.component';
import { EditDependencyRoutigModule } from './edit.dependency-routing.module';
import { DependencyService } from 'src/app/service/dependency.service';
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
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
	imports: [
		CommonModule,
		EditDependencyRoutigModule,
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
		CardModule,
		DividerModule,
		CheckboxModule,
		AutoCompleteModule

	],
	declarations: [EditDependencyComponent],
	providers: [DependencyService, MessageService, ConfirmationService]
})
export class EditDependencyModule { }
