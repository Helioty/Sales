import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public loading: HTMLIonLoadingElement;

  public appName = 'VENDAS';
  public version = '0.0.1';

  constructor(
    private androidFullScreen: AndroidFullScreen,
    private appVersion: AppVersion,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private platform: Platform
  ) { }

  // Funções comuns
  public goToFullScreen() {
    if (this.platform.is('cordova')) {
      this.androidFullScreen.isImmersiveModeSupported()
        .then(() => this.androidFullScreen.immersiveMode())
        .catch(err => console.log(err));
    }
  }

  // Version
  async getAppName() {
    if (this.platform.is('cordova')) {
      this.appName = await this.appVersion.getAppName();
    }
  }

  async getVersionNumber() {
    if (this.platform.is('cordova')) {
      this.version = await this.appVersion.getVersionNumber();
    }
  }

  async getVersionCode() {
    const versionCode = await this.appVersion.getVersionCode();
    const vCode = versionCode.toString();
    return vCode.replace(/^(\d{1})(\d)/, '$1.$2');
  }

  async showVersion() {
    if (this.platform.is('cordova')) {
      if (this.appName === '') {
        await this.getAppName();
      }
      if (this.version === '') {
        await this.getVersionNumber();
      }
      const versionCode = await this.getVersionCode();
      const V = 'Versão: ' + this.version + '<br> Version Code: ' + versionCode;
      this.showAlert(this.appName, V);
    }
  }

  // Loading
  async showLoader() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'circular'
    });
    this.loading.present();
  }

  async showLoaderCustom(msg: string) {
    this.loading = await this.loadingCtrl.create({
      spinner: 'circular',
      message: msg
    });
    this.loading.present();
  }

  // Toast's
  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      buttons: [{
        side: 'end',
        icon: 'close',
        role: 'cancel'
      }]
    });
    toast.present();
  }

  async showToastCustom(msg: string, duration: number, position: 'bottom' | 'top' | 'middle') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration,
      position,
      buttons: [{
        side: 'end',
        icon: 'close',
        role: 'cancel'
      }]
    });
    toast.present();
  }

  // Alert's
  async showAlert(titulo: string, msg: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showAlertInfo(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Info',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showAlertError(titulo: string, error: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: this.appName + ' V: ' + this.version,
      message: error,
      buttons: ['OK'],
      cssClass: 'alertError'
    });
    await alert.present();
  }

  async showAlertAction(titulo: string, message: string, handler: () => void) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message,
      buttons: [{
        text: 'CANCELAR',
        cssClass: ['alertButtonCenter'],
        role: 'cancel'
      }, {
        text: 'CONFIRMAR',
        cssClass: ['alertButtonFcGreen', 'alertButtonCenter'],
        handler
      }]
    });
    await alert.present();
  }

  // formatação de string
  public formataCEP(value: string): string {
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d{3})(\d)/, '$1.$2-$3');
    return value;
  }

  public formataCPFNPJ(value: string): string {
    value = value.replace(/\D/g, ''); // Remove tudo o que não é dígito

    if (value.length === 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      return value;
    } else if (value.length > 11) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
      return value;
    } else if (value.length < 11 && value.length > 9) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      return value;
    } else if (value.length > 6 && value.length <= 9) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      return value;
    } else if (value.length > 3 && value.length <= 6) {
      value = value.replace(/^(\d{3})(\d)/, '$1.$2');
      return value;
    } else {
      return value;
    }
  }

  public formataFONE(value: string): string {
    value = value.replace(/\D/g, '');
    if (value.length === 11) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length < 11 && value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})/, '($1) $2-');
    } else if (value.length <= 6 && value.length > 2) {
      value = value.replace(/^(\d{2})/, '($1) ');
    } else {
      value = value.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return value;
  }

  // formata de forma generica os campos
  public currency(n: any) {
    n = parseFloat(n);
    return isNaN(n) ? false : n.toFixed(2);
  }

}
