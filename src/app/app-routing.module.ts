import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
  },
  {
    path: 'pedido-lista',
    loadChildren: './pedido-lista/pedido-lista.module#PedidoListaPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'pedido-resumo',
    loadChildren: './pedido-lista/pedido-resumo/pedido-resumo.module#PedidoResumoPageModule'
  },
  { 
    path: 'pedido-sacola', 
    loadChildren: './pedido-sacola/pedido-sacola.module#PedidoSacolaPageModule' 
  },
  {
    path: 'produto',
    loadChildren: './produto/produto.module#ProdutoPageModule'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pedido-rapido',
    loadChildren: './pedido-rapido/pedido-rapido.module#PedidoRapidoPageModule'
  },
  {
    path: 'to-pdf-page',
    loadChildren: './to-pdf-page/to-pdf-page.module#ToPDFPagePageModule'
  },
  {
    path: 'new-tms',
    loadChildren: './new-tms/new-tms.module#NewTMSPageModule'
  },
  {
    path: 'indicador-vendedor',
    loadChildren: './indicador-vendedor/indicador-vendedor.module#IndicadorVendedorPageModule'
  },

  { path: 'produto-imagens', loadChildren: './produto/produto-imagens/produto-imagens.module#ProdutoImagensPageModule' },
  { path: 'produto-detalhes', loadChildren: './produto/produto-detalhes/produto-detalhes.module#ProdutoDetalhesPageModule' },
  




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
