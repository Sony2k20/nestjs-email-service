import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { FirestoreModule } from 'src/firestore/firestore.module';

@Module({
  imports: [FirestoreModule],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
