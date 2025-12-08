/* =====================================================
   CHAVE PRINCIPAL (plano REAL)
===================================================== */
const PLANO_KEY = "planoAtual";

/* plano REAL */
function setPlano(plano){
  localStorage.setItem(PLANO_KEY,plano);
}
function getPlano(){
  return localStorage.getItem(PLANO_KEY) || "free";
}

/* =====================================================
   PERMISSÕES por PLANO
===================================================== */
const permissoes = {

  free:{
    caixa:"partial", // somente corridas
    entradas_corridas:"full",
    entradas_outras:"locked",
    entradas_saidas:"locked",

    dashboard:"locked",
    resumo:"locked",
    perfil:"locked",

    particular:"locked",
    empresas:"locked",
    manutencao:"locked",
    calculadora:"locked"
  },

  basico:{
    caixa:"full",
    entradas_corridas:"full",
    entradas_outras:"full",
    entradas_saidas:"full",

    dashboard:"full",
    resumo:"full",
    perfil:"full",

    particular:"locked",
    empresas:"locked",
    manutencao:"locked",
    calculadora:"locked"
  },

  premium:{
    caixa:"full",
    entradas_corridas:"full",
    entradas_outras:"full",
    entradas_saidas:"full",

    dashboard:"full",
    resumo:"full",
    perfil:"full",

    particular:"full",
    empresas:"locked",
    manutencao:"locked",
    calculadora:"full"
  },

  pro:{
    caixa:"full",
    entradas_corridas:"full",
    entradas_outras:"full",
    entradas_saidas:"full",

    dashboard:"full",
    resumo:"full",
    perfil:"full",

    particular:"full",
    empresas:"full",
    manutencao:"full",
    calculadora:"full"
  }
};

/* =====================================================
   ATIVO
===================================================== */
function planoAtivo(){
  return getPlano();
}
function getPermissao(feature){
  const p = planoAtivo();
  return permissoes[p][feature];
}
