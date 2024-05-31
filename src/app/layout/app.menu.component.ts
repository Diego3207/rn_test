import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Dashboards',
                icon: 'pi pi-home',
                items: [
                    { 
                        label: 'Principal', 
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/']
                    },
                ]
            },
			{ separator: true },
            {
                label: 'Súper Administración',
                items: [
                {
                        label: 'Acceso',
                        icon: 'pi pi-fw pi-unlock',
                        items: [
                            {
                                label: 'Sucursales',
                                icon: 'pi pi-fw pi-pencil',
                                routerLink: ['/branches']
                            },
							{
                                label: 'Modulos',
                                icon: 'pi pi-fw pi-pencil',
                                routerLink: ['/modules']
                            },
							{
                                label: 'Roles',
                                icon: 'pi pi-fw pi-pencil',
                                routerLink: ['/roles']
                            },
							{
                                label: 'Usuarios',
                                icon: 'pi pi-fw pi-pencil',
                                routerLink: ['/users']
                            }
                        ]
				}],
			},
            { separator: true },
            //// Administración
            {
                label: 'Administración',
                items: [
                    {
                        label: 'Administración',
                        icon: 'pi pi-fw pi-pencil',
                        items: [
                            {
                                label: 'Proveedores',
                                icon: 'pi pi-shopping-cart',
                                routerLink: ['/providers']
                            },
                            {
                                label: 'Clientes',
                                icon: 'pi pi-users',
                                routerLink: ['/costumers']
                            },
                            {
                                label: 'Cuentas de Banco',
                                icon: 'pi pi-money-bill',
                                routerLink: ['/databanks']
                            },
                            {
                                label: 'Cotizaciones',
                                icon: 'pi pi-dollar',
                                items: [
                                    {
                                        label: 'Para venta',
                                        icon: 'pi pi-angle-right',
                                        routerLink: ['/quotationSales']
                                    },
                                    {
                                        label: 'Para compra',
                                        icon: 'pi pi-angle-right',
                                        routerLink: ['/quotationPurchases']
                                    }
                                ]
                            },
                            {
                                label: 'Ordenes',
                                icon: 'pi pi-file-o',
                                items: [
                                    {
                                        label: 'De venta',
                                        icon: 'pi pi-angle-right',
                                        routerLink: ['/saleOrders']
                                    },
                                    {
                                        label: 'De compra',
                                        icon: 'pi pi-angle-right',
                                        routerLink: ['/orders']
                                    }
                                ]
                            },
                            {
                                label: 'Renovaciones',
                                icon: 'pi pi-calendar',
                                routerLink: ['/renovations']
                            },
                        ]
                    },
                    {
                        label: 'Inventario',
                        icon: 'pi pi-list',
                        items: [
                            {
                                label: 'Inventario',
                                icon: 'pi pi-list',
                                routerLink: ['/supply']
                            },
                            {
                                label: 'Ubicaciones',
                                icon: 'pi pi-map-marker',
                                routerLink: ['/location']
                            },
                            {
                                label: 'Productos',
                                icon: 'pi pi-table',
                                routerLink: ['/product']
                            },
                            {
                                label: 'Servicios',
                                icon: 'pi pi-clone',
                                routerLink: ['/services']
                            },
                            {
                                label: 'Paquetes',
                                icon: 'pi pi-box',
                                routerLink: ['/packages']
                            }
                        ]
                    },
                ],
            },
            ///// Soporte
            { separator: true },
            {
                label: 'Soporte',
                items: [
                    ///Catalogos
                    {
                        label: 'Catálogos',
                        icon: 'pi pi-fw pi-credit-card',
                        items: [
                            {
                                label: 'SIM Cards',
                                icon: 'pi pi-credit-card',
                                routerLink: ['/simCards']
                            },
                            {
                                label: 'Rastreadores',
                                icon: 'pi pi-mobile',
                                routerLink: ['/trackers']
                            },
                        ]
                    },
                    {
                        label: 'Instalaciones',
                        icon: 'pi pi-fw pi-car',
                        items: [
                           {
                                label: 'Vehiculos',
                                icon: 'pi pi-car',
                                routerLink: ['/vehicles']
                           },
                           {
                                label: 'Instalaciones',
                                icon: 'pi pi-microsoft',
                                routerLink: ['/trackerInstallations']
                           },
                           {
                                label: 'Asociaciones ',
                                icon: 'pi pi-verified',
                                routerLink: ['/associations']
                           },
                           {
                                label: 'Revisiones',
                                icon: 'pi pi-book',
                                routerLink: ['/trackerInstallationReviews']
                            },
                            {
                                label: 'Desintalaciones',
                                icon: 'pi pi-qrcode',
                                routerLink: ['/trackerUninstalls']
                            },
                            {
                                label: 'Instaladores',
                                icon: 'pi pi-users',
                                routerLink: ['/installers']
                            }
                        ]
                    },
                    ///
                ]
            },
            { separator: true },
            {
                label: 'Monitoreo',
                items: [
                    {
                        label: 'Operativo',
                        icon: 'pi pi-fw pi-desktop',
                        items: [
                            {
                                label: 'Dispositivos',
                                icon: 'pi pi-mobile',
                                routerLink: ['/monitoringDevices']
                            },
                            {
                                label: 'Tickets',
                                icon: 'pi pi-file-edit',
                                routerLink: ['/tickets']
                            },
                            {
                                label: 'Incidencias',
                                icon: 'pi pi-exclamation-triangle',
                                routerLink: ['/incidences']
                            },
                            {
                                label: 'Directorio',
                                icon: 'pi pi-book',
                                routerLink: ['/directory']
                            },
                        ]
                    },
                    {
                        label: 'Administrativo',
                        icon: 'pi pi-fw pi-file-o',
                        items: [
                            ////
                        ]
                    },
                    ///
                ]
            },
        ];
    }
}
