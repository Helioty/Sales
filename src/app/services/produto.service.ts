import { Injectable } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { BaseService } from './base-service.service';
import { BaseCommon } from 'src/commons/base-common';
import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/app/config/app.config.service';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(
    public alertCtrl: AlertController,
    public baseService: BaseService,
    public common: BaseCommon,
    public navControl: NavController
  ) { }

}
