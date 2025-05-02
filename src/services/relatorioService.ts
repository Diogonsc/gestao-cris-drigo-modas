import { Produto } from "@/types";
import { getProdutos } from "./mockData";

export interface DadosRelatorio {
  totalProdutos: number;
  valorTotalEstoque: number;
  produtosPorCategoria: Record<string, number>;
  produtosComEstoqueBaixo: number;
  produtosSemEstoque: number;
}

export const gerarRelatorioEstoque = (): DadosRelatorio => {
  const produtos = getProdutos();
  
  const dados: DadosRelatorio = {
    totalProdutos: produtos.length,
    valorTotalEstoque: 0,
    produtosPorCategoria: {},
    produtosComEstoqueBaixo: 0,
    produtosSemEstoque: 0,
  };

  produtos.forEach((produto) => {
    // Calcula o valor total do estoque
    dados.valorTotalEstoque += produto.preco * produto.estoque;

    // Conta produtos por categoria
    if (!dados.produtosPorCategoria[produto.categoria]) {
      dados.produtosPorCategoria[produto.categoria] = 0;
    }
    dados.produtosPorCategoria[produto.categoria]++;

    // Conta produtos com estoque baixo
    if (produto.estoque <= produto.estoqueMinimo) {
      dados.produtosComEstoqueBaixo++;
    }

    // Conta produtos sem estoque
    if (produto.estoque === 0) {
      dados.produtosSemEstoque++;
    }
  });

  return dados;
};

export const getProdutosMaisVendidos = () => {
  // TODO: Implementar quando tivermos dados de vendas
  return [];
};

export const getMovimentacaoEstoque = () => {
  // TODO: Implementar quando tivermos dados de movimentação
  return [];
}; 