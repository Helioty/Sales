export class Produto {
    cod_produto: string;
    codigo: string;
    descricao: string;
    linha: string;
    codigoForn: string;
    descricaoForn: string;
    fantas: string;
    unidade: string;
    prvd1: number;
    codbarean13: string;
    qtd_imagens: number;
    qtdpages: number;
    totalElements: number;
    avariadoStatus: any;
    qtdMaxParcelas: number;
    valorParcela: number;
    formaParcelamento: string;
    imagem: string;
    inalante: null;
    codigoFC: string;
    codigodigito: string;
    codigodigitoembalagem: string;
    estoque: number;
    situacao: string;
    precoSemDesconto: number;
    descricao_prod: string;
    descricao_situacao: string;
    desconto: number;
    qtdDecimal: number;
    precoPorUnidade: number;
    link: string;
    isProdutoBase: string;
    cgc_fornecedor: string;
    codigoBase: string;
    codigoFornecedorBase: string;
}

export class ProdutoFamilia {
    id: number;
    items: any[];
    nome: string;
    qtdItems: string;
    sqltypeName: string;
    valor: string;
}

export class ProdutoDepositoRetirada {
    cdIndLoja: any;
    deposito: string;
    descricao: string;
    empresa: string;
    encarregado: string;
    estoque: number;
    impressora: string;
    opcaoRetirada: any;
    ordem: string;
    qtdMovimentada: number;
    qtdPedido: number;
    siglafilial: string;
    tipoEntrega: string;
    transfereAutomatico: string;
}
