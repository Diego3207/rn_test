import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSaleOrderComponent } from './add.saleOrder.component';
import { AddSaleOrderRoutingModule } from './add.saleOrder-routing.module';
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
		AddSaleOrderRoutingModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		RadioButtonModule,
		MessageModule,
		ReactiveFormsModule,
		DropdownModule,
		TableModule,
		InputMaskModule,
		TooltipModule,
		CalendarModule,
		DialogModule,
		InputSwitchModule,
		CheckboxModule
	],
	declarations: [AddSaleOrderComponent],
	providers: [ProviderService, MessageService, ConfirmationService]
})
export class AddSaleOrderModule { }
