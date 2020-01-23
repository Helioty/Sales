import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { Network } from "@ionic-native/network/ngx";
import { Platform } from "@ionic/angular";
import { BaseCommon } from '../../commons/base-common';

import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import { resolve } from 'url';
import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/config/app.config';


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

  public checkNetwork() {
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


  // metodo especifio para cadastro cliente
  // getNoAlert(parameters: string) {
  //   if (!this.checkNetwork()) {
  //     this.common.showToast("Sem conexão!");
  //   } else {
  //     return new Promise((resolve, reject) => {
  //       let Headers = new HttpHeaders();
  //       // headers
  //       Headers.append("x-auth-token", localStorage.getItem("token"));
  //       let options = new HttpRequest({ headers: Headers, reportProgress: true });
  //       let result = this.http
  //         .get(parameters, options)
  //         .subscribe(
  //           (result: any) => {
  //             resolve(result);
  //           },
  //           error => {
  //             reject(error);
  //             try {
  //               this.common.loading.dismiss();
  //             } catch (err) { }
  //           }
  //         );
  //     });
  //   }
  // }


  get(link: string) {

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

  post(link: string, body: {}) {

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


  private handleError(error: any) {
    try {
      this.common.loading.dismiss();
    } catch (err) { }
    this.common.showAlert(error.json().title, error.json().detail);
  }


}
