const PLANO_KEY = "planoAtual";

function setPlano(plano) {
  localStorage.setItem(PLANO_KEY, plano);
}

function getPlano() {
  return localStorage.getItem(PLANO_KEY) || "basic";
}

const PERMISSOES = {
  basic: [
    "dashboard",
    "entradas",
    "perfil",
    "calcSimples"
  ],
  premium: [
    "dashboard",
    "entradas",
    "perfil",
    "calcSimples",
    "calcPremium",

    "outrasEntradas",   // premium libera outras entradas

    "reciboParticular",
    "reciboParticularWhats"
  ],
  pro: [
    "dashboard",
    "entradas",
    "perfil",
    "calcSimples",
    "calcPremium",
    "outrasEntradas",

    "reciboParticular",
    "reciboParticularWhats",
    "reciboParticularPdf",

    "reciboEmpresa",
    "reciboEmpresaPdf",
    "reciboEmpresaWhats",

    "manutencao",
    "resumo"
  ]
};

function planoTem(recurso) {
  const plano = getPlano();
  if (plano === "pro") return true;
  return PERMISSOES[plano]?.includes(recurso);
}
