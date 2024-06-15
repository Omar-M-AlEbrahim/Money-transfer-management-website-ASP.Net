import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransferService } from '../../trasfireservice.service';
import { Ioffice } from '../../../../admin/office-manager/servece.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { takeUntil, switchMap, tap, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-send-trasfire',
  standalone: true,
  imports: [
    MatCheckboxModule ,
    MatIconModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './send-trasfire.component.html',
  styleUrls: ['./send-trasfire.component.css']
})
export class SendTrasfireComponent implements OnInit, OnDestroy {
  offices: Ioffice[] = [];
  private transfersSubject = new BehaviorSubject<any[]>([]);
  displayedColumns: string[] = ['nameSendingCustomer', 'nameBeneficiaryCustomer', 'amount','createdDate', 'createdTime', 'updatedDate', 'updatedTime', 'sender', 'receiver', 'status', 'transferCode'];
  transfers$ = this.transfersSubject.asObservable();
  newTransferCode: string | null = null;
  private destroy$ = new Subject<void>();
  loading = false;
  showPendingOnly = false;


  searchTerm = ''; // إضافة searchTerm هنا

  constructor(
    private transferService: TransferService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const senderId = localStorage.getItem('officeId');

    this.transferService.offices$.pipe(takeUntil(this.destroy$)).subscribe(offices => {
      this.offices = offices.filter(office => office.officeId !== senderId);
    });

    this.loading = true;
    this.transferService.getTransfersBySender(senderId).pipe(
      takeUntil(this.destroy$),
      tap(() => this.loading = false)
    ).subscribe({
      next: (data) => {
        this.transfersSubject.next(data);
      },
      error: (error) => {
        console.error('Error fetching transfers:', error);
        this.loading = false;
      }
    });
  }

  sendTransfer(form: NgForm) {
    if (form.valid) {
      const senderId = localStorage.getItem('officeId');
      const transferData = {
        amount: form.value.amount,
        senderId: senderId,
        receiverId: form.value.receiverOfficeId,
        nameSendingCustomer: form.value.nameSendingCustomer,
        nameBeneficiaryCustomer: form.value.nameBeneficiaryCustomer
      };

      this.loading = true;
      this.transferService.createTransfer(transferData).pipe(
        takeUntil(this.destroy$),
        switchMap((response) => {
          this.newTransferCode = response.transferCode;
          return this.transferService.getTransfersBySender(senderId);
        }),
        tap(() => this.loading = false)
      ).subscribe({
        next: (updatedTransfers) => {
          this.transfersSubject.next(updatedTransfers);
          form.resetForm();
          this._snackBar.open('Transfer created successfully.', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error creating transfer:', error);
          this.loading = false;
          this._snackBar.open('Error creating transfer. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }


  filterTransfers() {
    const senderId = localStorage.getItem('officeId');
    this.transferService.getTransfersBySender(senderId).pipe(
      takeUntil(this.destroy$),
      map(transfers => {
        return transfers.filter(transfer =>
          (!this.searchTerm || 
            transfer.nameSendingCustomer.includes(this.searchTerm) ||
            transfer.nameBeneficiaryCustomer.includes(this.searchTerm) ||
            transfer.receiver.name.includes(this.searchTerm))
        );
      })
    ).subscribe(filteredTransfers => {
      this.transfersSubject.next(filteredTransfers);
    });
  }
  updateTransfers() {
    const senderId = localStorage.getItem('officeId');
    this.transferService.getTransfersBySender(senderId).pipe(
      takeUntil(this.destroy$),
      map(transfers => {
        return transfers.filter(transfer => {
          if (this.showPendingOnly) {
            return (!transfer.status || transfer.status === 'Pending');
          } else {
            return true;
          }
        });
      })
    ).subscribe(filteredTransfers => {
      this.transfersSubject.next(filteredTransfers);
    });
  }
  
  toggleShowPending() {
    this.showPendingOnly = !this.showPendingOnly;
    this.updateTransfers();
  }
    

 ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}

}
