import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClientePage } from './cliente.page';
import { PesquisaClienteComponent } from 'src/app/components/pesquisa-cliente/pesquisa-cliente.component';

const routes: Routes = [
  {
    path: '',
    component: ClientePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClientePage, PesquisaClienteComponent],
  entryComponents: [PesquisaClienteComponent]
})
export class ClientePageModule {}
