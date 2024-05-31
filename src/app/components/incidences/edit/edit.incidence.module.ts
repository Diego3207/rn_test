import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditIncidenceComponent } from './edit.incidence.component';
import { EditIncidenceRoutigModule } from './edit.incidence-routing.module';
import { ProductService } from 'src/app/service/product.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GoogleMapsModule } from '@angular/google-maps';
import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from 'primeng/fileupload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';



@NgModule({
	imports: [
		CommonModule,
		EditIncidenceRoutigModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,

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
		DividerModule,
		ChipModule 

	],
	declarations: [EditIncidenceComponent],
	providers: [ProductService, MessageService, ConfirmationService]
})
export class EditIncidenceModule { }
