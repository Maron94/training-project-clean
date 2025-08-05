import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrainingService } from '../../services/training.service';

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

  participants: { name: string; lastName: string }[] = [];
  currentStep = 0;
  showEmailInput = false;
  email = '';

  constructor(
    private route: ActivatedRoute, 
    private firestore: Firestore,
    private trainingService: TrainingService
  ) {}

  async ngOnInit() {
    this.trainingId = this.route.snapshot.paramMap.get('id')!;
    await this.loadTrainingData();
  }

  //Pobiera aktualną liczbę wolnych miejsc
  async loadTrainingData() {
    const docRef = doc(this.firestore, 'trainings', this.trainingId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.availableSlots = docSnap.data()['numberOfParticipants'];
      this.availableSlotsArray = Array.from({ length: this.availableSlots }, (_, i) => i + 1);
    }
  }

  //Aktualizacja listy uczestników po wyborze ilości miejsc
  onSlotChange() {
    this.participants = Array.from({ length: this.selectedSlots }, () => ({
      name: '',
      lastName: ''
    }));

    this.currentStep = 0;
    this.showEmailInput = false;
  }

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

  // Obsługa rezerwacji i wysyłki linku edycji
  async submitForm() {
    if (!this.email || !/\S+@\S+\.\S+/.test(this.email)) {
      alert('Please enter a valid email.');
      return;
    }

    try {
      await this.trainingService.createBooking(this.trainingId, this.participants, this.email);
      alert('Booking completed! A unique edit link has been sent to your email.');
      await this.loadTrainingData(); // Odśwież wolne miejsca
      this.resetForm();
    } catch (error) {
      console.error('Booking error:', error);
      alert('An error occurred while booking. Please try again.');
    }
  }

  resetForm() {
    this.selectedSlots = 0;
    this.participants = [];
    this.currentStep = 0;
    this.showEmailInput = false;
    this.email = '';
  }
}
