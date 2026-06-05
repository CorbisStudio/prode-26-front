import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/home/pages/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/pages/home-page/home-page.component').then(m => m.HomePageComponent),
      },
      {
        path: 'partidos',
        loadComponent: () => import('./features/matches/pages/matches-page/matches-page.component').then(m => m.MatchesPageComponent),
      },
      {
        path: 'posiciones',
        loadComponent: () => import('./features/standings/pages/standings-page/standings-page.component').then(m => m.StandingsPageComponent),
      },
      {
        path: 'predicciones',
        loadComponent: () => import('./features/predictions/pages/predictions-page/predictions-page.component').then(m => m.PredictionsPageComponent),
      },
      {
        path: 'eliminatorias',
        loadComponent: () => import('./features/bracket/pages/bracket-page/bracket-page.component').then(m => m.BracketPageComponent),
      },
      {
        path: 'ranking',
        loadComponent: () => import('./features/ranking/pages/ranking-page/ranking-page.component').then(m => m.RankingPageComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
