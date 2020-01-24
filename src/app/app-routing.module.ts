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
    loadChildren: './page/pedido-lista/pedido-resumo/pedido-resumo.module#PedidoResumoPageModule'
  },
  {
    path: 'pedido-sacola',
    loadChildren: './page/pedido-sacola/pedido-sacola.module#PedidoSacolaPageModule'
  },
  {
    path: 'pedido-rapido',
    loadChildren: './page/pedido-rapido/pedido-rapido.module#PedidoRapidoPageModule'
  },


  {
    path: 'produto',
    loadChildren: './page/produto/produto.module#ProdutoPageModule'
  },
  {
    path: 'produto-imagens',
    loadChildren: './page/produto/produto-imagens/produto-imagens.module#ProdutoImagensPageModule'
  },
  {
    path: 'produto-detalhes',
    loadChildren: './page/produto/produto-detalhes/produto-detalhes.module#ProdutoDetalhesPageModule'
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
    path: 'pedido-finalizacao',
    loadChildren: './page/pedido-finalizacao/pedido-finalizacao.module#PedidoFinalizacaoPageModule'
  },
  { 
    path: 'consulta-cep/:mode', 
    loadChildren: './page/consulta-cep/consulta-cep.module#ConsultaCepPageModule' 
  },  { path: 'cliente', loadChildren: './page/cliente/cliente.module#ClientePageModule' },







];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
