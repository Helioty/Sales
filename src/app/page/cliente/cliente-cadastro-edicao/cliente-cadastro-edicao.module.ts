import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
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
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClienteCadastroEdicaoPage]
})
export class ClienteCadastroEdicaoPageModule { }
