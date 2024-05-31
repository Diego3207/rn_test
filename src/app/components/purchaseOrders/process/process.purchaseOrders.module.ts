import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessPurchaseOrdersComponent } from './process.purchaseOrders.component';
import { ListPurchaseOrdersRoutigModule } from './process.purchaseOrders-routing.module';
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
import { TimelineModule } from 'primeng/timeline';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';






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
		TooltipModule,
		FormsModule,
		TimelineModule,
		InputTextModule,
		DropdownModule,
		ReactiveFormsModule,
		FileUploadModule,
		PanelModule,
		CardModule,
		DividerModule,
		TabViewModule,
		AccordionModule,
		BadgeModule,
		ChipModule,
		InputSwitchModule,
		MessagesModule

	],
	declarations: [ProcessPurchaseOrdersComponent],
	providers:[PurchaseOrderService, MessageService, ConfirmationService]
})
export class ProcessPurchaseOrdersModule { }
