import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IAuth } from 'src/app/services/auth/auth.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-login-validate',
  templateUrl: './login-validate.component.html',
  styleUrls: ['./login-validate.component.scss'],
})
export class LoginValidateComponent implements OnInit {
  public loginData = { login: '', senha: '' };

  constructor(
    private readonly auth: AuthService,
    private readonly common: CommonService,
    private readonly modal: ModalController
  ) {}

  ngOnInit(): void {}

  /**
   * @description Executa o serviço de Login.
   */
  async entrar(data: { login: string; senha: string }): Promise<void> {
    await this.common.showLoader();
    this.auth.loginAPI(data.login.toUpperCase(), data.senha).subscribe({
      next: (user: IAuth) => {
        this.common.loading.dismiss();
        this.close(true, user);
      },
      error: () => {
        this.common.loading.dismiss();
        this.loginData.senha = '';
      },
    });
  }

  /**
   * @author helio.souza
   * @param selected Flag para informar se existe retorno. Default: false.
   * @param user Dados do úsuario selecionado.
   */
  close(selected = false, user: IAuth = null): void {
    this.modal.dismiss({
      existePesquisa: selected,
      retorno: user,
    });
  }
}
