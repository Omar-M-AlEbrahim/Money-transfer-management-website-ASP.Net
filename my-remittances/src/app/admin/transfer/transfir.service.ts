import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransfirService {

  constructor(private http: HttpClient) { }

  transferes$=this.http.get<ITransfir[]>(`http://localhost:5184/api/Transfer/all`);

  ///مالها علاقة بالموضوع جلب عدد التحويلات في  الاسبوع 

  getTransferCountPerDayLastWeek(): Observable<Idate[]> {
    return this.http.get<Idate[]>(`http://localhost:5184/api/Transfer/transferCountPerDayLastWeek
    `);
  }
}






export interface Idate {
  date: string
  count: number
}

export interface ISender {
  officeId: string
  name: string
  country: string
  governorate: string
  city: string
  currentBalance: number
  user: any
  userId: string
  sentTransfers: any[]
  receivedTransfers: any[]
}

export interface IReceiver {
  officeId: string
  name: string
  country: string
  governorate: string
  city: string
  currentBalance: number
  user: any
  userId: string
  sentTransfers: any[]
  receivedTransfers: any[]
}
export interface ITransfir {
  transferId: string
  amount: number
  transferDate: string
  status: boolean
  transferCode: string
  senderId: string
  sender: ISender
  receiverId: string
  receiver: IReceiver
  createdAt: string
  updatedAt: string
}