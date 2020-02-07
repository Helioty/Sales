import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
// import { Keyboard } from '@ionic-native/keyboard/ngx';
import { BaseCommon } from 'src/commons/base-common';

@Component({
  selector: 'app-produto-pesquisa',
  templateUrl: './produto-pesquisa.page.html',
  styleUrls: ['./produto-pesquisa.page.scss'],
})
export class ProdutoPesquisaPage implements OnInit {

  @ViewChild("scanner", { static: true }) scanned: any;
  public taskScanner: any;

  public valorScanner: string;

  constructor(
    public common: BaseCommon,
    // private keyboard: Keyboard,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.focusOn()
  }

  focusOn() {
    // if (this.platform.is("cordova")) {
      this.taskScanner = setInterval(() => {
        try {
          this.scanned.value = "";
          this.scanned.setFocus();
          // this.keyboard.hide();
        } catch (error) { }
      }, 300);
    // }
  }

  scaneado(evento: any) {
    console.log(evento)
    this.common.showAlertInfo(evento.target.value)
  }

}
