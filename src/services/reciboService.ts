
import { Cliente, Compra } from '@/types';
import { toPDF } from 'react-to-pdf';
import { formatarMoeda, formatarData } from '@/utils/masks';
import { getEmpresa } from './mockData';

// Função para gerar recibo em PDF
export const gerarRecibo = async (cliente: Cliente, compra: Compra): Promise<void> => {
  // Criar elemento HTML temporário para o recibo
  const reciboElement = document.createElement('div');
  reciboElement.style.padding = '40px';
  reciboElement.style.maxWidth = '800px';
  reciboElement.style.margin = '0 auto';
  reciboElement.style.fontFamily = 'sans-serif';
  
  const empresa = getEmpresa();
  
  // Montar estrutura do recibo
  reciboElement.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="margin: 0; font-size: 24px; color: #333;">${empresa.nome}</h1>
      <p style="margin: 5px 0;">${empresa.email} | ${empresa.telefone}</p>
      <h2 style="margin: 20px 0; font-size: 20px; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px;">RECIBO DE PAGAMENTO</h2>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h3 style="margin: 0; font-size: 16px;">DADOS DO CLIENTE</h3>
      <p><strong>Nome:</strong> ${cliente.nome}</p>
      <p><strong>E-mail:</strong> ${cliente.email}</p>
      <p><strong>Telefone:</strong> ${cliente.telefone}</p>
      <p><strong>Endereço:</strong> ${cliente.endereco.logradouro}, ${cliente.endereco.numero}${cliente.endereco.complemento ? ', ' + cliente.endereco.complemento : ''} - ${cliente.endereco.bairro}, ${cliente.endereco.cidade}/${cliente.endereco.estado}</p>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h3 style="margin: 0; font-size: 16px;">DADOS DA COMPRA</h3>
      <p><strong>Data:</strong> ${formatarData(compra.dataCompra)}</p>
      <p><strong>Forma de pagamento:</strong> ${compra.tipoPagamento === 'avista' ? 'À vista' : `Parcelado em ${compra.numeroParcelas}x`}</p>
    </div>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
      <thead>
        <tr style="background-color: #f3f3f3;">
          <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Produto</th>
          <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Quantidade</th>
          <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Valor Unitário</th>
          <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Valor Total</th>
        </tr>
      </thead>
      <tbody>
        ${compra.produtos.map(item => `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${item.produto.nome}</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.quantidade}</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatarMoeda(item.valorUnitario)}</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatarMoeda(item.valorTotal)}</td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>Total:</strong></td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>${formatarMoeda(compra.valorTotal)}</strong></td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>Valor Pago:</strong></td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>${formatarMoeda(compra.valorPago)}</strong></td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>Valor Pendente:</strong></td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>${formatarMoeda(compra.valorTotal - compra.valorPago)}</strong></td>
        </tr>
      </tfoot>
    </table>
    
    <div style="margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px; text-align: center;">
      <p style="margin-bottom: 40px;">Documento gerado em ${new Date().toLocaleString('pt-BR')}</p>
      <div style="margin-bottom: 10px; border-bottom: 1px solid #333; width: 250px; display: inline-block;"></div>
      <p>${empresa.nome}</p>
    </div>
  `;
  
  // Adicionar temporariamente à página
  document.body.appendChild(reciboElement);
  
  try {
    // Gerar PDF
    await toPDF(reciboElement, {
      filename: `recibo_${compra.id}_${new Date().getTime()}.pdf`,
      page: {
        margin: 20,
        format: 'a4',
      }
    });
  } finally {
    // Remover elemento temporário
    document.body.removeChild(reciboElement);
  }
};
