const DataManager = {
  rotas: [],

  arquivos: [
    "./data/condominio-porto-do-cabo.json",
    "./data/lote-garapu2-lote-dona-amara.json",
    "./data/cohab.json",
    "./data/centro-do-cabo.json",
    "./data/shopping-costa-dourada.json",
    "./data/aguia-american-club-br-101.json",
    "./data/empresas.json",
    "./data/engenhos.json",
    "./data/hospitais-clinicas.json",
    "./data/interurbanas.json",
    "./data/interestaduais.json",
    "./data/lazer-festa.json",
    "./data/locais.json",
    "./data/longas-locais.json",
    "./data/praias.json",
    "./data/bairro-sao-francisco-baixo.json"
  ],

  async carregar() {
    try {
      const respostas = await Promise.all(
        this.arquivos.map(a =>
          fetch(a).then(r => {
            if (!r.ok) throw new Error("Falha ao carregar " + a);
            return r.json();
          })
        )
      );

      this.rotas = respostas.flat();
      console.log("✅ Rotas carregadas:", this.rotas.length);
    } catch (e) {
      console.error("❌ Erro ao carregar rotas", e);
      throw e;
    }
  },

  listarOrigens() {
    return [...new Set(this.rotas.map(r => r.origem))].sort();
  },

  listarDestinos(origem) {
    return this.rotas
      .filter(r => r.origem === origem)
      .map(r => r.destino);
  },

  buscarValor(origem, destino) {
    let rota = this.rotas.find(
      r => r.origem === origem && r.destino === destino
    );

    if (!rota) {
      rota = this.rotas.find(
        r => r.origem === destino && r.destino === origem
      );
    }

    return rota ? Number(rota.valor) : null;
  },

  calcularValorCompleto(origem, parada, destino) {

    if (!origem || !destino) return null;

    // sem parada
    if (!parada) {
      return this.buscarValor(origem, destino);
    }

    // com parada
    const trecho1 = this.buscarValor(origem, parada);
    const trecho2 = this.buscarValor(parada, destino);

    if (trecho1 === null || trecho2 === null) return null;

    return trecho1 + trecho2;
  }
};