import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPurchaseOrdersComponent } from './edit.purchaseOrders.component';
import { EditPurchaseOrdersRoutigModule } from './edit.purchaseOrders-routing.module';
import { ProviderService } from 'src/app/service/provider.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
	imports: [
		CommonModule,
		EditPurchaseOrdersRoutigModule,
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
		InputSwitchModule,
		TooltipModule
		
	],
	declarations: [EditPurchaseOrdersComponent],
	providers: [ProviderService, MessageService, ConfirmationService]
})
export class EditPurchaseOrdersModule { }
