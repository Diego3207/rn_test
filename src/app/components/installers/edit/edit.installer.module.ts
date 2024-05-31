import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditInstallerComponent } from './edit.installer.component';
import { EditInstallerRoutigModule } from './edit.installer-routing.module';
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

@NgModule({
	imports: [
		CommonModule,
		EditInstallerRoutigModule,
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
		InputMaskModule	
	],
	declarations: [EditInstallerComponent],
	providers: [ProductService, MessageService, ConfirmationService]
})
export class EditInstallerModule { }
