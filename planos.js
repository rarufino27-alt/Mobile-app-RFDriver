// planos.js – definição dos planos do Fluxo Driver

const FLUXO_PLANS = {
  basico: {
    id: 'basico',
    nome: 'Básico',
    descricao: 'Controle diário simples. Ideal para quem está começando.',
    recursos: {
      // o que o BÁSICO pode
      dashboard: true,
      entradasNormais: true,
      outrasEntradas: false,
      calculadoraSimples: true,
      calculadoraPremium: false,
      // aqui você deixa futuros recursos SEMPRE como false no básico
      registroViagens: true,       // se quiser que ele use o básico de viagens
      pdfViagens: false,
      reciboComMotorista: false,
      exportCsv: false,
      multiMotorista: false,
      multiVeiculo: false,
      brandingEmpresa: false
    }
  },

  premium: {
    id: 'premium',
    nome: 'Premium',
    descricao: 'Tudo que o motorista profissional precisa no dia a dia.',
    recursos: {
      // tudo que o PREMIUM pode
      dashboard: true,
      entradasNormais: true,
      outrasEntradas: true,
      calculadoraSimples: true,
      calculadoraPremium: true,
      registroViagens: true,
      pdfViagens: true,
      reciboComMotorista: true,
      exportCsv: true,
      multiMotorista: false,
      multiVeiculo: false,
      brandingEmpresa: false
    }
  },

  pro: {
    id: 'pro',
    nome: 'Pro',
    descricao: 'Para frotas, empresas e quem precisa de tudo liberado.',
    recursos: {
      // PRO tem tudo liberado
      dashboard: true,
      entradasNormais: true,
      outrasEntradas: true,
      calculadoraSimples: true,
      calculadoraPremium: true,
      registroViagens: true,
      pdfViagens: true,
      reciboComMotorista: true,
      exportCsv: true,
      multiMotorista: true,
      multiVeiculo: true,
      brandingEmpresa: true
    }
  }
};

// pega o plano ativo (se não tiver nada salvo, cai no Premium por padrão)
function getPlanoAtivo(){
  const saved = localStorage.getItem('fluxo_plano_ativo') || 'premium';
  return FLUXO_PLANS[saved] || FLUXO_PLANS.premium;
}

// define qual plano está ativo neste aparelho
function setPlanoAtivo(idPlano){
  if(!FLUXO_PLANS[idPlano]) return;
  localStorage.setItem('fluxo_plano_ativo', idPlano);
}

// helper opcional pra ficar mais legível nos outros arquivos
function planoTem(recurso){
  const plano = getPlanoAtivo();
  return !!(plano.recursos && plano.recursos[recurso]);
}
