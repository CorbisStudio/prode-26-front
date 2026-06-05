import { describe, it, expect, beforeEach } from 'vitest';
import { PredictionService } from './prediction.service';

describe('PredictionService', () => {
  let service: PredictionService;

  beforeEach(() => {
    localStorage.clear();
    service = new PredictionService();
  });

  it('should save and retrieve predictions', () => {
    service.savePrediction({ matchId: 1, homeScore: 2, awayScore: 1 });
    const pred = service.getPrediction(1);
    expect(pred).toEqual({ matchId: 1, homeScore: 2, awayScore: 1 });
  });

  it('should calculate points correctly', () => {
    const matches = [
      {
        id: 1,
        status: 'FINISHED' as const,
        score: {
          fullTime: { home: 2, away: 1 },
        },
      },
      {
        id: 2,
        status: 'FINISHED' as const,
        score: {
          fullTime: { home: 0, away: 0 },
        },
      },
    ] as any;

    const predictions = [
      { matchId: 1, homeScore: 2, awayScore: 1 }, // exacto = 3 pts
      { matchId: 2, homeScore: 1, awayScore: 1 }, // empate acertado = 1 pt
    ];

    const points = service.calculatePoints(predictions, matches);
    expect(points).toBe(4);
  });
});
