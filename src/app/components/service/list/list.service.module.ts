import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListServiceComponent } from './list.service.component';
import { ListServiceRoutigModule } from './list.service-routing.module';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ServiceService } from 'src/app/service/service.service';
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
		ListServiceRoutigModule,
		TableModule,
		ButtonModule,
		ConfirmDialogModule,
		ToolbarModule,
		DialogModule,
		RippleModule,
		ToastModule,
		TooltipModule 
	],
	declarations: [ListServiceComponent],
	providers: [ServiceService, MessageService, ConfirmationService]
})
export class ListServiceModule { }
