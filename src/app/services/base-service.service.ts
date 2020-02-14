import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Network } from "@ionic-native/network/ngx";
import { Platform } from "@ionic/angular";
import { BaseCommon } from 'src/commons/base-common';

import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';

declare let navigator: any;
declare let Connection: any;

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(
    public http: HttpClient,
    public common: BaseCommon,
    public network: Network,
    public platform: Platform
  ) { }

  checkNetwork(): boolean {
    if (this.platform.is("cordova")) {
      let networkState = navigator.connection.type;

      let states = {};
      states[Connection.UNKNOWN] = "Unknown connection";
      states[Connection.ETHERNET] = "Ethernet connection";
      states[Connection.WIFI] = "WiFi connection";
      states[Connection.CELL_2G] = "Cell 2G connection";
      states[Connection.CELL_3G] = "Cell 3G connection";
      states[Connection.CELL_4G] = "Cell 4G connection";
      states[Connection.CELL] = "Cell generic connection";
      states[Connection.NONE] = "No network connection";

      if (networkState == Connection.NONE) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  }

  get(link: string): Promise<any> {

    if (!this.checkNetwork()) {
      this.common.showToast("Sem conexão!");
    }
    else {
      const headers = new HttpHeaders().set("x-auth-token", localStorage.getItem("token"));

      return new Promise((resolve, reject) => {
        this.http.get<JSON>(link, { headers }).subscribe((result: any) => {
          resolve(result);
        }, (error) => {
          reject(error);
        });
      });

    }
  }

  post(link: string, body: any): Promise<any> {

    if (!this.checkNetwork()) {
      this.common.showToast("Sem conexão!");
    }
    else {
      const headers = new HttpHeaders().set("x-auth-token", localStorage.getItem("token"));

      return new Promise((resolve, reject) => {
        this.http.post(link, body, { headers }).subscribe((result: any) => {
          resolve(result);
        }, (error) => {
          reject(error)
        });
      })

    }
  }

}
