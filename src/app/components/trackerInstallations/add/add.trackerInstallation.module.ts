import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTrackerInstallationComponent } from './add.trackerInstallation.component';
import { AddTrackerInstallationRoutigModule } from './add.trackerInstallation-routing.module';
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
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MessagesModule } from 'primeng/messages';
import { ImageModule } from 'primeng/image';
import { AutoCompleteModule } from 'primeng/autocomplete';


@NgModule({
	imports: [
		CommonModule,
		AddTrackerInstallationRoutigModule,
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
		CalendarModule,
		InputSwitchModule,
		MultiSelectModule,
		TableModule,
		TooltipModule,
		MessagesModule,
		ImageModule,
		AutoCompleteModule
	],
	declarations: [AddTrackerInstallationComponent],
	providers: [ProviderService, MessageService, ConfirmationService]
})
export class AddTrackerInstallationModule { }
