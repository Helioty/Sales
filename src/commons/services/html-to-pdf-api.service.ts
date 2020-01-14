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

// import { request } from 'require';

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
    public common: BaseCommon
  ) {

  }

  async api() {
    // let opts = {
    let url = 'https://api.sejda.com/v2/html-pdf';
    // let headers = {
    //   'Authorization': 'Token: ' + this.ApiKey,
    // };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Token: ' + this.ApiKey })
    let json: {
      'url': 'google.com',
      'viewportWidth': 1200
    }

    let result;
    this.http.post("https://api.sejda.com/v2/html-pdf", { "url": "https://airtable.com" }, { headers }).subscribe(res => {
      result = res;
      console.log(result)
    })

  }

}
