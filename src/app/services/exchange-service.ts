import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {

  http = inject(HttpClient);
  httpUrl = 'https://economia.awesomeapi.com.br';

  getExchangeRate(from: string, to: string) {
    return this.http.get(`${this.httpUrl}/last/${from}-${to}`);
  }

  getAllExchangeRates() {
    return this.http.get(`${this.httpUrl}/json/available/uniq`);
  }

  getHistoryExchangeRate(from: string, to: string, days: number) {
    return this.http.get(`${this.httpUrl}/json/daily/${from}-${to}/${days}`);
  }

}