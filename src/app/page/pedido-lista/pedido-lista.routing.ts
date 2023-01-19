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
    loadComponent: () =>
      import('./resumo/pedido-resumo.page').then((m) => m.PedidoResumoPage),
  },
  {
    path: 'pedido-desconto',
    loadComponent: () =>
      import('./desconto/pedido-desconto.page').then((m) => m.PedidoDescontoPage),
  },
];
