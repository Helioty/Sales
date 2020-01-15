import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BaseCommon } from '../base-common';

import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { promise } from 'protractor';

// import { request } from 'require';

import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})

export class HTMLToPDFAPIService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): import("rxjs").Observable<HttpEvent<any>> {
    const dupReq = req.clone({
      headers: req.headers.set('Authorization', 'Token: ' + this.ApiKey),
    });
    return next.handle(dupReq);
    // throw new Error("Method not implemented.");
  }

  private ApiKey = "api_9472C6123CEC4DD2BF4123D75FF9A9AF";

  constructor(
    public http: HttpClient,
    private ionhttp: HTTP,
    public common: BaseCommon,
  ) {

  }

  async api() {
    this.common.showLoader()
    let url = 'http://10.131.9.81:8080/pdf';

    let json: any = {
      // rejectUnauthorized: false,
      // publishableKey: 'api_public_d82d653e17014ad59e6c5d0f560782a7',
      uri: 'https://api.sejda.com/v2/html-pdf',
      headers: {
        'Authorization': 'Token: ' + 'api_9472C6123CEC4DD2BF4123D75FF9A9AF',
      },
      json: {
        'url': 'https://ionicframework.com/',
        'viewportWidth': 2560
      }
    }

    
    const headers = new HttpHeaders().set('Content-type', 'application/json')

    this.http.post<JSON>(url, json, { headers: headers }).subscribe(res => {
      console.log(res);
      let s: any = res;
      this.common.loading.dismiss();
      if (s.status == 200) {
        this.common.showAlert(s.title, s.text)
      }
      return res
    }, (error) => {
      console.log(error)
      this.common.loading.dismiss();
      alert(error.message)
    });

    // await new Promise((resolve, reject) => { 
    //   this.http.post<any>(url, {}).subscribe(res => {
    //     resolve(result = res);
    //     console.log(result)
    //   }, (error) => {
    //     reject(console.log(error))
    //   })
    // });

    // this.ionhttp.get('http://ionic.io', {}, {})
    //   .then(data => {
    //     console.log(data)
    //     // console.log(data.status);
    //     // console.log(data.data); // data received by server
    //     // console.log(data.headers);

    //   })
    //   .catch(error => {

    //     console.log(error)
    //     // console.log(error.status);
    //     // console.log(error.error); // error message as string
    //     // console.log(error.headers);

    //   });

    // var http = new XMLHttpRequest();
    // // var url = 'get_data.php';
    // // var params = 'orem=ipsum&name=binny';
    // http.open('POST', url, true);

    // //Send the proper header information along with the request
    // http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // http.onreadystatechange = function () {//Call a function when the state changes.
    //   if (http.readyState == 4 && http.status == 200) {
    //     alert(http.responseText);
    //   }
    // }
    // http.send();

  }

}
