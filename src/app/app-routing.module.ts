import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './page/login/login.module#LoginPageModule'
  },
  {
    path: 'pedido-lista',
    loadChildren: () => import('./page/pedido-lista/pedido-lista.module').then(m => m.PedidoListaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pedido-resumo',
    loadChildren: './page/pedido-lista/pedido-resumo/pedido-resumo.module#PedidoResumoPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'pedido-retirada',
    loadChildren: './page/pedido-retirada/pedido-retirada.module#PedidoRetiradaPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'pedido-atalhos',
    loadChildren: './page/pedido-atalhos/pedido-atalhos.module#PedidoAtalhosPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'pedido-sacola',
    loadChildren: './page/pedido-sacola/pedido-sacola.module#PedidoSacolaPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'pedido-rapido',
    loadChildren: './page/pedido-rapido/pedido-rapido.module#PedidoRapidoPageModule',
    canActivate: [AuthGuard]
  },


  {
    path: 'produto-pesquisa',
    loadChildren: './page/produto-pesquisa/produto-pesquisa.module#ProdutoPesquisaPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'produto',
    loadChildren: './page/produto/produto.module#ProdutoPageModule'
  },
  {
    path: 'produto-imagens',
    loadChildren: './page/produto/produto-imagens/produto-imagens.module#ProdutoImagensPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'produto-detalhes',
    loadChildren: './page/produto/produto-detalhes/produto-detalhes.module#ProdutoDetalhesPageModule',
    canActivate: [AuthGuard]
  },


  {
    path: 'new-tms',
    loadChildren: './page/new-tms/new-tms.module#NewTMSPageModule'
  },
  {
    path: 'indicador-vendedor',
    loadChildren: './page/indicador-vendedor/indicador-vendedor.module#IndicadorVendedorPageModule'
  },


  {
    path: 'endereco-entrega',
    loadChildren: './page/endereco-entrega/endereco-entrega.module#EnderecoEntregaPageModule'
  },
  {
    path: 'pedido-finalizacao',
    loadChildren: './page/pedido-finalizacao/pedido-finalizacao.module#PedidoFinalizacaoPageModule'
  },
  {
    path: 'consulta-cep/:mode',
    loadChildren: './page/consulta-cep/consulta-cep.module#ConsultaCepPageModule'
  },


  {
    path: 'cliente',
    loadChildren: './page/cliente/cliente.module#ClientePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'cliente-cadastro-edicao',
    loadChildren: './page/cliente/cliente-cadastro-edicao/cliente-cadastro-edicao.module#ClienteCadastroEdicaoPageModule',
    canActivate: [AuthGuard]
  },


  {
    path: 'tinta-alterada',
    loadChildren: './page/tinta-alterada/tinta-alterada.module#TintaAlteradaPageModule'
  },
  {
    path: 'lista-tintas',
    loadChildren: './page/tinta-alterada/lista-tintas/lista-tintas.module#ListaTintasPageModule'
  },


  {
    path: 'forma-pagamento',
    loadChildren: './page/forma-pagamento/forma-pagamento.module#FormaPagamentoPageModule'
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
