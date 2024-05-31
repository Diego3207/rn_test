import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPurchaseOrdersComponent } from './list.purchaseOrders.component';
import { ListPurchaseOrdersRoutigModule } from './list.purchaseOrders-routing.module';
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
@NgModule({
	imports: [
		CommonModule,
		ListPurchaseOrdersRoutigModule,
		TableModule,
		ButtonModule,
		ConfirmDialogModule,
		ToolbarModule,
		DialogModule,
		RippleModule,
		ToastModule,
		TooltipModule 
	],
	declarations: [ListPurchaseOrdersComponent],
	providers:[PurchaseOrderService, MessageService, ConfirmationService]
})
export class ListPurchaseOrdersModule { }
