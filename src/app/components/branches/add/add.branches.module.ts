import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBranchesComponent } from './add.branches.component';
import { AddBranchesRoutigModule } from './add.branches-routing.module';
import { BranchService } from 'src/app/service/branch.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';

@NgModule({
	imports: [
		CommonModule,
		AddBranchesRoutigModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		MessageModule,
		ReactiveFormsModule,
		TableModule,
	],
	declarations: [AddBranchesComponent],
	providers: [BranchService, MessageService, ConfirmationService] 
})
export class AddBranchesModule { }