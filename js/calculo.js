(function () {

  const Calculo = {

    feira() { return 5; },

    excessoPessoas(valorBase) {
      return valorBase <= 30 ? 5 : valorBase * 0.5;
    },

    animal(tipo) {
      if (tipo === "pequeno") return 4.99;
      if (tipo === "medio") return 6.99;
      if (tipo === "grande") return 9.99;
      return 0;
    },

    buscaLonge(valorBase) {
      return valorBase * 0.5;
    },

    saidaPraia() {
      return 9.99;
    },

    desvioSimples() { return 4.99; },

    desvioComEspera(minutos) {
      return minutos >= 5 ? 10 : 0;
    },

    desvioMultiplosTrechos(valores) {
      return valores.reduce((s, v) => s + Number(v || 0), 0);
    },

    adicionalNoturno(valorBase, data = new Date()) {
      const min = data.getHours() * 60 + data.getMinutes();
      const inicio = 22 * 60 + 30;
      const fim = 5 * 60;
      const noturno = min >= inicio || min <= fim;
      if (!noturno) return 0;
      return valorBase <= 29 ? 5 : valorBase * 0.35;
    },

    calcularTotal({ valorBase, taxas, data = new Date() }) {

      let base = taxas.idaVolta ? valorBase * 2 : valorBase;
      let adicionais = 0;
      let adiantamento = 0;

      if (taxas.feira) adicionais += this.feira();
      if (taxas.excessoPessoas) adicionais += this.excessoPessoas(base);
      if (taxas.animal) adicionais += this.animal(taxas.animal);
      if (taxas.buscaLonge) adiantamento = this.buscaLonge(base);
      if (taxas.saidaPraia) adicionais += this.saidaPraia();

      if (taxas.desvioSimples) adicionais += this.desvioSimples();
      if (taxas.desvioComEspera)
        adicionais += this.desvioComEspera(taxas.tempoEspera || 0);
      if (taxas.desvioTrechos?.length)
        adicionais += this.desvioMultiplosTrechos(taxas.desvioTrechos);

      adicionais += this.adicionalNoturno(base, data);

      return {
        valorBaseOriginal: valorBase,
        valorBaseCalculado: base,
        adicionais,
        adiantamento,
        totalFinal: base + adicionais,
        valorRestante: base + adicionais - adiantamento
      };
    }
  };

  window.Calculo = Calculo;

})();


