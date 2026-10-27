import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
