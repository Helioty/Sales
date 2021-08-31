import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./page/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'pedido-lista',
    loadChildren: () =>
      import('./page/pedido-lista/pedido-lista.module').then(
        (m) => m.PedidoListaPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'pedido-retirada',
    loadChildren: () =>
      import('./page/pedido-retirada/pedido-retirada.module').then(
        (m) => m.PedidoRetiradaPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'pedido-atalhos',
    loadChildren: () =>
      import('./page/pedido-atalhos/pedido-atalhos.module').then(
        (m) => m.PedidoAtalhosPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'pedido-rapido',
    loadChildren: () =>
      import('./page/pedido-rapido/pedido-rapido.module').then(
        (m) => m.PedidoRapidoPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'pedido-sacola',
    loadChildren: () =>
      import('./page/pedido-sacola/pedido-sacola.module').then(
        (m) => m.PedidoSacolaPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'produto-pesquisa',
    loadChildren: () =>
      import('./page/produto-pesquisa/produto-pesquisa.module').then(
        (m) => m.ProdutoPesquisaPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'produto',
    loadChildren: () =>
      import('./page/produto/produto.module').then((m) => m.ProdutoPageModule),
    canActivate: [AuthGuard],
  },

  // {
  //   path: 'produto-adicionar-sacola',
  //   loadChildren: () =>
  //     import('./page/produto-adicionar-sacola/produto-adicionar-sacola.module').then(
  //       (m) => m.ProdutoAdicionarSacolaPageModule
  //     ),
  //   canActivate: [AuthGuard],
  // },

  // {
  //   path: 'new-tms',
  //   loadChildren: () =>
  //     import('./page/new-tms/new-tms.module').then((m) => m.NewTMSPageModule),
  // },
  // {
  //   path: 'indicador-vendedor',
  //   loadChildren: () =>
  //     import('./page/indicador-vendedor/indicador-vendedor.module').then(
  //       (m) => m.IndicadorVendedorPageModule
  //     ),
  // },

  // {
  //   path: 'endereco-entrega',
  //   loadChildren: () =>
  //     import('./page/endereco-entrega/endereco-entrega.module').then(
  //       (m) => m.EnderecoEntregaPageModule
  //     ),
  //   canActivate: [AuthGuard, ListaEnderecoGuard],
  // },
  // {
  //   path: 'endereco-entrega-old',
  //   loadChildren: () =>
  //     import('./page/endereco-entrega-old/endereco-entrega-old.module').then(
  //       (m) => m.EnderecoEntregaOldPageModule
  //     ),
  // },
  // {
  //   path: 'pedido-finalizacao',
  //   loadChildren: () =>
  //     import('./page/pedido-finalizacao/pedido-finalizacao.module').then(
  //       (m) => m.PedidoFinalizacaoPageModule
  //     ),
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'consulta-cep/:mode',
  //   loadChildren: () =>
  //     import('./page/consulta-cep/consulta-cep.module').then(
  //       (m) => m.ConsultaCepPageModule
  //     ),
  // },

  {
    path: 'cliente',
    loadChildren: () =>
      import('./page/cliente/cliente.module').then((m) => m.ClientePageModule),
    canActivate: [AuthGuard],
  },

  // {
  //   path: 'tinta-alterada',
  //   loadChildren: () =>
  //     import('./page/tinta-alterada/tinta-alterada.module').then(
  //       (m) => m.TintaAlteradaPageModule
  //     ),
  // },
  // {
  //   path: 'lista-tintas',
  //   loadChildren: () =>
  //     import('./page/tinta-alterada/lista-tintas/lista-tintas.module').then(
  //       (m) => m.ListaTintasPageModule
  //     ),
  // },

  // {
  //   path: 'formas-pagamento',
  //   loadChildren: () =>
  //     import('./page/formas-pagamento/formas-pagamento.module').then(
  //       (m) => m.FormasPagamentoPageModule
  //     ),
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'parcelamento',
  //   loadChildren: () =>
  //     import('./page/formas-pagamento/parcelamento/parcelamento.module').then(
  //       (m) => m.ParcelamentoPageModule
  //     ),
  //   canActivate: [AuthGuard],
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'corrected',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
