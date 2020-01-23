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
    loadChildren: './page/pedido-lista/pedido-lista.module#PedidoListaPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'pedido-resumo',
    loadChildren: './page/pedido-lista/pedido-resumo/pedido-resumo.module#PedidoResumoPageModule'
  },
  { 
    path: 'pedido-sacola', 
    loadChildren: './page/pedido-sacola/pedido-sacola.module#PedidoSacolaPageModule' 
  },
  {
    path: 'produto',
    loadChildren: './page/produto/produto.module#ProdutoPageModule'
  },
  {
    path: 'pedido-rapido',
    loadChildren: './page/pedido-rapido/pedido-rapido.module#PedidoRapidoPageModule'
  },
  {
    path: 'new-tms',
    loadChildren: './page/new-tms/new-tms.module#NewTMSPageModule'
  },
  {
    path: 'indicador-vendedor',
    loadChildren: './page/indicador-vendedor/indicador-vendedor.module#IndicadorVendedorPageModule'
  },

  { path: 'produto-imagens', loadChildren: './produto/produto-imagens/produto-imagens.module#ProdutoImagensPageModule' },
  { path: 'produto-detalhes', loadChildren: './produto/produto-detalhes/produto-detalhes.module#ProdutoDetalhesPageModule' },
  { path: 'pedido-finalizacao', loadChildren: './pedido-finalizacao/pedido-finalizacao.module#PedidoFinalizacaoPageModule' },
  




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
