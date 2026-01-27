const DataManager = {
  rotas: [],

  arquivos: [
  "./data/locais.json",
  "./data/praias.json",
  "./data/empresas.json",
  "./data/engenhos.json",
  "./data/interurbanas.json",
  "./data/interestaduais.json",
  "./data/lazer-festa.json",
  "./data/hospitais-clinicas.json",
  "./data/longas-locais.json",
  "./data/mercado.json",
  "./data/shoppings.json"
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
    const origens = [...new Set(this.rotas.map(r => r.origem))];
    return origens.sort();
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

    // rota invertida (ida/volta)
    if (!rota) {
      rota = this.rotas.find(
        r => r.origem === destino && r.destino === origem
      );
    }

    return rota ? rota.valor : null;
  }
};

