import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, addDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from '@angular/fire/functions';

export interface Training {
  id: string;
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
  constructor(private firestore: Firestore) { }

  // ✅ Generator unikalnego tokenu do linku edycji
  generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // ✅ Utworzenie rezerwacji i wysłanie linku edycji
  async createBooking(trainingId: string, participants: any[], email?: string) {
    try {
      const token = this.generateToken();

      // Zapis uczestników w podkolekcji danego szkolenia
      for (const person of participants) {
        await addDoc(collection(this.firestore, `trainings/${trainingId}/bookings`), {
          email: email || null,
          name: person.name,
          lastName: person.lastName,
          trainingId,
          editToken: token,
          createdAt: new Date()
        });
      }

      console.log('Booking saved, token:', token);

      // Jeśli użytkownik podał e-mail, wyślij link edycji
      if (email) {
        await this.sendEditLink(email, token);
      }

      return token;
    } catch (error) {
      console.error('Error during reservation:', error);
      throw error;
    }
  }

  // ✅ Wywołanie funkcji chmurowej (wysyłka maila)
  async sendEditLink(email: string, token: string) {
    try {
      const functions = getFunctions();
      const sendLink = httpsCallable(functions, 'sendEditLink');
      const result = await sendLink({ email, token });
      console.log(' Link-email sent successfully:', result);
      return result;
    } catch (error: any) {
      console.error(' Error during sending email-link:', error.message || error);
      throw error;
    }    
  }

  // Pobranie listy szkoleń
  getTrainings(): Observable<Training[]> {
    const trainingsRef = collection(this.firestore, 'trainings');
    return collectionData(trainingsRef, { idField: 'id' }) as Observable<Training[]>;
  }

  // Dodanie rezerwacji w podkolekcji szkolenia
  async bookTraining(trainingId: string, bookingData: any) {
    try {
      const bookingsRef = collection(this.firestore, `trainings/${trainingId}/bookings`);
      return await addDoc(bookingsRef, bookingData);
    } catch (error) {
      console.error(' Error adding booking:', error);
      throw error;
    }
  }

  // Zmniejszenie liczby wolnych miejsc
  async reserveTraining(training: Training): Promise<void> {
    try {
      if (training.numberOfParticipants > 0) {
        const trainingRef = doc(this.firestore, `trainings/${training.id}`);
        await updateDoc(trainingRef, {
          numberOfParticipants: training.numberOfParticipants - 1
        });
        console.log(` Slot booked: ${training.title}`);
      } else {
        console.error(' All slots are booked', training.title);
      }
    } catch (error) {
      console.error('Error during reservation:', error);
    }
  }
}
