
import { ViaCepResponse } from "@/types";

export const buscarCep = async (cep: string): Promise<ViaCepResponse> => {
  const cepLimpo = cep.replace(/\D/g, '');
  
  if (cepLimpo.length !== 8) {
    return Promise.reject('CEP deve conter 8 dígitos');
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return Promise.reject('CEP não encontrado');
    }
    
    return data;
  } catch (error) {
    return Promise.reject('Erro ao buscar CEP');
  }
};
