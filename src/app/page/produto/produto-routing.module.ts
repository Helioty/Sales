import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdutoPage } from './produto.page';

const routes: Routes = [
  {
    path: '',
    component: ProdutoPage,
  },
  {
    path: 'detalhes',
    loadChildren: () =>
      import('./produto-detalhes/produto-detalhes.module').then(
        (m) => m.ProdutoDetalhesPageModule
      ),
  },
  {
    path: 'imagens',
    loadChildren: () =>
      import('./produto-imagens/produto-imagens.module').then(
        (m) => m.ProdutoImagensPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdutoPageRoutingModule {}
