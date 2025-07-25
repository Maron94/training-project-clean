import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore';

export interface Training {
  id: number;
  title: string;
  description: string;
  location: string;
  date: Timestamp;
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
  reserveTraining(training: Training): void {
    // Implementacja rezerwacji treningu
    console.log('Rezerwacja treningu:', training.title);
    let participants = 0;
    const trainingRef = doc(this.firestore, `trainings/${training.title}`);
    updateDoc(trainingRef, { numberOfParticipants: training.numberOfParticipants - 1 });
    if (training.numberOfParticipants > 0) {
      training.numberOfParticipants--;
      console.log('Booked:', training.title);
    }
    else {
      console.error('Brak dostępnych miejsc na trening:', training.title);      
  }
    const trainies = doc(this.firestore, 'participants', training.title);
 }
}
