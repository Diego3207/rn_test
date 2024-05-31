import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditServiceComponent } from './edit.service.component';
import { EditServiceRoutigModule } from './edit.service-routing.module';
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
		EditServiceRoutigModule,
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
	declarations: [EditServiceComponent],
	providers: [ServiceService, MessageService, ConfirmationService]
})
export class EditServiceModule { }
