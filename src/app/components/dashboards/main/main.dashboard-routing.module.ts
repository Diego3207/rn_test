import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainDashboardComponent } from './main.dasboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MainDashboardComponent }
    ])],
    exports: [RouterModule]
})
export class MainDashboardRoutigModule { }
