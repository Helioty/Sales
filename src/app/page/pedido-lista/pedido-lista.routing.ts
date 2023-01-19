import { Routes } from '@angular/router';
import { PedidoListaPage } from './pedido-lista.page';

export const ROUTES: Routes = [
  {
    path: '',
    component: PedidoListaPage,
    children: [
      {
        path: 'pedido-aberto',
        loadComponent: () =>
          import('./abertos/pedido-aberto.page').then((m) => m.PedidoAbertoPage),
      },
      {
        path: 'pedido-finalizado',
        loadComponent: () =>
          import('./finalizados/pedido-finalizado.page').then(
            (m) => m.PedidoFinalizadoPage
          ),
      },
      {
        path: '',
        redirectTo: '/pedido-lista/pedido-aberto',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'pedido-resumo',
    loadChildren: () =>
      import('./pedido-resumo/pedido-resumo.module').then(
        (m) => m.PedidoResumoPageModule
      ),
  },
  {
    path: 'pedido-desconto',
    loadChildren: () =>
      import('./pedido-desconto/pedido-desconto.module').then(
        (m) => m.PedidoDescontoPageModule
      ),
  },
];
