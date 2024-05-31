import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListIncidenceComponent } from './list.incidence.component';
import { ListIncidenceRoutigModule } from './list.incidence-routing.module';
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
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip'; 


@NgModule({
	imports: [
		CommonModule,
		ListIncidenceRoutigModule,
		TableModule,
		ButtonModule,
		ConfirmDialogModule,
		ToolbarModule,
		DialogModule,
		RippleModule,
		ToastModule,
		TagModule,
		TooltipModule
	],
	declarations: [ListIncidenceComponent],
	providers: [ProviderService, MessageService, ConfirmationService]
})
export class ListIncidenceModule { }
