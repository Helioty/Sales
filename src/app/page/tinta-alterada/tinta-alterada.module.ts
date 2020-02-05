import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TintaAlteradaPage } from './tinta-alterada.page';

const routes: Routes = [
  {
    path: '',
    component: TintaAlteradaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TintaAlteradaPage]
})
export class TintaAlteradaPageModule {}
