import { Produto } from "@/types";
import { getProdutos, atualizarProduto } from "./mockData";

export const registrarEntradaEstoque = (produtoId: string, quantidade: number) => {
  const produtos = getProdutos();
  const produto = produtos.find(p => p.id === produtoId);
  
  if (produto) {
    const produtoAtualizado = {
      ...produto,
      estoque: produto.estoque + quantidade,
      dataAtualizacao: new Date().toISOString()
    };
    
    atualizarProduto(produtoAtualizado);
    return produtoAtualizado;
  }
  
  return null;
};

export const registrarSaidaEstoque = (produtoId: string, quantidade: number) => {
  const produtos = getProdutos();
  const produto = produtos.find(p => p.id === produtoId);
  
  if (produto && produto.estoque >= quantidade) {
    const produtoAtualizado = {
      ...produto,
      estoque: produto.estoque - quantidade,
      dataAtualizacao: new Date().toISOString()
    };
    
    atualizarProduto(produtoAtualizado);
    return produtoAtualizado;
  }
  
  return null;
};

export const getProdutosComEstoqueBaixo = () => {
  const produtos = getProdutos();
  return produtos.filter(p => p.estoque <= p.estoqueMinimo);
};

export const atualizarEstoqueViaCSV = (csvData: string) => {
  try {
    const linhas = csvData.split('\n');
    const produtos = getProdutos();
    let atualizados = 0;
    
    for (let i = 1; i < linhas.length; i++) { // Pula o cabeçalho
      const [sku, quantidade] = linhas[i].split(',');
      const produto = produtos.find(p => p.sku === sku);
      
      if (produto) {
        const produtoAtualizado = {
          ...produto,
          estoque: parseInt(quantidade),
          dataAtualizacao: new Date().toISOString()
        };
        
        if (atualizarProduto(produtoAtualizado)) {
          atualizados++;
        }
      }
    }
    
    return {
      sucesso: true,
      mensagem: `${atualizados} produtos atualizados com sucesso.`,
      total: atualizados
    };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: "Erro ao processar o arquivo CSV.",
      total: 0
    };
  }
}; 