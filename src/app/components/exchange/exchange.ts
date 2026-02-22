import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExchangeService } from '../../services/exchange-service';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-exchange',
  imports: [FormsModule, NgApexchartsModule],
  templateUrl: './exchange.html',
  styleUrl: './exchange.css',
})
export class Exchange {

  coins = [
    { id: 1, name: 'USD', value: 'USD' },
    { id: 2, name: 'EUR', value: 'EUR' },
    { id: 3, name: 'GBP', value: 'GBP' },
    { id: 4, name: 'JPY', value: 'JPY' },
    { id: 5, name: 'AUD', value: 'AUD' },
    { id: 6,  name: 'CAD', value: 'CAD' },
    { id: 7, name: 'CHF', value: 'CHF' },
    { id: 8, name: 'CNY', value: 'CNY' },
    { id: 9, name: 'SEK', value: 'SEK' },
    { id: 10, name: 'NZD', value: 'NZD' },
    { id: 11, name: 'BRL', value: 'BRL' }
  ];
  exchangeCoins = signal<any[]>([]);
  selectedFrom = signal('');
  selectedTo = signal('');
  finalValue = signal('');
  pairFound = signal(true);

  chartOptions = {
    chart: {
      type: 'area' as const
    },
    stroke: {
      curve: 'smooth' as const
    },
    colors: ['#33ff66'],
    fill: {
      type: 'gradient'
    },
    tooltip: {
        theme: 'dark',
        style: {
          fontSize: '12px'
        },
        x: {
          show: true,
          format: 'dd MMM'
        }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#FFFFFF',
          fontSize: '12px'
        }
      }
    }
  };

  chartPrices = signal<number[]>([]);
  chartDates = signal<string[]>([]);

  readonly series = computed(() => [
    {
      name: "Cotation",
      data: this.chartPrices()
    }
  ]);

  readonly xAxis = computed(() => ({
    categories: this.chartDates(),
    labels: {
      style: {
        colors: '#FFFFFF',
        fontSize: '12px'
      }
    }
  }));

  comparisonValue = signal('');
  iconArrow = signal('');
  iconArrowEurUsd = signal('');
  

  constructor(private exchangeService: ExchangeService) {}

  ngOnInit() {
    this.returnAllExchangeRates();

    this.selectedFrom.set('EUR');
    this.selectedTo.set('BRL');
    this.returnExchangeRange();
    this.eurToUsd();

    this.returnHistoryExchangeRate();

  }

  returnExchangeRange(){
    if (this.selectedFrom() && this.selectedTo()) {
      this.exchangeService.getExchangeRate(this.selectedFrom(), this.selectedTo())
        .subscribe({
          next: (data: any) => {
            const pair = `${this.selectedFrom()}${this.selectedTo()}`;
            
            if (data && data[pair]) {
              this.finalValue.set(data[pair].bid);
              this.pairFound.set(true);
            } else {
              this.finalValue.set('Exchange rate not available');
              this.pairFound.set(false);
            }

            if (parseFloat(this.finalValue()) < 1) {
              this.iconArrow.set('arrow_downward.png');
            } else {
              this.iconArrow.set('arrow_upward.png');
            }
          },
          error: (err) => {
            console.error('error:', err);
            this.finalValue.set('Exchange rate not available');
            this.pairFound.set(false);
          }
        });
    }
  }
  

  returnAllExchangeRates() {
    const response = this.exchangeService.getAllExchangeRates();
    response.subscribe((data: any) => {
      const response = Object.keys(data);
      this.exchangeCoins.set(response);
    });
  }

  returnHistoryExchangeRate() {
    if(this.selectedFrom() && this.selectedTo()) {
      this.exchangeService.getHistoryExchangeRate(this.selectedFrom(), this.selectedTo(), 7)
        .subscribe({
          next: (data: any) => {
                const prices = data.map((item: any) => parseFloat(item.bid)).reverse();
                const dates = data.map((item: any) => item.timestamp).reverse();
                const formattedDates = dates.map((timestamp: number) => {
                const date = new Date(timestamp * 1000);
                return `${date.getDate()}/${date.getMonth() + 1}`;

              });

              this.chartPrices.set(prices);
              this.chartDates.set(formattedDates);

          },
          error: (err) => {
            console.error('Error fetching history:', err);
          }
        });
    }
  }

  eurToUsd(){
      this.exchangeService.getExchangeRate('EUR', 'USD')
        .subscribe({
          next: (data: any) => {
            const pair = `EURUSD`;
              this.comparisonValue.set(data[pair].bid);

              if (parseFloat(this.comparisonValue()) < 1) {
                console.log('EUR is stronger than USD');
                this.iconArrowEurUsd.set('arrow_downward.png');
              } else {
                this.iconArrowEurUsd.set('arrow_upward.png');
              }
          },
          error: (err) => {
            console.error('Error fetching EUR/USD rate:', err);
          }
        });
  }

}
