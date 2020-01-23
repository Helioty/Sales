import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IndicadorVendedorPage } from './indicador-vendedor.page';

const routes: Routes = [
  {
    path: '',
    component: IndicadorVendedorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [IndicadorVendedorPage]
})
export class IndicadorVendedorPageModule {}
