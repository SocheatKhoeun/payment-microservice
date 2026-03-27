import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { QRPaymentRequestModel } from './payment.model';

@ApiTags('Payments')
@Controller('v1/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('transaction')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create transaction' })
  @ApiBody({ schema: { example: { merchantId: '123456789', merchantName: 'My Store', accountAddress: 'Phnom Penh', acquiringBank: 'Acquiring Bank Name', currency: 'KHR', amount: 1000 } } })
  @ApiResponse({ status: 200, description: 'Transaction created successfully' })
  async createTransaction(@Body() input: QRPaymentRequestModel, @Request() req): Promise<any> {
    return await this.paymentService.createTransaction(input);
  }

  @Post('transaction/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check Transaction Status by MD5' })
  @ApiBody({ schema: { example: { md5: 'fb841aeba296ec19cefaf72392d5527a', bakongEndpoint: 'domain', bakongToken: 'qwerty' } } })
  @ApiResponse({
    status: 200,
    description: 'Transaction status retrieved successfully',
  })
  async checkTransactionStatus(@Body() body: { md5: string, bakongEndpoint: string, bakongToken: string }, @Request() req): Promise<any> {
    return await this.paymentService.checkTransaction(body.md5, body.bakongEndpoint, body.bakongToken);
  }
}
