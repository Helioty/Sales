import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-selecionar-endereco',
  templateUrl: './selecionar-endereco.component.html',
  styleUrls: ['./selecionar-endereco.component.scss'],
})
export class SelecionarEnderecoComponent implements OnInit {

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
