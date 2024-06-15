import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangePricesServiceService {
  constructor(private http: HttpClient) { }

  getExchangeprices$:Observable<Root>= this.http.get<Root>(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_LheFV0KMzWVcd0lXJUIINOJzoF8ACzePhSmuH6SK&currencies=EUR%2CUSD%2CTRY`);
}




export interface Root {
  data: IexchangePrices
}

export interface IexchangePrices {
  EUR: number
  TRY: number
  USD: number
}