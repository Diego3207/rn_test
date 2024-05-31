import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMonitoringDeviceComponent } from './add.monitoringDevices.component';
import { AddMonitoringDeviceRoutigModule } from './add.monitoringDevices-routing.module';
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
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
	imports: [
		CommonModule,
		AddMonitoringDeviceRoutigModule,
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
		InputSwitchModule
	],
	declarations: [AddMonitoringDeviceComponent],
	providers: [ProviderService, MessageService, ConfirmationService]
})
export class AddMonitoringDeviceModule { }
