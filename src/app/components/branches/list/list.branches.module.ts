import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBranchesComponent } from './list.branches.component';
import { ListBranchesRoutigModule } from './list.branches-routing.module';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { BranchService } from 'src/app/service/branch.service'
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ImageModule } from 'primeng/image';

@NgModule({
	imports: [
		CommonModule,
		ListBranchesRoutigModule,
		TableModule,
		ButtonModule,
		ConfirmDialogModule,
		ToolbarModule,
		DialogModule,
		RippleModule,
		ToastModule,
		ImageModule
	],
	declarations: [ListBranchesComponent],
	providers: [BranchService, MessageService, ConfirmationService]
})
export class ListBranchesModule { }