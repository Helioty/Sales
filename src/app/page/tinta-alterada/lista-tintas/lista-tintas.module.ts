import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ListaTintasPage } from './lista-tintas.page';

const routes: Routes = [
  {
    path: '',
    component: ListaTintasPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [ListaTintasPage],
})
export class ListaTintasPageModule {}
