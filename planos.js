/* =====================================================
   CHAVE PRINCIPAL (plano REAL comprado)
===================================================== */
const PLANO_KEY = "planoAtual";

/* planoREAL (free, basico, premium, pro) */
function setPlano(plano) {
  localStorage.setItem(PLANO_KEY, plano);
}

function getPlano() {
  return localStorage.getItem(PLANO_KEY) || "free";
}


/* =====================================================
   PERMISSÕES
===================================================== */
const permissoes = {
  free:{
    dashboard:"locked",
    entradas:"partial",
    entradas_corridas:"full",
    entradas_outras:"locked",
    entradas_saidas:"locked",
    empresas:"locked",
    particular:"locked",
    manutencao:"locked",
    resumo:"locked",
    perfil:"locked",
    calculadora:"locked"
  },
  basico:{
    dashboard:"full",
    entradas:"partial",
    entradas_corridas:"full",
    entradas_outras:"locked",
    entradas_saidas:"full",
    empresas:"locked",
    particular:"locked",
    manutencao:"locked",
    resumo:"locked",
    perfil:"full",
    calculadora:"locked"
  },
  premium:{
    dashboard:"full",
    entradas:"full",
    entradas_corridas:"full",
    entradas_outras:"full",
    entradas_saidas:"full",
    empresas:"locked",
    particular:"partial",
    manutencao:"locked",
    resumo:"locked",
    perfil:"full",
    calculadora:"full"
  },
  pro:{
    dashboard:"full",
    entradas:"full",
    entradas_corridas:"full",
    entradas_outras:"full",
    entradas_saidas:"full",
    empresas:"full",
    particular:"full",
    manutencao:"full",
    resumo:"full",
    perfil:"full",
    calculadora:"full"
  }
};


/* =====================================================
   TRIAL PRO – 24h
===================================================== */
function iniciarTrial24h(planoDepois){
  const agora = Date.now();
  const fim = agora + 24*60*60*1000;

  // NÃO altera planoReal
  // apenas ativa o modo trial PRO
  localStorage.setItem("trialEnd", fim);
  localStorage.setItem("planAfterTrial", planoDepois);
  localStorage.setItem("trial", "on");

  alert("🎉 Você ganhou 24h com acesso total ao Plano PRO!");
}


/* =====================================================
   VERIFICAÇÃO DIÁRIA
===================================================== */
function checarTrial(){
  const trialEnd = localStorage.getItem("trialEnd");
  if(!trialEnd) return;

  const agora = Date.now();

  if(agora > trialEnd){
    const voltar = localStorage.getItem("planAfterTrial") || "free";

    setPlano(voltar);

    localStorage.removeItem("trial");
    localStorage.removeItem("trialEnd");
    localStorage.removeItem("planAfterTrial");
  }
}


/* =====================================================
   PRIMEIRA VEZ NO APP
===================================================== */
function iniciarTrialSePrimeiraVez(){
  if(localStorage.getItem("jaEntrou")) return;

  iniciarTrial24h("free");
  localStorage.setItem("jaEntrou","sim");
}


/* =====================================================
   FUNÇÕES DE APOIO AO HTML
===================================================== */

// retorna o plano ativo (PRO se estiver em trial)
function planoAtivo(){
  const isTrial = localStorage.getItem("trial")==="on";
  if(isTrial) return "pro";
  return getPlano();
}

// retorna permissao considerando o plano ativo
function getPermissao(feature){
  const plano = planoAtivo();
  return permissoes[plano][feature];
}
