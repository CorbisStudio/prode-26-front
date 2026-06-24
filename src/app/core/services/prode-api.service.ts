import { Injectable, ResourceRef, Signal, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { BackendMatch, BackendPrediction, BackendLeague, TokenPair, RankingEntry } from '../models/backend.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProdeApiService {
  private readonly http = inject(HttpClient);
  readonly baseUrl = 'https://prode-api.corbisstudio.com/api';

  login(email: string, password: string): Observable<TokenPair> {
    return this.http.post<TokenPair>(`${this.baseUrl}/token/`, { email, password });
  }

  refreshToken(refresh: string): Observable<{ access: string }> {
    return this.http.post<{ access: string }>(`${this.baseUrl}/token/refresh/`, { refresh });
  }

  verifyToken(token: string): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/token/verify/`, { token });
  }

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

  getRanking(
    endpoint: Signal<string> = signal(`${this.baseUrl}/ranking/`)
  ): ResourceRef<RankingEntry[] | undefined> {
    return httpResource<RankingEntry[]>(() => endpoint());
  }

  getLeagues(): ResourceRef<BackendLeague[] | undefined> {
    return httpResource<BackendLeague[]>(() => `${this.baseUrl}/leagues/`);
  }
}
