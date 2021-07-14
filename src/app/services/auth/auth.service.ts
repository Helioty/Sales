import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { AuthGuard } from 'src/app/shared/guards/auth/auth.guard';
import { BaseService } from 'src/app/services/http/base.service';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { IAuth } from './auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly loginSubject = new BehaviorSubject<IAuth>(null);

  constructor(
    private authGuard: AuthGuard,
    private common: CommonService,
    private navControl: NavController,
    private http: BaseService
  ) {
    this.restoreLoginData();
  }

  /**
   * @author helio.souza
   * @description Executa o serviço de login em JAVA.
   * @param login login do úsuario
   * @param senha senha do úsuario
   * @returns Retorna uma Promise com o retorno do serviço.
   */
  login(login: string, senha: string, url?: string): Promise<IAuth> {
    const api = url
      ? environment.production
        ? `api.${url}/`
        : `staging.${url}/`
      : API_URL;
    const link = ENV.WS_AUTH + api + 'loginMobile';
    const options = { token: false, showError: true };
    const headers = new HttpHeaders().set('login', login).set('senha', senha);

    return new Promise((resolve, reject) => {
      this.http.get<IAuth>(link, options, headers).subscribe({
        next: (response) => {
          this.setStorage(response, login);
          this.authGuard.setStatus = true;
          console.log(response);
          resolve(response);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  /**
   * @author helio.souza
   * @description Exibe IonAlert de logout.
   */
  public showAlertLogout(): void {
    const handler = () => {
      this.authGuard.setStatus = false;
      this.navControl.navigateRoot(['login']);
    };
    const props = { titulo: 'Logout', message: 'Deseja sair?', handler };
    this.common.showAlertAction(props);
  }

  /**
   * @author helio.souza
   * @description Retorna as informações referentes ao login.
   */
  public getLoginInfo(): IAuth {
    return JSON.parse(localStorage.getItem('loginServiceData') as string) as IAuth;
  }

  /**
   * @author helio.souza
   * @description Restaura os dados do ultimo login.
   */
  private restoreLoginData(): void {
    if (localStorage.getItem('token')) {
      const loginData = JSON.parse(
        localStorage.getItem('loginServiceData') as string
      ) as IAuth;
      this.loginSubject.next(loginData);
    }
  }

  /**
   * @author helio.souza
   * @returns Observable Login User.
   */
  getLoginObservable(): Observable<IAuth> {
    return this.loginSubject.asObservable();
  }

  /**
   * @author helio.souza
   * @description Grava os dados do Login no LocalStorage.
   */
  private setStorage(data: IAuth, login: string): void {
    const date = new Date();
    localStorage.setItem('token', data.authorization);
    localStorage.setItem('login', login);
    localStorage.setItem('loginDate', String(date.toLocaleString()));
    localStorage.setItem('empresa', String(data.empresa.id));
    localStorage.setItem('loginServiceData', JSON.stringify(data));
    localStorage.setItem('matricula', String(data.matricula));
    localStorage.setItem('id', String(data.id));
    localStorage.setItem('tms', String(data.empresa.usaFreteTMS));
    this.loginSubject.next(data);
  }
}
