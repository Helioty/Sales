import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth/auth.guard';
import { ClientePage } from './cliente.page';

const routes: Routes = [
  {
    path: '',
    component: ClientePage,
  },
  {
    path: 'novo/:doc',
    loadChildren: () =>
      import('./cliente-cadastro-edicao/cliente-cadastro-edicao.module').then(
        (m) => m.ClienteCadastroEdicaoPageModule
      ),
  },
  {
    path: 'edicao/',
    loadChildren: () =>
      import('./cliente-cadastro-edicao/cliente-cadastro-edicao.module').then(
        (m) => m.ClienteCadastroEdicaoPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientePageRoutingModule {}
