export class QRPaymentRequestModel {
  amount: number;
  currency?: string;
  merchantId?: string;
  merchantName?: string;
  accountAddress?: string; 
  acquiringBank?: string;
}
