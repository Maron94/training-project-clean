import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-page.html',
  styleUrls: ['./booking-page.css']
})
export class BookingPageComponent implements OnInit {
  trainingId!: string;
  availableSlots: number = 0;
  availableSlotsArray: number[] = [];

  showForm = false;
  selectedSlots: number = 0;

  firstName = '';
  lastName = '';
  email = '';

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  async ngOnInit() {
    this.trainingId = this.route.snapshot.paramMap.get('id')!;
    const docRef = doc(this.firestore, 'trainings', this.trainingId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.availableSlots = docSnap.data()['numberOfParticipants'];
      this.availableSlotsArray = Array.from({ length: this.availableSlots }, (_, i) => i + 1);
    }
  }

  async submitForm() {
    
    const docRef = doc(this.firestore, 'trainings', this.trainingId);


    const updatedSlots = this.availableSlots - this.selectedSlots;
    await updateDoc(docRef, {
      numberOfParticipants: updatedSlots
    });

    alert(`Booking confirmed for ${this.selectedSlots} participant(s)!`);
  }
}
