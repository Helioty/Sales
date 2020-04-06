import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HideKeyboardModule } from 'hide-keyboard';
import { PipesModule } from 'src/app/pipes/pipes.module';
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
    PipesModule,
    HideKeyboardModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProdutoPesquisaPage]
})
export class ProdutoPesquisaPageModule {}
