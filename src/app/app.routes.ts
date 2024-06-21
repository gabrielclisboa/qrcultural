import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home/home.component';
import { getCards } from './shared/resolvers/get-card.resolver';
import { getMonumento } from './shared/resolvers/get-monumento.resolver'

export const routes: Routes = [
    {
        path: '',
        resolve: {
            cards: getCards
        },
        component: HomeComponent
    },
    {
        path: 'cadastrar-monumento',
        loadComponent: () => import('./features/cadastrar/cadastrar.component').then((m) => m.CadastrarComponent)
    },
    {
        path: 'monumento/:id',
        resolve: {
            monumento: getMonumento,
        },
        loadComponent: () => import('./features/monumento/monumento.component').then((m) => m.MonumentoComponent)
    },
    {
        path: 'editar-monumento/:id',
        resolve: {
            monumento: getMonumento,
        },
        loadComponent: () => import('./features/editar/editar.component').then((m) => m.EditarComponent)
    }
];
