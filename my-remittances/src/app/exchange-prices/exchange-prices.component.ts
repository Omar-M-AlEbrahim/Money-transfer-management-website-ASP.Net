import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ExchangePricesServiceService, IexchangePrices } from './exchange-prices-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exchange-prices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exchange-prices.component.html',
  styleUrl: './exchange-prices.component.css'
})


export class ExchangePricesComponent implements OnInit {
  data$: IexchangePrices;
  hoveredRow: number = -1; // تعريف الخاصية وتهيئتها بقيمة افتراضية
  constructor(private exchangePricesService: ExchangePricesServiceService) {}

  ngOnInit(): void {
    this.exchangePricesService.getExchangeprices$.subscribe(
      (data ) =>
         {
        this.data$ = data.data;
      }
    );
  }
}
