import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';

const { BakongKHQR, MerchantInfo } = require('bakong-khqr');

export interface BakongQRData {
  merchantId: string;
  merchantName: string;
  accountNumber: string;
  accountAddress: string;
  acquiringBank: string;
  currency?: string;
  amount?: number;
  city?: string;
}

export interface BakongQRResponse {
  qrCodeString: string;
  qrCodeBase64: string;
  accountName: string;
  amount?: number;
  md5?: string;
}

@Injectable()
export class BakongService {
  constructor(
    private readonly httpService: HttpService,
  ) { }

  async createTransaction(data: BakongQRData): Promise<BakongQRResponse> {
    if (!data.merchantId || !data.merchantName || !data.accountNumber) {
      throw new BadRequestException('Merchant ID, Name, and Account Number are required');
    }

    try {
      const optionalData: any = {
        currency: data.currency?.toUpperCase() === 'USD' ? 840 : 116,
        accountInformation: data.accountNumber,
        merchantCategoryCode: '5999',
        acquiringBank: data.acquiringBank,
        ...(data.amount && {
          amount: data.amount,
          expirationTimestamp: Date.now() + (10 * 60 * 1000),
        }),
      };

      const response = new BakongKHQR().generateMerchant(
        new MerchantInfo(
          data.merchantId,
          data.merchantName,
          data.accountAddress || data.city || 'Phnom Penh',
          168168168,
          data.acquiringBank,
          optionalData,
        ),
      );

      if (!response?.data) {
        throw new Error('Failed to generate QR code');
      }

      const qrData = response.data;
      const qrString = typeof qrData === 'string' ? qrData : (qrData?.qr || qrData?.qrString);

      return {
        qrCodeString: qrString,
        qrCodeBase64: Buffer.from(qrString).toString('base64'),
        accountName: data.merchantName,
        amount: data.amount,
        md5: qrData.md5,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'QR code generation failed',
      );
    }
  }

  async checkTransaction(md5: string, bakongEndpoint: string, bakongToken: string): Promise<any | null> {
    let transaction: any;

    // console.log('Checking transaction with MD5:', md5);
    // console.log('Using Bakong Endpoint:', bakongEndpoint);
    // console.log('Using Bakong Token:', bakongToken );

    try {
      transaction = await lastValueFrom(
        this.httpService.post(
          bakongEndpoint + '/check_transaction_by_md5',
          { md5 },
          {
            headers: {
              Authorization: 'Bearer ' + bakongToken,
              Origin: "https://api-bakong.nbc.gov.kh",
              Referer: "https://api-bakong.nbc.gov.kh/",
              "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
            },
          },
        ),
      );
    } catch (error) {
      if (error instanceof AxiosError) {
      }

      throw new InternalServerErrorException([error]);
    }

    return transaction?.data?.data;
  }
}

