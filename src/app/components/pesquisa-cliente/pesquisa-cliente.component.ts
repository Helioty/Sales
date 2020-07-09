import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pesquisa-cliente',
  templateUrl: './pesquisa-cliente.component.html',
  styleUrls: ['./pesquisa-cliente.component.scss'],
})
export class PesquisaClienteComponent implements OnInit {

  // Data passed in by componentProps
  @Input() firstName: string;
  @Input() lastName: string;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  close() {
    this.modalCtrl.dismiss({
      existePesquisa: true,
      retorna: 'retorno aqui!'
    });
  }

}
