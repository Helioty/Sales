import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProdutoImagensPage } from './produto-imagens.page';

const routes: Routes = [
  {
    path: '',
    component: ProdutoImagensPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProdutoImagensPage]
})
export class ProdutoImagensPageModule { }
