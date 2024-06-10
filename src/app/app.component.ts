import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import {
  IonicModule,
  IonicRouteStrategy,
  MenuController,
  Platform,
} from '@ionic/angular';
import { MenuComponent } from './components/menu/menu.component';
import { AppConfigService } from './config/app.config.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: [
    `
      app-menu {
        height: 100%;
      }
    `,
  ],
  imports: [CommonModule, IonicModule, MenuComponent, ReactiveFormsModule],
  providers: [
    AppConfigService,
    { provide: RouteReuseStrategy, useValue: IonicRouteStrategy },
  ],
})
export class AppComponent {
  constructor(
    private readonly platform: Platform,
    private readonly menu: MenuController
  ) {
    this.initializeApp();
  }

  /**
   * @description Executa codigos nativos após inicialização.
   */
  private initializeApp(): void {
    this.platform.ready().then(() => {
      this.menu.enable(false);
    });
  }
}
