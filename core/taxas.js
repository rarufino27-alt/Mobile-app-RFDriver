/* =========================================================
   RF DRIVER — TABELA CENTRAL DE TAXAS
   Fonte única de regras de preço
   ========================================================= */

const Taxas = {

  /* ================= TIPO DE VIAGEM ================= */
  tipoViagem: {
    ida: 0,                 // sem acréscimo
    bateVolta: 1,         // +100% do valor base
    idaVolta: 1,            // +100% do valor base
    idaVoltaEspera: 1.2     // 2x + 10%
  },

/* ================= TAXA NOTURNA ================= */

noturno: {
  limite: 29,
  valorFixo: 4.99,
  percentual: 0.35
},

  /* ================= TAXAS FIXAS ================= */

  // Desvio simples (valor fixo)
  desvioRotaSimples: 4.99,

  // Volta da praia
  voltaPraia: 9.99,

  // Taxa de feira
  feira: 4.99,

  // Transporte de animal (fixo por porte)
  animal: {
    pequeno: 4.99,
    medio: 6.99,
    grande: 9.99,
    longa: 19.90
  },

/* ================= VEÍCULO 6 LUGARES ================= */

veiculo6Lugares: {
  percentual: 0.5
},

/* ================= ESPERA ================= */
espera: {
  minutosGratis: 4,
  valorInicial: 3,
  valorPorMinuto: 0.59
}

};

