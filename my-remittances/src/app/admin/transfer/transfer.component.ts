import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ITransfir, TransfirService } from '../transfer/transfir.service';
import { IexchangePrices } from '../../exchange-prices/exchange-prices-service.service';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatInputModule
  ],

  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent implements OnInit {
  data$: ITransfir[] = [];
  filteredData$: ITransfir[] = [];
  filterDelivered: boolean = false;  
  filterUndelivered: boolean = false;  
  searchText: string = ''; 

  displayedColumns: string[] = ['amount', 'status', 'createdDate', 'createdTime', 'updatedDate', 'updatedTime', 'senderName', 'receiverName'];

  constructor(private transferService: TransfirService) {}

  ngOnInit(): void {
    this.transferService.transferes$.subscribe(data => {
      this.data$ = data;
      this.data$ = data;
      this.filteredData$ = data; 
    });
  }

  applyFilter() {
    if (this.filterDelivered && this.filterUndelivered) {
      this.filteredData$ = this.data$; // عرض كل العناصر
    } else if (this.filterDelivered) {
      this.filteredData$ = this.data$.filter(item => item.status); // عرض العناصر المستلمة
    } else if (this.filterUndelivered) {
      this.filteredData$ = this.data$.filter(item => !item.status); // عرض العناصر غير المستلمة
    } else {
      this.filteredData$ = this.data$; // عرض كل العناصر
    }
    
  }
}  
