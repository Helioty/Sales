import { Component } from '@angular/core';

import { Platform, MenuController, AlertController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';

import { AuthGuard } from './guards/auth.guard';
import { BaseCommon } from './../commons/base-common';
import { AppConfig } from 'src/config/app.config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {
  public appPages = [
    {
      title: 'Pedidos',
      url: '/pedido-lista',
      icon: 'clipboard'
    },
    {
      title: 'Consulta Cep',
      url: '/consulta-cep/consulta',
      icon: 'pin'
    },
    {
      title: 'Pedido Rapido',
      url: '/pedido-rapido',
      icon: 'speedometer'
    },
    {
      title: 'New TMS',
      url: '/new-tms',
      icon: 'cube'
    },
    {
      title: 'Desempenho',
      url: '/indicador-vendedor',
      icon: 'stats'
    },
    {
      title: 'Logout',
      url: '/login',
      icon: 'log-out'
    }
  ];


  public foto: any;

  public nome: any;

  public noPhoto: boolean = false;

  constructor(
    private app: AppConfig,
    private authGuard: AuthGuard,
    private androidFullScreen: AndroidFullScreen,
    public alertCtrl: AlertController,
    public common: BaseCommon,
    private menu: MenuController,
    private platform: Platform,
    private navControl: NavController,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    this.androidFullScreen.isImmersiveModeSupported()
      .then(() => this.androidFullScreen.immersiveMode())
      .catch(err => console.log(err));

    this.app.getURL()
  }

  initializeApp() {
    console.log(this.platform)
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.menu.enable(false);
    });
  }

  buttonAction(page: any) {
    switch (page.title) {
      case ("Logout"): {
        this.showAlertLogout()
      } break;

      default: {
        console.log("default of button Action!")
        this.navControl.navigateRoot([page.url])
        // this.router.navigateByUrl(page.url)
      }
    }
  }

  async showAlertLogout() {
    const alert = await this.alertCtrl.create({
      header: "Logout",
      subHeader: "Deseja sair?",
      buttons: ['NÃO', {
        text: 'SIM',
        handler: () => {
          this.authGuard.logged = false;
          this.navControl.navigateRoot(['login'])
        }
      }]
    });
    await alert.present();
  }


  getStatus(): any {

    if (localStorage.getItem("token")) {
      if (localStorage.getItem("foto")) {
        this.foto = localStorage.getItem("foto");
        // console.log(this.foto)
      }

      if (localStorage.getItem("nome")) {
        this.nome = localStorage.getItem("nome");
        // console.log(this.nome)
      }

      if (localStorage.getItem("foto") != 'null' && localStorage.getItem("foto") != undefined) {
        this.noPhoto = true;
        // console.log(this.noPhoto)
      }

    }

  }

}

