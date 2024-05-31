import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeSaleOrderComponent } from './resume.saleOrder.component';
import { ResumeSaleOrderRoutigModule } from './resume.saleOrder-routing.module';
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
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';


@NgModule({
	imports: [
		CommonModule,
		ResumeSaleOrderRoutigModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		MessageModule,
		ReactiveFormsModule,
		DropdownModule,
		RadioButtonModule,
		TableModule,
		InputMaskModule,
		TooltipModule,
		CalendarModule,
		DialogModule,
		InputSwitchModule,
		CheckboxModule

	],
	declarations: [ResumeSaleOrderComponent],
	providers: [ProductService, MessageService, ConfirmationService]
})
export class ResumeSaleOrderModule { }
