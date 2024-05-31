import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSupplyComponent } from './list.supply.component';
import { ListSupplyRoutigModule } from './list.supply-routing.module';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ProviderService } from 'src/app/service/provider.service'
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

@NgModule({
	imports: [
		CommonModule,
		ListSupplyRoutigModule,
		TableModule,
		ButtonModule,
		ConfirmDialogModule,
		ToolbarModule,
		DialogModule,
		RippleModule,
		ToastModule,
	],
	declarations: [ListSupplyComponent],
	providers: [ProviderService, MessageService, ConfirmationService]
})
export class ListSupplyModule { }
