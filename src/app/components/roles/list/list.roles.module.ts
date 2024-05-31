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
import {ListRolesComponent } from './list.roles.component';
import { ListRolesRoutigModule } from './list.roles-routing.module';
import { RoleService } from 'src/app/service/role.service'


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
		
		ListRolesRoutigModule, /* --------- */
		
	],
	
	declarations: [ListRolesComponent], /* --------- */
	
	providers: [RoleService, /* --------- */
				MessageService, ConfirmationService]
})
export class ListRolesModule { } /* --------- */