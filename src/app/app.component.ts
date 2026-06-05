import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PredictionService } from './core/services/prediction.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit {
  private readonly predictions = inject(PredictionService);
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.predictions.loadPredictions();
    }
  }
}
