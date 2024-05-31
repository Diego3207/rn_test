import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddServiceComponent } from './add.service.component';
import { AddServiceRoutigModule } from './add.service-routing.module';
import { ServiceService } from 'src/app/service/service.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
	imports: [
		CommonModule,
		AddServiceRoutigModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		MessageModule,
		InputMaskModule,
		RadioButtonModule,
		InputNumberModule,
		DropdownModule,
		ReactiveFormsModule
		
	],
	declarations: [AddServiceComponent],
	providers: [ServiceService, MessageService, ConfirmationService]
})
export class AddServiceModule { }
