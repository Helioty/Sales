import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NewTMSPage } from './new-tms.page';

const routes: Routes = [
  {
    path: '',
    component: NewTMSPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [NewTMSPage],
})
export class NewTMSPageModule {}
