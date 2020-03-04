import { Injectable } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { BaseService } from './base-service.service';
import { CommonService } from 'src/app/services/common.service';
import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/app/config/app.config.service';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(
    private alertCtrl: AlertController,
    private baseService: BaseService,
    private common: CommonService,
    private navControl: NavController
  ) { }

}
