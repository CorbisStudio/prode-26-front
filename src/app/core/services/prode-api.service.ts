import { Injectable, ResourceRef, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { BackendMatch, BackendPrediction, BackendLeague, TokenPair, RankingEntry } from '../models/backend.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProdeApiService {
  private readonly http = inject(HttpClient);
  readonly baseUrl = 'http://a1b294b0dce6246168e6682809e8fef5-1925402808.us-west-2.elb.amazonaws.com/api';

  // ─── Auth ───
  login(email: string, password: string): Observable<TokenPair> {
    return this.http.post<TokenPair>(`${this.baseUrl}/token/`, { email, password });
  }

  refreshToken(refresh: string): Observable<{ access: string }> {
    return this.http.post<{ access: string }>(`${this.baseUrl}/token/refresh/`, { refresh });
  }

  verifyToken(token: string): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/token/verify/`, { token });
  }

  // ─── Matches ───
  getMatches(
    group?: string,
    stage?: string,
    status?: string
  ): ResourceRef<BackendMatch[] | undefined> {
    let url = `${this.baseUrl}/matches/`;
    const params = new URLSearchParams();
    if (group) params.append('group', group);
    if (stage) params.append('stage', stage);
    if (status) params.append('status', status);
    if (params.toString()) url += `?${params.toString()}`;
    return httpResource<BackendMatch[]>(() => url);
  }

  getMatch(id: number): ResourceRef<BackendMatch | undefined> {
    return httpResource<BackendMatch>(() => `${this.baseUrl}/matches/${id}/`);
  }

  // ─── Predictions ───
  getPredictions(): ResourceRef<BackendPrediction[] | undefined> {
    return httpResource<BackendPrediction[]>(() => `${this.baseUrl}/predictions/`);
  }

  savePrediction(matchId: number, homeScore: number, awayScore: number): Observable<BackendPrediction> {
    return this.http.post<BackendPrediction>(`${this.baseUrl}/predictions/`, {
      match: matchId,
      home_score: homeScore,
      away_score: awayScore,
    });
  }

  // ─── Ranking ───
  getRanking(): ResourceRef<RankingEntry[] | undefined> {
    return httpResource<RankingEntry[]>(() => `${this.baseUrl}/ranking/`);
  }

  // ─── Leagues ───
  getLeagues(): ResourceRef<BackendLeague[] | undefined> {
    return httpResource<BackendLeague[]>(() => `${this.baseUrl}/leagues/`);
  }
}
