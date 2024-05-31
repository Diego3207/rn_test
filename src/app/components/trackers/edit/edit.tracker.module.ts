import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTrackerComponent } from './edit.tracker.component';
import { EditTrackerRoutigModule } from './edit.tracker-routing.module';
import { ProviderService } from 'src/app/service/provider.service';
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

@NgModule({
	imports: [
		CommonModule,
		EditTrackerRoutigModule,
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
		InputNumberModule
	],
	declarations: [EditTrackerComponent],
	providers: [ProviderService, MessageService, ConfirmationService]
})
export class EditTrackerModule { }
