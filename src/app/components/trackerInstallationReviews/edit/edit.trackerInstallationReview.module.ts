import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTrackerInstallationReviewComponent } from './edit.trackerInstallationReview.component';
import { EditTrackerInstallationReviewRoutigModule } from './edit.trackerInstallationReview-routing.module';
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
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { AutoCompleteModule } from 'primeng/autocomplete';




@NgModule({
	imports: [
		CommonModule,
		EditTrackerInstallationReviewRoutigModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		MessageModule,
		ReactiveFormsModule,
		DropdownModule,
		RadioButtonModule,
		GoogleMapsModule,
		CalendarModule,
		InputSwitchModule,
		MultiSelectModule,
	    TableModule,
		TooltipModule,
		FileUploadModule,
		ImageModule,
		AutoCompleteModule
	],
	declarations: [EditTrackerInstallationReviewComponent],
	providers: [ProductService, MessageService, ConfirmationService]
})
export class EditTrackerInstallationReviewModule { }
