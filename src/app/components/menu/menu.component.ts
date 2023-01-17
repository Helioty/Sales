import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IAuth } from 'src/app/services/auth/auth.interface';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [CommonModule, IonicModule, RouterModule],
})
export class MenuComponent implements OnInit {
  public readonly appPages = [
    {
      title: 'Pedidos',
      url: '/pedido-lista',
      icon: 'clipboard-outline',
    },
    {
      title: 'Consulta Cep',
      url: '/consulta-cep/consulta',
      icon: 'location-outline',
    },
    {
      title: 'Consulta Produtos',
      url: '/indicador-vendedor',
      icon: 'cube-outline',
    },
    {
      title: 'Desempenho',
      url: '/indicador-vendedor',
      icon: 'stats-chart',
    },
  ];

  public foto: string;
  public nome: string;
  public noPhoto = true;

  constructor(private readonly auth: AuthService) {}

  ngOnInit(): void {
    this.auth.loginSubject.subscribe({
      next: (login: IAuth) => this.restoreLoginInfo(login),
    });
  }

  /**
   * @author helio.souza
   * @description Abre o alert de logout.
   */
  logout(): void {
    this.auth.showAlertLogout();
  }

  /**
   * @author helio.souza
   * @description Pega as informações para exibição.
   */
  private restoreLoginInfo(loginData: IAuth): void {
    this.nome = loginData.nomeDisplay;
    this.foto = loginData.foto;
    if (loginData.foto) {
      this.noPhoto = false;
    }
  }
}
