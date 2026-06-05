import { Injectable, signal, computed, inject, ResourceRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { Match, MatchPrediction } from '../models/match.model';
import { ProdeApiService } from './prode-api.service';
import { BackendPrediction } from '../models/backend.model';

function mapBackendPrediction(bp: BackendPrediction): MatchPrediction {
  return {
    matchId: bp.match,
    homeScore: bp.home_score,
    awayScore: bp.away_score,
  };
}

@Injectable({ providedIn: 'root' })
export class PredictionService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ProdeApiService);

  private readonly predictions = signal<Map<number, MatchPrediction>>(new Map());
  readonly allPredictions = computed(() => Array.from(this.predictions().values()));

  getPrediction(matchId: number): MatchPrediction | undefined {
    return this.predictions().get(matchId);
  }

  async loadPredictions(): Promise<void> {
    try {
      const backendPredictions = await firstValueFrom(
        this.http.get<BackendPrediction[]>(`${this.api.baseUrl}/predictions/`)
      );
      const map = new Map<number, MatchPrediction>();
      for (const bp of backendPredictions) {
        map.set(bp.match, mapBackendPrediction(bp));
      }
      this.predictions.set(map);
    } catch {
      // Silently fail; predictions will be empty
    }
  }

  async savePrediction(prediction: MatchPrediction): Promise<void> {
    await firstValueFrom(
      this.api.savePrediction(prediction.matchId, prediction.homeScore, prediction.awayScore)
    );
    this.predictions.update((map) => {
      const newMap = new Map(map);
      newMap.set(prediction.matchId, prediction);
      return newMap;
    });
  }

  calculatePoints(predictions: MatchPrediction[], matches: Match[]): number {
    let points = 0;
    for (const pred of predictions) {
      const match = matches.find((m) => m.id === pred.matchId);
      if (!match || match.status !== 'FINISHED') continue;

      const actualHome = match.home_score ?? 0;
      const actualAway = match.away_score ?? 0;
      const predHome = pred.homeScore;
      const predAway = pred.awayScore;

      if (predHome === actualHome && predAway === actualAway) {
        points += 3; // Resultado exacto
      } else {
        const actualResult = Math.sign(actualHome - actualAway);
        const predResult = Math.sign(predHome - predAway);
        if (actualResult === predResult) {
          points += 1; // Acierta quién gana o empate
        }
      }
    }
    return points;
  }
}
