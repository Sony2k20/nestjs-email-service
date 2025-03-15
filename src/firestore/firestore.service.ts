import { Injectable, Inject } from '@nestjs/common';
import * as Firestore from '@google-cloud/firestore';

@Injectable()
export class FirestoreService {
  constructor(
    @Inject('FIRESTORE') private readonly firestore: Firestore.Firestore,
  ) {}

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
