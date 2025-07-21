import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Training {
  title: string;
  description: string;
  location: string;
  date: string;
  numberOfParticipants: number;
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  constructor(private firestore: Firestore) {}

  getTrainings(): Observable<Training[]> {
    const trainingsRef = collection(this.firestore, 'trainings');
    return collectionData(trainingsRef, { idField: 'id' }) as Observable<Training[]>;
  }
}
