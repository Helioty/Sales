import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private logSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly nav: NavController,
    private readonly common: CommonService
  ) {}

  canActivate(): boolean {
    if (!this.logSubject.value) {
      this.common.showAlert('Atenção!', 'Login necessário!');
      this.nav.navigateRoot('/');
    }
    return this.logSubject.value;
  }

  /**
   * @description Retorna o estado do login.
   */
  get logStatus(): boolean {
    return this.logSubject.value;
  }

  /**
   * @description Seta o estado do login.
   */
  set setStatus(st: boolean) {
    this.logSubject.next(st);
  }
}
