
export const cepMask = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 9);
};

export const telefoneMask = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 15);
};

export const formatarMoeda = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

export const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR');
};

export const formatarWhatsAppLink = (telefone: string) => {
  const numeroLimpo = telefone.replace(/\D/g, '');
  const prefixo = numeroLimpo.startsWith('55') ? '' : '55';
  return `https://wa.me/${prefixo}${numeroLimpo}`;
};

export const formatarWhatsAppMensagem = (cliente: { nome: string; pendingValue: number }) => {
  const mensagem = `Olá ${cliente.nome}, notamos que você possui um pagamento pendente no valor de ${formatarMoeda(cliente.pendingValue)}. Por favor, entre em contato para regularizar sua situação.`;
  return encodeURIComponent(mensagem);
};
