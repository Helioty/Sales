import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProdutoPesquisaPage } from './produto-pesquisa.page';

const routes: Routes = [
  {
    path: '',
    component: ProdutoPesquisaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProdutoPesquisaPage]
})
export class ProdutoPesquisaPageModule {}
