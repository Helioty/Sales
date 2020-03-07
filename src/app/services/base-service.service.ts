import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";

import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(
    private http: HttpClient
  ) { }

  get(link: string): Promise<any> {
    const headers = new HttpHeaders().set("x-auth-token", localStorage.getItem("token"));

    return new Promise((resolve, reject) => {
      this.http.get<JSON>(link, { headers }).subscribe((result: any) => {
        resolve(result);
      }, (error) => {
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
        reject(error);
      });
    });

  }

}
