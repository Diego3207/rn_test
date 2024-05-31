import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDependencyComponent } from './list.dependency.component';
import { ListDependencyRoutigModule } from './list.dependency-routing.module';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DependencyService } from 'src/app/service/dependency.service';
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
		ListDependencyRoutigModule,
		TableModule,
		ButtonModule,
		ConfirmDialogModule,
		ToolbarModule,
		DialogModule,
		RippleModule,
		ToastModule,
		TooltipModule
	],
	declarations: [ListDependencyComponent],
	providers: [DependencyService, MessageService, ConfirmationService]
})
export class ListDependencyModule { }
