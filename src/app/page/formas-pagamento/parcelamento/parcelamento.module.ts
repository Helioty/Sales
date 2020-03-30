import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { IonicModule } from '@ionic/angular';

import { ParcelamentoPage } from './parcelamento.page';

const routes: Routes = [
  {
    path: '',
    component: ParcelamentoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ParcelamentoPage]
})
export class ParcelamentoPageModule {}