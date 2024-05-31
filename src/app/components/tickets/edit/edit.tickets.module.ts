import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTicketComponent } from './edit.tickets.component';
import { EditTicketRoutigModule } from './edit.tickets-routing.module';
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
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
	imports: [
		CommonModule,
		EditTicketRoutigModule,
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
		InputMaskModule,
		InputSwitchModule,
		DialogModule,
		TableModule,
		TooltipModule,
		CalendarModule,
		CheckboxModule
	],
	declarations: [EditTicketComponent],
	providers: [ProductService, MessageService, ConfirmationService]
})
export class EditTicketModule { }
