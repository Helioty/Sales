import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClienteEnderecosPage } from './cliente-enderecos.page';

const routes: Routes = [
  {
    path: '',
    component: ClienteEnderecosPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClienteEnderecosPageRoutingModule {}
