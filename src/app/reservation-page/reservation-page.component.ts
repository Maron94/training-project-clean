import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingService, Training} from '/home/daniel/ProjektTraining/PTC/training-project-clean/src/services/training.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-reservation-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
