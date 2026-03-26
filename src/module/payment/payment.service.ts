import { Injectable, BadRequestException } from '@nestjs/common';
import { QRPaymentRequestModel } from './payment.model';
import { BakongService } from '../../core/service/bakong/bakong.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly bakongService: BakongService,
  ) { }

  async createTransaction(input: QRPaymentRequestModel): Promise<any> {
    try {
      const { merchantId, merchantName, accountAddress, currency, amount, acquiringBank } = input as any;

      const qrPayment = await this.bakongService.createTransaction({
        merchantId: merchantId,
        merchantName: merchantName,
        accountNumber: merchantId,
        accountAddress: accountAddress,
        acquiringBank: acquiringBank,
        currency: currency,
        amount: amount,
      });

      if (!qrPayment) {
        return {
          success: false,
          message: 'Failed to create QR transaction',
          data: null,
        };
      }

      // Optionally persist transaction via prismaService here
      return {
        success: true,
        message: 'QR transaction created successfully',
        data: {
          qr_string: qrPayment.qrCodeString,
          base64: qrPayment.qrCodeBase64,
          merchantName,
          merchantId,
          amount: qrPayment.amount || amount,
          currency,
          md5: qrPayment.md5,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Transaction Creation Error:', error);
      return {
        success: false,
        message: 'Failed to create transaction',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async checkTransaction(md5: string, bakongEndpoint: string, bakongToken: string): Promise<any> {
    try {
      if (!md5) throw new BadRequestException('MD5 hash is required');
      
      const result = await this.bakongService.checkTransaction(md5, bakongEndpoint, bakongToken);
      
      if (!result) {
        return {
          success: false,
          message: 'Transaction could not be found. Please check and try again.',
          data: null,
        };
      }
      
      return {
        success: true,
        message: 'Transaction status retrieved successfully',
        data: result,
      };
    } catch (error) {
      console.error('Transaction Check Error:', error);
      return {
        success: false,
        message: 'Failed to check transaction status',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
