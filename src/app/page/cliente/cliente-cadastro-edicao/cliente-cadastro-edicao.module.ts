import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClienteCadastroEdicaoPage } from './cliente-cadastro-edicao.page';

const routes: Routes = [
  {
    path: '',
    component: ClienteCadastroEdicaoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClienteCadastroEdicaoPage]
})
export class ClienteCadastroEdicaoPageModule {}
