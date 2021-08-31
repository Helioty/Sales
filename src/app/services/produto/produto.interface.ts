export interface IProduto {
  avariadoStatus: string;
  cgcFornecedor: string;
  codProduto: string;
  codbarean13: string;
  codigo: string;
  codigoBase: string;
  codigoFC: string;
  codigoForn: string;
  codigoFornecedorBase: string;
  codigodigito: string;
  codigodigitoembalagem: string;
  conversao: number;
  desconto: number;
  descricao: string;
  descricaoForn: string;
  descricaoProd: string;
  descricaoSituacao: string;
  estoque: number;
  fantas: string;
  formaParcelamento: string;
  imagem: string;
  inalante: string;
  isProdutoBase: string;
  linha: string;
  link: string;
  precoPorUnidade: number;
  precoSemDesconto: number;
  prvd1: number;
  qtdDecimal: number;
  qtdMaxParcelas: number;
  qtdMinima: number;
  qtdImagens: number;
  qtdpages: number;
  situacao: string;
  totalElements: number;
  unidade: string;
  valorParcela: number;
}

export interface IProdutoImagem {
  codigo: string;
  descricao: string;
  imageGrande: string;
  imagePequena: string;
  sequencial: number;
}

export interface IProdutoFamilia {
  id: number;
  items: IProdutoFamiliaIT[];
  nome: string;
  qtdItems: string;
  sqltypeName: string;
  valor: string;
}

export interface IProdutoFamiliaIT {
  cor: string;
  descricao: string;
  embalagemEspecial: string;
  estoque: number;
  id_produto: string;
  imagem: string;
  preco: number;
  preco_unitario: number;
  selected: number;
  sqltypeName: string;
  valor_atributo: string;
}
