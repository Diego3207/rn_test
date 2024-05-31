import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ImageModule } from 'primeng/image';

/* --------- */
import {ListModulesComponent } from './list.modules.component';
import { ListModulesRoutigModule } from './list.modules-routing.module';
import { ModuleService } from 'src/app/service/module.service'


@NgModule({
	imports: [
		CommonModule,
		TableModule,
		ButtonModule,
		ConfirmDialogModule,
		ToolbarModule,
		DialogModule,
		RippleModule,
		ToastModule,
		ImageModule,
		
		ListModulesRoutigModule, /* --------- */
		
	],
	
	declarations: [ListModulesComponent], /* --------- */
	
	providers: [ModuleService, /* --------- */
				MessageService, ConfirmationService]
})
export class ListModulesModule { } /* --------- */