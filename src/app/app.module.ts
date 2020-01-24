import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BaseCommon } from '../commons/base-common';
import { DataService } from './services/data.service';
import { BaseService } from './services/base-service.service';
import { AuthService } from './services/auth-service.service';
import { AppConfig } from 'src/config/app.config';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Network } from "@ionic-native/network/ngx";
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ENV, environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
console.log(ENV.mode);


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    AndroidFullScreen,
    AppConfig,
    AppVersion,
    AuthService,
    BarcodeScanner,
    DataService,
    StatusBar,
    SplashScreen,
    BaseCommon,
    BaseService,
    Network,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
