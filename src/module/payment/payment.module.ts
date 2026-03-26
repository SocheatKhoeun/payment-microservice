import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { BakongService } from '../../core/service/bakong/bakong.service';

@Module({
  imports: [HttpModule],
  providers: [PaymentService, BakongService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
