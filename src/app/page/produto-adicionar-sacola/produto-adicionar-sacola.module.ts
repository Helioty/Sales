import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProdutoAdicionarSacolaPage } from './produto-adicionar-sacola.page';

const routes: Routes = [
  {
    path: '',
    component: ProdutoAdicionarSacolaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProdutoAdicionarSacolaPage]
})
export class ProdutoAdicionarSacolaPageModule { }
