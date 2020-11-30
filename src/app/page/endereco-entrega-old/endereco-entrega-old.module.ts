import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EnderecoEntregaOldPage } from './endereco-entrega-old.page';

const routes: Routes = [
  {
    path: '',
    component: EnderecoEntregaOldPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EnderecoEntregaOldPage]
})
export class EnderecoEntregaOldPageModule { }
