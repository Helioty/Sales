export class FormaPagamento {
  codigo: string;
  descricao: string;
  parcelas: number;
  valorParcelas: number;
}

// by Helio 27/03/2020
export class OpcaoParcela {
  id: string;
  descricao: string;
  tipoDoc: string;
  qtdParcelas: number;
  pctEntrada: number;
  valorEntrada: number;
  valorParcelas: number;
  taxaJuros: number;
  isEntrada: string;
}
