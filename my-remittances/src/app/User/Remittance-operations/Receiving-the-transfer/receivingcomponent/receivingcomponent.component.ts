import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransferService } from '../../trasfireservice.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receivingcomponent',
  standalone: true,
  imports: [
    CommonModule ,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './receivingcomponent.component.html',
  styleUrl: './receivingcomponent.component.css'
})
export class ReceivingcomponentComponent implements OnInit, OnDestroy {
  transfers: any[] = [];
  displayedColumns: string[] = ['nameSendingCustomer', 'nameBeneficiaryCustomer', 'amount','createdDate', 'createdTime', 'sender', 'receiver', 'transferCode', 'actions'];
  private transfersSubject = new BehaviorSubject<any[]>([]);
  transfers$ = this.transfersSubject.asObservable();
  private destroy$ = new Subject<void>();
  loading = false;

  constructor(
    private transferService: TransferService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    const officeId = localStorage.getItem('officeId');
    if (officeId) {
      this.loadReceivedTransfers(officeId);
    } else {
      console.error('No office ID found in local storage.');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReceivedTransfers(officeId: string) {
    this.transferService.getReceivedTransfers(officeId).subscribe({
      next: (data) => {
        this.transfers = data.map(transfer => ({ ...transfer, transferCode: '' }));
        this.transfersSubject.next(this.transfers);
      },
      error: (error) => {
        console.error('Error fetching received transfers:', error);
      }
    });
  }

  receiveTransfer(transferId: string) {
    const transfer = this.transfers.find(t => t.transferId === transferId);
    if (!transfer.transferCode) {
      this._snackBar.open('Please enter the transfer code.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const receiveModel = {
      transferId: transferId,
      transferCode: transfer.transferCode
    };

    this.transferService.receiveTransfer(receiveModel).subscribe({
      next: (response) => {
        this._snackBar.open('Transfer received successfully.', 'Close', {
          duration: 3000,
        });
        this.loadReceivedTransfers(localStorage.getItem('officeId')!);
      },
      error: (error) => {
        console.error('Error receiving transfer:', error);
        this._snackBar.open('Error receiving transfer. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    });
  }
  
  deleteTransfer(transferId: string) {
    if (confirm('Are you sure you want to delete this transfer?')) {
      this.loading = true;
      this.transferService.deleteTransfer(transferId).pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.transferService.getReceivedTransfers(localStorage.getItem('officeId')!)),
        tap((updatedTransfers) => {
          this.transfers = updatedTransfers.map(transfer => ({ ...transfer, transferCode: '' }));
          this.transfersSubject.next(this.transfers);
          this.loading = false;
        })
      ).subscribe({
        next: () => {
          this._snackBar.open('Transfer deleted successfully.', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting transfer:', error);
          this.loading = false;
          this._snackBar.open('Error deleting transfer. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }
}