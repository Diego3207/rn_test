import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
//import { PasswordModule } from 'primeng/password';

@NgModule({
    imports: [
        CommonModule,
        RegisterRoutingModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
		//PasswordModule, p-pass con retoalimentacion
        CheckboxModule,
        AppConfigModule,
		ToastModule, //toast
		MessageModule, //mensajes de error junto a componentes
		FormsModule, //permite binding
		DialogModule,
    ],
    declarations: [RegisterComponent]
})
export class RegisterModule { }
