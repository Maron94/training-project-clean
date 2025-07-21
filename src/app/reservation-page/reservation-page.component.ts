import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingService, Training } from '../services/training.service';

@Component({
  selector: 'app-reservation-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-page.component.html',
  styleUrls: ['./reservation-page.component.css']
})
export class ReservationPageComponent implements OnInit {
  trainings: Training[] = [];

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.trainingService.getTrainings().subscribe((data: Training[]) => {
      this.trainings = data;
    });
  }
}
