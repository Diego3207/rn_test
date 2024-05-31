import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild
	([
        { path: '', data: {breadcrumb: 'Revisiones'}, loadChildren: () => import('./list/list.trackerInstallationReview.module').then(m => m.ListTrackerInstallationReviewModule) },
        { path: 'edit/:idx', data: {breadcrumb: 'Editar Revisión'}, loadChildren: () => import('./edit/edit.trackerInstallationReview.module').then(m => m.EditTrackerInstallationReviewModule) },
        { path: 'add/:idx', data: {breadcrumb: 'Nueva Revisión'}, loadChildren: () => import('./add/add.trackerInstallationReview.module').then(m => m.AddTrackerInstallationReviewModule) },
    ])],
    exports: [RouterModule]
})
export class TrackerInstallationReviewRoutingModule { }