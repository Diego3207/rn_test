import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordRoutingModule } from './forgotpassword-routing.module';
import { ForgotPasswordComponent } from './forgotpassword.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        ForgotPasswordRoutingModule,
        AppConfigModule,
        FormsModule, //permite binding,
        MessageModule, //mensajes de error junto a componentes
    ],
    declarations: [ForgotPasswordComponent]
})
export class ForgotPasswordModule { }
