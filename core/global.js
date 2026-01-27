/* =========================================================
   GLOBAL.JS — NÚCLEO DO APP RF DRIVER
   Fonte única de ESTADO e CONTROLE
========================================================= */

(function () {
  const STORAGE_KEY = "rf_driver_app_state";

  const defaultState = {
    origem: null,
    destino: null,
    valorBase: 0,
    taxas: {
      feira: false,
      excessoPessoas: false,
      animal: null,
      cancelamento: false,
      buscaLonge: false
    }
  };

  const App = {
    state: JSON.parse(JSON.stringify(defaultState)),

    init() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          this.state = JSON.parse(saved);
        } catch {
          this.reset();
        }
      }
      console.info("✅ App inicializado", this.state);
    },

    set(key, value) {
      this.state[key] = value;
      this.persist();
    },

    get(key) {
      return this.state[key];
    },

    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    },

    reset() {
      this.state = JSON.parse(JSON.stringify(defaultState));
      this.persist();
    },

    go(page) {
      window.location.href = page;
    }
  };

  window.App = App;
  App.init();
})();

