import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { PedidoHeader } from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

@Component({
  standalone: true,
  selector: 'app-pedido-resumo',
  templateUrl: './pedido-resumo.component.html',
  styleUrls: ['./pedido-resumo.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class PedidoResumoComponent implements OnInit {
  pedido: Observable<PedidoHeader>;
  totalItens: Observable<number>;

  constructor(
    private readonly pedidoService: PedidoService,
    private readonly modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.pedido = this.pedidoService.getPedidoAtivoOBS();
    this.totalItens = this.pedidoService.getTotalItensOBS();
  }

  close(): void {
    this.modalController.dismiss();
  }
}
