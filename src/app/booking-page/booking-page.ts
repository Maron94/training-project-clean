import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, arrayRemove, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { collection, setDoc } from 'firebase/firestore';

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

nextStep() {
  if (this.participants[this.currentStep].name && this.participants[this.currentStep].lastName) {
    this.currentStep++;
  } else {
    alert('Please fill out both fields.');
  }
}

prevStep() {
  if (this.currentStep > 0) {
    this.currentStep--;
  }
}

finishParticipants() {
  const allFilled = this.participants.every(p => p.name && p.lastName);
  if (allFilled) {
    this.showEmailInput = true;
  } else {
    alert('Fill in all participants before continuing.');
  }
}

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

participants: { name: string; lastName: string }[] = [];
currentStep = 0;
showEmailInput = false;

onSlotChange() {
  this.participants = Array.from({ length: this.selectedSlots }, () => ({
    name: '',
    lastName: ''
  }));

  this.currentStep = 0;
  this.showEmailInput = false;
}

  async ngOnInit() {
    
    this.participants = Array.from({ length: this.selectedSlots }, () => ({
      name: '',
      lastName: ''
    }));
    
    this.trainingId = this.route.snapshot.paramMap.get('id')!;
    const docRef = doc(this.firestore, 'trainings', this.trainingId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.availableSlots = docSnap.data()['numberOfParticipants'];
      this.availableSlotsArray = Array.from({ length: this.availableSlots }, (_, i) => i + 1);
    }
  }

  async submitForm() {
  if (!this.email) {
    alert('Please enter your email.');
    return;
  }

  const batch = this.participants.map(async participant => {
    const docRef = doc(collection(this.firestore, 'participants'));
    await setDoc(docRef, {
      name: participant.name,
      lastName: participant.lastName,
      email: this.email,
      trainingId: this.trainingId
    });
  });

  await Promise.all(batch);

  // Aktualizacja liczby miejsc
  const trainingRef = doc(this.firestore, 'trainings', this.trainingId);
  await updateDoc(trainingRef, {
    numberOfParticipants: this.availableSlots - this.selectedSlots
  });

  alert('Booking completed!');
}
}
