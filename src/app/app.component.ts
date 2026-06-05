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

  async ngOnInit(): Promise<void> {
    if (this.auth.isAuthenticated()) {
      const profile = await this.auth.fetchProfile();
      if (profile) {
        localStorage.setItem('prode_user_data', JSON.stringify(profile));
      }
      this.predictions.loadPredictions();
    }
  }
}
