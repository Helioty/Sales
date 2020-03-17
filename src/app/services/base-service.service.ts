import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { CommonService } from 'src/app/services/common/common.service';

import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(
    private http: HttpClient,
    private common: CommonService
  ) { }

  get(link: string): Promise<any> {
    const headers = new HttpHeaders().set("x-auth-token", localStorage.getItem("token"));

    return new Promise((resolve, reject) => {
      this.http.get<JSON>(link, { headers }).subscribe((result: any) => {
        resolve(result);
      }, (error) => {
        this.showError(error);
        reject(error);
      });
    });

  }

  post(link: string, body: any): Promise<any> {
    const headers = new HttpHeaders().set("x-auth-token", localStorage.getItem("token"));

    return new Promise((resolve, reject) => {
      this.http.post(link, body, { headers }).subscribe((result: any) => {
        resolve(result);
      }, (error) => {
        this.showError(error);
        reject(error);
      });
    });

  }

  // by Helio 10/03/2020
  showError(error: any) {
    // by Ryuge 28/11/2019
    if (error.status === 400) {
      console.log(error)
      // await this.showMessage(error.json().title, error.json().detail);
      if (error.error.detail) {
        this.common.showAlert(error.error.title, error.error.detail);
      } else {
        this.common.showAlert('Atenção!', JSON.stringify(error));
      }
    } else if (error.status === 503) {
      this.common.showAlert('Atenção!', 'Sem serviço, entrar em contato com suporte.');
    } else {
      if (error.error.detail) {
        this.common.showAlert(error.error.title, error.error.detail);
      } else {
        this.common.showAlert('Atenção!', JSON.stringify(error));
      }
    }
  }

}
