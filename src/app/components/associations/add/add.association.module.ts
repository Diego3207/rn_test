import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAssociationComponent } from './add.association.component';
import { AddAssociationRoutigModule } from './add.association-routing.module';
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

@NgModule({
	imports: [
		CommonModule,
		AddAssociationRoutigModule,
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
		InputMaskModule
	],
	declarations: [AddAssociationComponent],
	providers: [ProviderService, MessageService, ConfirmationService]
})
export class AddAssociationModule { }
