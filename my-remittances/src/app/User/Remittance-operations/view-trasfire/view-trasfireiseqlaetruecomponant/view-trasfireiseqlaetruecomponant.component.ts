import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TransferService } from '../../trasfireservice.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-view-trasfireiseqlaetruecomponant',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './view-trasfireiseqlaetruecomponant.component.html',
  styleUrl: './view-trasfireiseqlaetruecomponant.component.css'
})
export class ViewTrasfireiseqlaetruecomponantComponent implements OnInit {
  transfers: any[] = [];
  displayedColumns: string[] = ['nameSendingCustomer', 'nameBeneficiaryCustomer', 'amount', 'createdDate', 'createdTime', 'updatedDate', 'updatedTime', 'status', 'transferCode', 'sender', 'receiver'];
  dataSource = new MatTableDataSource(this.transfers);

  constructor(private transferService: TransferService) { }

  ngOnInit(): void {
    const officeId = localStorage.getItem('officeId');
    this.transferService.getReceivedTransfersEqualTrue(officeId).subscribe({
      next: (data) => {
        this.transfers = data;
        this.dataSource.data = this.transfers; // تحديث dataSource بالبيانات الجديدة
      },
      error: (error) => {
        console.error('Error fetching transfers:', error);
      }
    });
  }
  
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>; // ViewChild

  applyFilter(input: HTMLInputElement) {
    const filterValue = input.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
}

  
  
  
