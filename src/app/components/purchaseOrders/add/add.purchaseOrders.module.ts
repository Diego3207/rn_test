import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPurchaseOrdersComponent } from './add.purchaseOrders.component';
import { AddPurchaseOrdersRoutigModule } from './add.purchaseOrders-routing.module';
import { ProviderService } from 'src/app/service/provider.service';
import { ProviderContactService } from 'src/app/service/providerContact.service';
import { ProviderLocationService } from 'src/app/service/providerLocation.service';
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
		AddPurchaseOrdersRoutigModule,
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
		InputMaskModule,
		InputNumberModule,
		CheckboxModule,
		InputSwitchModule,
		TooltipModule

	],
	declarations: [AddPurchaseOrdersComponent],
	providers: [ProviderService,ProviderContactService,ProviderLocationService, MessageService, ConfirmationService]
})
export class AddPurchaseOrdersModule { }
