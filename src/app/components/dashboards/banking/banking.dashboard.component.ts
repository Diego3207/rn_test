import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

interface MonthlyPayment {
    name?: string;
    amount?: number;
    paid?: boolean;
    date?: string;
}

@Component({
    templateUrl: './banking.dashboard.component.html'
})
export class BankingDashboardComponent implements OnInit, OnDestroy {

    metrics: any = [];

    transactions: any = [];

    expenses: any = [];

    barData: any;

    barOptions: any;

    subscription!: Subscription;

    items: MenuItem[] = [];

    constructor(private layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(config => {
            this.initChart();
         });
    }

    ngOnInit() {
        this.metrics = [
            {
                title: 'Main Account',
                profit: '+8%',
                description: 'vs last week',
                image: 'banking-1',
            },
            {
                title: 'Investment Account',
                profit: '+8%',
                description: 'vs last week',
                image: 'banking-2',
            },
            {
                title: 'Expenses Account',
                profit: '+8%',
                description: 'vs last week',
                image: 'banking-3',
            },
        ];

        this.transactions = [
            {
                title: 'Apple iCloud Subscription',
                date: '12 Aug, 19:18',
                badge: 'Entertainment',
                received: false,
                amount: '-$25.00',
                icon: 'pi pi-apple'
            },
            {
                title: 'Car Insurance',
                date: '11 Aug, 15:50',
                badge: 'Personal',
                received: false,
                amount: '-$350.00',
                icon: 'pi pi-car'
            },
            {
                title: 'Money Transfer',
                date: '11 Aug, 07:02',
                badge: 'Transfer',
                received: true,
                amount: '+$900.00',
                icon: 'pi pi-money-bill'
            },
            {
                title: 'Credit Card Payment',
                date: '9 Aug, 21:33',
                badge: 'Personal',
                received: false,
                amount: '-$3558.70',
                icon: 'pi pi-credit-card'
            },
            {
                title: 'Divident Payment',
                date: '8 Aug, 17:51',
                badge: 'Investment',
                received: true,
                amount: '+$105.90',
                icon: 'pi pi-microsoft'
            },
        ];

        this.expenses = [
            {
                image: 'banking-4',
                title: 'Food',
                value: '79',
                amount: '$702.00',
                background: 'linear-gradient(-120deg, rgba(77, 182, 172, 1), rgba(77, 182, 172, 0.3) 70%)'
            },
            {
                image: 'banking-5',
                title: 'Electronics',
                value: '62',
                amount: '$421.60',
                background: 'linear-gradient(-120deg, rgba(77, 182, 172, 1), rgba(77, 182, 172, 0.3) 70%)'
            },
            {
                image: 'banking-6',
                title: 'Utilities',
                value: '45',
                amount: '$388.51',
                background: 'linear-gradient(-120deg, rgba(250, 183, 16, 1), rgba(250, 183, 16, 0.3) 70%)'
            },
            {
                image: 'banking-7',
                title: 'Clothing',
                value: '41',
                amount: '$295.72',
                background: 'linear-gradient(-120deg, rgba(250, 183, 16, 1), rgba(250, 183, 16, 0.3) 70%)'
            },
            {
                image: 'banking-8',
                title: 'Travel',
                value: '35',
                amount: '$170.05',
                background: 'linear-gradient(-120deg, rgba(198, 55, 55, 1), rgba(198, 55, 55, 0.3) 70%)'
            },
            {
                image: 'banking-9',
                title: 'Subscriptions',
                value: '23',
                amount: '$96.80',
                background: 'linear-gradient(-120deg, rgba(198, 55, 55, 1), rgba(198, 55, 55, 0.3) 70%)'
            },
        ];

        this.items = [
            {
                label: 'View Details'
            },
            {
                label: 'Print Receipt'
            },
            {
                label: 'Hide'
            }
        ];

        this.initChart();
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        
        this.barData = {
            labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'],
            datasets: [
                {
                    label: 'Revenue',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    barThickness: 12,
                    borderRadius: 12,
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'Expenses',
                    backgroundColor: '#FAB918',
                    barThickness: 12,
                    borderRadius: 12,
                    data: [35, 19, 40, 61, 16, 55, 30]
                }
            ]
        };

        this.barOptions = {

            animation: {
                duration: 0
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: {
                            weight: 700,
                        },
                        padding: 28
                    },
                    position: 'top',
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        callback(value: number) {
                            return '$' + value + 'k';
                        },
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    show(el: HTMLElement) {
        el.classList.remove('hidden');
        el.classList.add('fadeindown');
    }

    hide(el: HTMLElement) {
        el.classList.add('hidden');
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
