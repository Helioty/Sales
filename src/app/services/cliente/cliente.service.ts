import { Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { BaseService } from '../base-service.service';
import { CommonService } from '../common/common.service';
import { API_URL } from 'src/app/config/app.config.service';
import { ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(
    private alertCtrl: AlertController,
    private baseService: BaseService,
    private common: CommonService,
    private navControl: NavController
  ) { }

  async getCliente(doc: string) {
    const link = ENV.WS_CRM + API_URL + 'cliente/' + doc;

    return new Promise((resolve, reject) => {
      this.baseService.get(link).then((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }

}
