import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListQuotationSalesComponent } from './list.quotationSales.component';
import { ListQuotationSalesRoutigModule } from './list.quotationSales-routing.module';
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
import { EditorModule } from 'primeng/editor';
@NgModule({
	imports: [
		CommonModule,
		ListQuotationSalesRoutigModule,
		TableModule,
		ButtonModule,
		ConfirmDialogModule,
		ToolbarModule,
		DialogModule,
		RippleModule,
		ToastModule,
		TooltipModule,
		FormsModule,
		InputTextModule,
		ReactiveFormsModule,
		EditorModule,

	],
	declarations: [ListQuotationSalesComponent],
	providers:[PurchaseOrderService, MessageService, ConfirmationService]
})
export class ListQuotationSalesModule { }
