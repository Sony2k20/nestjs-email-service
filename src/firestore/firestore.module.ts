import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { firestoreProvider } from './firestore.config';
import { FirestoreService } from './firestore.service';

@Module({
  imports: [ConfigModule],
  providers: [firestoreProvider, FirestoreService],
  exports: [firestoreProvider, FirestoreService],
})
export class FirestoreModule {}
