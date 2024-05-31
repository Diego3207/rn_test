import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditBranchesComponent } from './edit.branches.component';
import { EditBranchesRoutigModule } from './edit.branches-routing.module';
import { BranchService } from 'src/app/service/branch.service';
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
import { InputSwitchModule } from 'primeng/inputswitch';
import { ImageModule } from 'primeng/image';
import { PasswordModule } from 'primeng/password';

@NgModule({
	imports: [
		CommonModule,
		EditBranchesRoutigModule,
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
		InputSwitchModule,
		ImageModule,
		PasswordModule
		
	],
	declarations: [EditBranchesComponent],
	providers: [BranchService, MessageService, ConfirmationService] 
})
export class EditBranchesModule { }