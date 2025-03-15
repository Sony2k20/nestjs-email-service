import { ConfigService } from '@nestjs/config';
import * as Firestore from '@google-cloud/firestore';

export const firestoreProvider = {
  provide: 'FIRESTORE',
  useFactory: (configService: ConfigService) => {
    const firestore = new Firestore.Firestore({
      projectId: configService.get<string>('FIRESTORE_PROJECT_ID'),
      keyFilename: configService.get<string>('FIRESTORE_KEY_FILE'),
    });
    return firestore;
  },
  inject: [ConfigService],
};
