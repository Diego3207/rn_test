import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddIncidenceComponent } from './add.incidence.component';
import { AddIncidenceRoutigModule } from './add.incidence-routing.module';
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
import { FileUploadModule } from 'primeng/fileupload';
import { GoogleMapsModule } from '@angular/google-maps';
import { InputMaskModule } from 'primeng/inputmask';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';






@NgModule({
	imports: [
		CommonModule,
		AddIncidenceRoutigModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		RadioButtonModule,
		MessageModule,
		ReactiveFormsModule,
		DropdownModule,
		FileUploadModule,
		GoogleMapsModule,
		InputMaskModule,
		AutoCompleteModule,
		CalendarModule,
		ImageModule,
		TableModule,
		CheckboxModule

	],
	declarations: [AddIncidenceComponent],
	providers: [ProviderService, MessageService, ConfirmationService]
})
export class AddIncidenceModule { }
