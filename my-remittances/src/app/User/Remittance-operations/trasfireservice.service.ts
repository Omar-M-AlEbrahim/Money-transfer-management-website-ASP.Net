import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ioffice } from '../../admin/office-manager/servece.service';

@Injectable({
  providedIn: 'root'
})
export class TransferService {  
  constructor(private http: HttpClient) {}
  offices$=this.http.get<Ioffice[]>(`http://localhost:5184/api/Office/offices`);

  createTransfer(transferData: any): Observable<any> {
    return this.http.post<any>(`http://localhost:5184/api/Transfer/create`, transferData);
  }

  getAllTransfers(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5184/api/Transfer/all`);
  }

  getTransfersBySender(senderId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5184/api/Transfer/getTransfersBySender/${senderId}`);
  }

  deleteTransfer(transferId: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:5184/api/Transfer/delete/${transferId}`);
  }

  getReceivedTransfers(officeId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5184/api/Transfer/receivedTransfers/${officeId}`);
  }

  receiveTransfer(receiveModel: any): Observable<any> {
    return this.http.post(`http://localhost:5184/api/Transfer/receive`, receiveModel);
  }

  getReceivedTransfersEqualTrue(officeId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:5184/api/Transfer/receivedTransfersEqualTrue/${officeId}`);
  }
}
 