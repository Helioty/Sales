import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(
    private http: HttpClient,
    private common: CommonService
  ) { }

  get(link: string): Promise<any> {
    const headers = new HttpHeaders().set('x-auth-token', localStorage.getItem('token'));

    return new Promise((resolve, reject) => {
      this.http.get<JSON>(link, { headers }).subscribe((result: any) => {
        resolve(result);
      }, (error) => {
        this.showError(error);
        reject(error);
      });
    });

  }

  getNoShowError(link: string): Promise<any> {
    const headers = new HttpHeaders().set('x-auth-token', localStorage.getItem('token'));

    return new Promise((resolve, reject) => {
      this.http.get<JSON>(link, { headers }).subscribe((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });

  }

  post(link: string, body: any): Promise<any> {
    const headers = new HttpHeaders().set('x-auth-token', localStorage.getItem('token'));

    return new Promise((resolve, reject) => {
      this.http.post(link, body, { headers }).subscribe((result: any) => {
        resolve(result);
      }, (error) => {
        this.showError(error);
        reject(error);
      });
    });

  }

  showError(error: HttpErrorResponse) {
    // by Ryuge 28/11/2019
    // edit by Helio 18/03/2020
    if (error.status === 400) {
      if (error.error && error.error.detail) {
        this.common.showAlertError(error.error.title, error.error.detail);
      } else {
        this.common.showAlertError('Erro desconhecido.', JSON.stringify(error));
      }
    } else if (error.status === 404) {
      if (error.error && error.error.detail) {
        this.common.showAlertError(error.error.title, error.error.detail);
      } else if (error.error && error.error.error) {
        this.common.showAlertError(error.error.error, error.error.message);
      } else {
        this.common.showAlertError('Erro desconhecido.', JSON.stringify(error));
      }
    } else if (error.status === 503) {
      if (error.error && error.error.detail) {
        this.common.showAlertError(error.error.title, error.error.detail);
      } else {
        this.common.showAlertError('Erro desconhecido.', JSON.stringify(error));
      }
    } else if (error.status === 0) {
      this.common.showAlertError(error.statusText, error.message);
    } else {
      if (error.error && error.error.detail) {
        this.common.showAlertError(error.error.title, error.error.detail);
      } else {
        this.common.showAlertError('Erro desconhecido.', JSON.stringify(error));
      }
    }
  }

}
