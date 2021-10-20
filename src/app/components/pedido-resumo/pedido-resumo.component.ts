import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { PedidoHeader } from 'src/app/services/pedido/pedido.interface';

@Component({
  selector: 'app-pedido-resumo',
  templateUrl: './pedido-resumo.component.html',
  styleUrls: ['./pedido-resumo.component.scss'],
})
export class PedidoResumoComponent implements OnInit {
  pedido: Observable<PedidoHeader>;
  constructor(private readonly pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.pedido = this.pedidoService.getPedidoAtivoOBS();
  }
}
