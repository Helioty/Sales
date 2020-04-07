import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConsultaCepPageModule } from 'src/app/page/consulta-cep/consulta-cep.module';
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
    // ConsultaCepPageModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClienteCadastroEdicaoPage]
})
export class ClienteCadastroEdicaoPageModule { }
