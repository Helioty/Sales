import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';

@Injectable({
    providedIn: 'root'
})

export class BaseCommon {

    public loading: any;

    constructor(
        private androidFullScreen: AndroidFullScreen,
        private appVersion: AppVersion,
        private toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
    ) { }


    // Funções comuns --------------------------------------------------------------------------------------------------
    goToFullScreen() {
        this.androidFullScreen.isImmersiveModeSupported()
            .then(() => this.androidFullScreen.immersiveMode())
            .catch(err => console.log(err));
    }

    // Version --------------------------------------------------------------------------------------------------------
    async getAppName() {
        let appName = this.appVersion.getAppName()
        return appName;
    }

    async getVersionNumber() {
        let versionNumber: string = await this.appVersion.getVersionNumber();
        return versionNumber.toString();
    }

    async getVersionCode() {
        let versionCode = await this.appVersion.getVersionCode();
        let vCode = versionCode.toString();
        return vCode.replace(/^(\d{1})(\d)/, '$1.$2');
    }



    // Loading --------------------------------------------------------------------------------------------------------
    async showLoader() {
        this.loading = await this.loadingCtrl.create({
            spinner: 'circular',
            // message: 'Carregando...',
            // showBackdrop: true,
        });
        this.loading.present();
    }

    async showLoaderCustom(spin: any, msg: string) {
        this.loading = await this.loadingCtrl.create({
            spinner: spin,
            message: msg
        });
        this.loading.present();
    }



    // Toast's --------------------------------------------------------------------------------------------------------
    async showToast(msg: string) {
        let toast = await this.toastCtrl.create({
            message: msg,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    }



    // Alert's --------------------------------------------------------------------------------------------------------
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
            header: "Info",
            message: msg,
            buttons: ['OK']
        });
        await alert.present();
    }

    async showAlertError(erro: string) {
        const alert = await this.alertCtrl.create({
            header: "ERRO!",
            message: erro,
            buttons: ['OK']
        });
        await alert.present();
    }



    // formatação de string -------------------------------------------------------------------------------------------
    public formata(value: string, filter: string) {

        if (filter == 'CEP') {
            value = value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d{3})(\d)/, "$1.$2-$3");
            return value;
        }

        if (filter === 'CPFCGC') {
            value = value.replace(/\D/g, ''); //Remove tudo o que não é dígito

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
            }
            else if (value.length < 11 && value.length > 9) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                return value;
            }
            else if (value.length > 6 && value.length <= 9) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                return value;
            }
            else if (value.length > 3 && value.length <= 6) {
                value = value.replace(/^(\d{3})(\d)/, '$1.$2');
                return value;
            }
            else {
                return value;
            }
        }

        if (filter === 'FONE') {

            if (value.length === 11) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
            else if (value.length < 11 && value.length > 6) {
                value = value.replace(/^(\d{2})(\d{4})/, '($1) $2-');
            }
            else if (value.length <= 6 && value.length > 2) {
                value = value.replace(/^(\d{2})/, '($1) ');
            }
            else {
                value = value.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
            return value;

        }

    }

}