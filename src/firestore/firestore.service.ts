import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { join } from 'path';

@Injectable()
export class FirestoreService {
  private firestore: admin.firestore.Firestore;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          join(
            __dirname,
            '..',
            '..',
            'service-account-firestore.json',
          ) as admin.ServiceAccount,
        ),
      });
    }
    this.firestore = admin.firestore();
  }

  getFirestore(): admin.firestore.Firestore {
    return this.firestore;
  }

  async getAllDocuments(collectionName: string): Promise<any[]> {
    const snapshot = await this.firestore.collection(collectionName).get();
    const documents = [];
    snapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  }

  async addDocument(collectionName: string, documentName: string, data: any) {
    const docRef = this.firestore.collection(collectionName).doc(documentName);
    await docRef.set(data);
    return { id: documentName, ...data };
  }

  async documentExists(
    collectionName: string,
    documentName: string,
  ): Promise<boolean> {
    const docRef = this.firestore.collection(collectionName).doc(documentName);
    const doc = await docRef.get();
    return doc.exists;
  }
}
