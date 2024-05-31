import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import {AuthGuard} from "./guard/auth.guard";

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = 
[ 
    {
        path: '', component: AppLayoutComponent, canActivateChild : [AuthGuard],
        children: [
            { path: '', loadChildren: () => import('./components/dashboards/dashboards.module').then(m => m.DashboardsModule), data:{ module: 'dashboards' } },
			{ path: 'a', loadChildren: () => import('./components/a/a.module').then(m => m.AModule), data:{ module: 'a' } },
			{ path: 'users', loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule), data:{ module: 'users' } },
			{ path: 'branches', loadChildren: () => import('./components/branches/branches.module').then(m => m.BranchesModule), data:{ module: 'branches' } },			
			{ path: 'providers', loadChildren: () => import('./components/providers/provider.module').then(m => m.ProviderModule), data:{ module: 'provider' } },
            { path: 'costumers', loadChildren: () => import('./components/costumers/costumer.module').then(m => m.CostumerModule), data:{ module: 'costumer' } },
            { path: 'databanks', loadChildren: () => import('./components/databanks/databank.module').then(m => m.DataBankModule), data:{ module: 'databank' } },
            { path: 'services', loadChildren: () => import('./components/service/service.module').then(m => m.ServiceModule), data:{ module: 'service' } },
            { path: 'product', loadChildren: () => import('./components/product/product.module').then(m => m.ProductModule), data:{ module: 'product' } },
            { path: 'location', loadChildren: () => import('./components/location/location.module').then(m => m.LocationModule), data:{ module: 'location' } },
           // { path: 'quotations', loadChildren: () => import('./components/quotations/quotations.module').then(m => m.QuotationsModule), data:{ module: 'quotations' } },
            { path: 'supply', loadChildren: () => import('./components/supply/supply.module').then(m => m.SupplyModule), data:{ module: 'supply' } },
			{ path: 'modules', loadChildren: () => import('./components/modules/modules.module').then(m => m.ModulesModule), data:{ module: 'modules' } },
			{ path: 'roles', loadChildren: () => import('./components/roles/roles.module').then(m => m.RolesModule), data:{ module: 'roles' } },
            { path: 'orders', loadChildren: () => import('./components/purchaseOrders/purchaseOrders.module').then(m => m.PurchaseOrdersModule), data:{ module: 'purchaseOrders' } },
            { path: 'simCards', loadChildren: () => import('./components/simCards/simCards.module').then(m => m.simCardsModule), data:{ module: 'simCards' } },
            { path: 'saleOrders', loadChildren: () => import('./components/saleOrders/saleOrder.module').then(m => m.SaleOrdersModule), data:{ module: 'saleOrders' } },
            { path: 'packages', loadChildren: () => import('./components/packages/packages.module').then(m => m.PackageModule), data:{ module: 'package' } },
            { path: 'quotationPurchases', loadChildren: () => import('./components/quotationPurchases/quotationPurchases.module').then(m => m.QuotationPurchasesModule), data:{ module: 'quotationPurchases' } },
            { path: 'quotationSales', loadChildren: () => import('./components/quotationSales/quotationSales.module').then(m => m.QuotationSalesModule), data:{ module: 'quotationSales' } },
            { path: 'trackers', loadChildren: () => import('./components/trackers/tracker.module').then(m => m.TrackerModule), data:{ module: 'trackers' } },
            { path: 'vehicles', loadChildren: () => import('./components/vehicles/vehicle.module').then(m => m.VehicleModule), data:{ module: 'vehicles' } },
            { path: 'installers', loadChildren: () => import('./components/installers/installer.module').then(m => m.InstallerModule), data:{ module: 'installers' } },
            { path: 'trackerInstallations', loadChildren: () => import('./components/trackerInstallations/trackerInstallation.module').then(m => m.TrackerInstallationModule), data:{ module: 'trackerInstallations' } },
            { path: 'monitoringDevices', loadChildren: () => import('./components/monitoringDevices/monitoringDevices.module').then(m => m.MonitoringDeviceModule), data:{ module: 'monitoringDevices' } },
            { path: 'tickets', loadChildren: () => import('./components/tickets/tickets.module').then(m => m.TicketModule), data:{ module: 'tickets' } },
            { path: 'directory', loadChildren: () => import('./components/dependencies/dependency.module').then(m => m.DependencyModule), data:{ module: 'directory' } },
            { path: 'incidences', loadChildren: () => import('./components/incidences/incidence.module').then(m => m.IncidenceModule), data:{ module: 'incidences' } },
            { path: 'renovations', loadChildren: () => import('./components/renovations/renovation.module').then(m => m.RenovationModule), data:{ module: 'renovations' } },
            { path: 'associations', loadChildren: () => import('./components/associations/association.module').then(m => m.AssociationModule), data:{ module: 'associations' } },
            { path: 'trackerUninstalls', loadChildren: () => import('./components/trackerUninstalls/trackerUninstall.module').then(m => m.TrackerUninstallModule), data:{ module: 'trackerUninstalls' } },
            { path: 'trackerInstallationReviews', loadChildren: () => import('./components/trackerInstallationReviews/trackerInstallationReview.module').then(m => m.TrackerInstallationReviewModule), data:{ module: 'trackerInstallationReviews' } },

        ]

    },
		
    { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'notfound', loadChildren: () => import('./components/notfound/notfound.module').then(m => m.NotfoundModule) },
	{ path: 'error', loadChildren: () => import('./components/error/error.module').then(m => m.ErrorModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule
({
    imports: [RouterModule.forRoot(routes, routerOptions)], //It enables an Angular module to use functionality that was defined in another Angular module
    exports: [RouterModule], //It enables an Angular module to expose some of its components
//	providers:[AuthGuard], //guard para control de acceso
})

export class AppRoutingModule { }
