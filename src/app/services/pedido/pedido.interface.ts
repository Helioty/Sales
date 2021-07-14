export class PedidoHeader {
  recnum: number;
  cod_empresa: number;
  numpedido: number;
  nome_cliente: string;
  codvend: number;
  condpag: string;
  descricao_condpag: string;
  qtdParcelas: number;
  msgJuros: string;
  tipodoc: string;
  descricao_tipodoc: string;
  totpedido: number;
  numitens: number;
  cgccpf_cliente: string;
  qtdpages: number;
  totalElements: number;
  dataEmissao: string;
  tipoEntrega: TiposEntrega;
  status: string;
  hora: string;
  seqEnderecoEntrega: number;
  frete: any;
  icmsRetido: number;
  valorTotalPedido: number;
  digito: number;
  cartaoPedido: number;
  barCodecartaoPedido: string;
  informarCliente: string;
  pesoTotal: number;
  descontoBrinde: number;
  user_allow_desconto: number;
  valorDesconto: number;
  percDesconto: number;
  valorEntrada: number;
  valorParcela: number;
  totalProdutos: number;
  canalVenda: number;
  sqltypeName: any;
}

export enum TiposEntrega {
  IMEDIATA = 'IMEDIATA',
  POSTERIOR = 'POSTERIOR',
  ENTREGA = 'ENTREGA',
}

export class PedidoItens {
  idEmpresa: number;
  numPedido: number;
  idProduto: string;
  descricao: string;
  embalagem: number;
  retiradas: Retiradas[];
  qtdTotal: number;
  prcUnitario: number;
  prcTotal: number;
  imagem: string;
  sqltypeName: string;
}

export class Retiradas {
  empresaRetirada: number;
  idDeposito: number;
  tipoRetirada: number;
  qtd: number;
  precoUnitario: number;
  sqltypeName: string;
}

export class PedidoTable {
  name: string; // Atributo do objeto AtualizaPedido
  value: string; // Valor do atributo
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
