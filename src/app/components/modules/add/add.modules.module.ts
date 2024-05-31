import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';

import { AddModulesComponent } from './add.modules.component';
import { AddModulesRoutigModule } from './add.modules-routing.module';
import { ModuleService } from 'src/app/service/module.service';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		MessageModule,
		ReactiveFormsModule,
		TableModule,
		AddModulesRoutigModule,
	],
	declarations: [AddModulesComponent],
	providers: [ModuleService, MessageService, ConfirmationService] 
})
export class AddModulesModule { }