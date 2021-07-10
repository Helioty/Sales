import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EnderecoEntregaPage } from './endereco-entrega.page';

const routes: Routes = [
  {
    path: '',
    component: EnderecoEntregaPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [EnderecoEntregaPage],
})
export class EnderecoEntregaPageModule {}
