import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { SeoRouteData } from './core/config/seo.config';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/home/pages/login-page/login-page.component').then((m) => m.LoginPageComponent),
    data: { seo: { key: 'login', noIndex: true } as SeoRouteData },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/home/pages/register-page/register-page.component').then((m) => m.RegisterPageComponent),
    data: { seo: { key: 'register', noIndex: true } as SeoRouteData },
  },
  {
    path: 'activate',
    loadComponent: () =>
      import('./features/home/pages/activate-page/activate-page.component').then((m) => m.ActivatePageComponent),
    data: { seo: { key: 'activate', noIndex: true } as SeoRouteData },
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/pages/home-page/home-page.component').then((m) => m.HomePageComponent),
        data: { seo: { key: 'home' } as SeoRouteData },
      },
      {
        path: 'partidos',
        loadComponent: () =>
          import('./features/matches/pages/matches-page/matches-page.component').then((m) => m.MatchesPageComponent),
        data: { seo: { key: 'partidos' } as SeoRouteData },
      },
      {
        path: 'posiciones',
        loadComponent: () =>
          import('./features/standings/pages/standings-page/standings-page.component').then(
            (m) => m.StandingsPageComponent,
          ),
        data: { seo: { key: 'posiciones' } as SeoRouteData },
      },
      {
        path: 'predicciones',
        loadComponent: () =>
          import('./features/predictions/pages/predictions-page/predictions-page.component').then(
            (m) => m.PredictionsPageComponent,
          ),
        data: { seo: { key: 'predicciones' } as SeoRouteData },
      },
      {
        path: 'eliminatorias',
        loadComponent: () =>
          import('./features/bracket/pages/bracket-page/bracket-page.component').then((m) => m.BracketPageComponent),
        data: { seo: { key: 'eliminatorias' } as SeoRouteData },
      },
      {
        path: 'ranking',
        loadComponent: () =>
          import('./features/ranking/pages/ranking-page/ranking-page.component').then((m) => m.RankingPageComponent),
        data: { seo: { key: 'ranking' } as SeoRouteData },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
