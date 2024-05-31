import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessQuotationPurchasesComponent } from './process.quotationPurchases.component';
import { ProcessQuotationPurchasesRoutigModule } from './process.quotationPurchases-routing.module';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PurchaseOrderService } from 'src/app/service/purchaseOrder.service'
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
	imports: [
		CommonModule,
		ProcessQuotationPurchasesRoutigModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		MessageModule,
		ReactiveFormsModule,
		TableModule,
		InputMaskModule,
		DropdownModule,		
		InputNumberModule,
		CheckboxModule,
		CalendarModule,
		InputSwitchModule,
		TooltipModule
	],
	declarations: [ProcessQuotationPurchasesComponent],
	providers:[PurchaseOrderService, MessageService, ConfirmationService]
})
export class ProcessQuotationPurchasesModule { }
