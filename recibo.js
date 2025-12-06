// recibo.js
// Lógica da página de recibo: tema, formulário, cálculos, histórico

(function () {
  const $ = (id) => document.getElementById(id);

  const KEY_PERFIL = "perfilRecibo";
  const KEY_HISTORICO = "recibosHistorico";

  // =============== THEME ===============
  function applyTheme(theme) {
    const btn = $("toggleTheme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      if (btn) btn.innerText = "☀️";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      if (btn) btn.innerText = "🌙";
    }
  }

  function initTheme() {
    const saved = localStorage.getItem("theme") || "light";
    applyTheme(saved);
    const btn = $("toggleTheme");
    if (btn) {
      btn.onclick = () => {
        const isDark = document.documentElement.classList.contains("dark");
        applyTheme(isDark ? "light" : "dark");
      };
    }
  }

  // =============== PERMISSÃO DO PLANO ===============
  function checkPlano() {
    if (typeof planoTem === "function") {
      if (!planoTem("reciboComMotorista")) {
        alert("Este recurso está disponível apenas no Plano PRO.");
        location.href = "planos.html";
      }
    }
  }

  // =============== PERFIL EMPRESA/MOTORISTA ===============
  function loadPerfil() {
    try {
      return JSON.parse(localStorage.getItem(KEY_PERFIL) || "{}");
    } catch (e) {
      return {};
    }
  }

  function savePerfil(perfil) {
    localStorage.setItem(KEY_PERFIL, JSON.stringify(perfil));
  }

  function preencherPerfil() {
    const p = loadPerfil();
    $("empresa").value = p.empresa || "";
    $("cnpj").value = p.cnpj || "";
    $("motorista").value = p.motorista || "";
    $("cpf").value = p.cpf || "";
    $("marca").value = p.marca || "";
    $("modelo").value = p.modelo || "";
    $("placa").value = p.placa || "";
    $("cor").value = p.cor || "";
  }

  function initPerfil() {
    preencherPerfil();
    $("savePerfil").onclick = () => {
      const perfil = {
        empresa: $("empresa").value.trim(),
        cnpj: $("cnpj").value.trim(),
        motorista: $("motorista").value.trim(),
        cpf: $("cpf").value.trim(),
        marca: $("marca").value.trim(),
        modelo: $("modelo").value.trim(),
        placa: $("placa").value.trim(),
        cor: $("cor").value.trim(),
      };

      if (!perfil.motorista || !perfil.cpf || !perfil.marca || !perfil.modelo || !perfil.placa || !perfil.cor) {
        alert("Preencha todos os campos obrigatórios do motorista e veículo.");
        return;
      }

      savePerfil(perfil);
      alert("Dados salvos com sucesso!");
    };
  }

  // =============== FUNCIONÁRIOS DINÂMICOS ===============
  function criarCardFuncionario(index) {
    const div = document.createElement("div");
    div.className = "func-card";
    div.dataset.index = index;

    div.innerHTML = `
      <div class="func-title">Funcionário ${index + 1}</div>
      <label>Nome</label>
      <input class="func-nome">
      <label>Empresa</label>
      <input class="func-empresa">
      <label>Local de embarque</label>
      <input class="func-local">
      <label>Horário de embarque</label>
      <input class="func-horario" type="time">
      <label>Houve atraso?</label>
      <select class="func-atraso">
        <option value="nao">Não</option>
        <option value="sim">Sim</option>
      </select>
    `;
    return div;
  }

  function reindexarFuncionarios() {
    const container = $("listaFuncionarios");
    const cards = container.querySelectorAll(".func-card");
    cards.forEach((card, idx) => {
      card.dataset.index = idx;
      const title = card.querySelector(".func-title");
      if (title) title.textContent = `Funcionário ${idx + 1}`;
    });
  }

  function initFuncionarios() {
    const container = $("listaFuncionarios");

    function add() {
      const idx = container.querySelectorAll(".func-card").length;
      const card = criarCardFuncionario(idx);
      container.appendChild(card);
    }

    function remove() {
      const cards = container.querySelectorAll(".func-card");
      if (!cards.length) return;
      container.removeChild(cards[cards.length - 1]);
      reindexarFuncionarios();
    }

    // deixa ao menos 1 funcionário por padrão
    add();

    $("btnAddFunc").onclick = add;
    $("btnRemoveFunc").onclick = remove;
  }

  function coletarFuncionarios() {
    const container = $("listaFuncionarios");
    const cards = container.querySelectorAll(".func-card");
    const lista = [];
    cards.forEach((card) => {
      const nome = card.querySelector(".func-nome").value.trim();
      const empresa = card.querySelector(".func-empresa").value.trim();
      const local = card.querySelector(".func-local").value.trim();
      const horario = card.querySelector(".func-horario").value.trim();
      const atraso = card.querySelector(".func-atraso").value;

      if (!nome && !empresa && !local && !horario) {
        return;
      }

      lista.push({
        nome,
        empresa,
        localEmbarque: local,
        horarioEmbarque: horario,
        atraso,
      });
    });
    return lista;
  }

  // =============== CÁLCULOS DE KM E TEMPO ===============
  function parseHoraToMinutos(horaStr) {
    if (!horaStr) return null;
    const [h, m] = horaStr.split(":").map((n) => parseInt(n || "0", 10));
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  }

  function minutosToHHMM(min) {
    if (min == null || isNaN(min)) return "-";
    const sinal = min < 0 ? "-" : "";
    min = Math.abs(min);
    const h = Math.floor(min / 60);
    const m = min % 60;
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    return `${sinal}${hh}:${mm}`;
  }

  function recalcularResumo() {
    const kmInicial = parseFloat($("kmInicial").value.replace(",", ".")) || 0;
    const kmFinal = parseFloat($("kmFinal").value.replace(",", ".")) || 0;
    const horaChegada = $("horaChegadaPonto").value;
    const horaInicio = $("horaInicio").value;
    const horaFim = $("horaFim").value;

    // KM
    const totalKm = kmFinal - kmInicial;
    $("totalKm").value = totalKm > 0 ? totalKm.toFixed(1) + " km" : "-";

    // Tempo viagem = inicio -> fim
    const minInicio = parseHoraToMinutos(horaInicio);
    const minFim = parseHoraToMinutos(horaFim);
    let tempoViagemMin = null;
    if (minInicio != null && minFim != null && minFim >= minInicio) {
      tempoViagemMin = minFim - minInicio;
    }
    $("tempoViagem").value = tempoViagemMin != null ? minutosToHHMM(tempoViagemMin) : "-";

    // Tempo espera = chegada -> início
    const minChegada = parseHoraToMinutos(horaChegada);
    let tempoEsperaMin = null;
    if (minChegada != null && minInicio != null && minInicio >= minChegada) {
      tempoEsperaMin = minInicio - minChegada;
    }

    // Se houve atraso de funcionário, apenas destacamos que houve atraso
    const funcs = coletarFuncionarios();
    const houveAtraso = funcs.some((f) => f.atraso === "sim");
    let textoEspera = tempoEsperaMin != null ? minutosToHHMM(tempoEsperaMin) : "-";
    if (houveAtraso) {
      textoEspera += " (houve atraso de funcionário)";
    }
    $("tempoEspera").value = textoEspera;
  }

  function initResumoWatch() {
    ["kmInicial", "kmFinal", "horaChegadaPonto", "horaInicio", "horaFim"].forEach((id) => {
      const el = $(id);
      if (el) el.addEventListener("input", recalcularResumo);
    });
  }

  // =============== HISTÓRICO ===============
  function loadHistorico() {
    try {
      return JSON.parse(localStorage.getItem(KEY_HISTORICO) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveHistorico(lista) {
    localStorage.setItem(KEY_HISTORICO, JSON.stringify(lista));
  }

  function renderHistorico() {
    const lista = loadHistorico();
    const container = $("listaHistorico");
    const vazio = $("historicoVazio");

    container.innerHTML = "";
    if (!lista.length) {
      vazio.style.display = "block";
      return;
    }
    vazio.style.display = "none";

    lista
      .slice()
      .sort((a, b) => new Date(b.emitidoEm) - new Date(a.emitidoEm))
      .forEach((recibo) => {
        const div = document.createElement("div");
        div.className = "hist-item";

        const data = new Date(recibo.emitidoEm);
        const dataBR = data.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        const empresaDestino = recibo.empresaDestino || "-";

        div.innerHTML = `
          <div class="hist-main">
            <strong>${dataBR}</strong>
            <span>${empresaDestino}</span>
          </div>
          <div class="hist-actions">
            <button class="btn-small btn" data-acao="pdf">PDF</button>
            <button class="btn-small btn-secondary" data-acao="del">Excluir</button>
          </div>
        `;

        div.querySelector('[data-acao="pdf"]').onclick = () => {
          gerarReciboPdf(recibo);
        };
        div.querySelector('[data-acao="del"]').onclick = () => {
          const listaAtual = loadHistorico();
          const nova = listaAtual.filter((r) => r.id !== recibo.id);
          saveHistorico(nova);
          renderHistorico();
        };

        container.appendChild(div);
      });
  }

  // =============== EMISSÃO (PDF + WHATSAPP) ===============
  function coletarDadosRecibo() {
    const perfil = loadPerfil();

    if (
      !perfil.motorista ||
      !perfil.cpf ||
      !perfil.marca ||
      !perfil.modelo ||
      !perfil.placa ||
      !perfil.cor
    ) {
      alert("Preencha e salve os dados da empresa/motorista antes de emitir o recibo.");
      return null;
    }

    const empresaDestino = $("empresaDestino").value.trim();
    const empresaResponsavel = $("empresaResponsavel").value.trim();
    const solicitante = $("solicitante").value.trim();
    const horaChegadaPonto = $("horaChegadaPonto").value.trim();
    const descricaoServico = $("descricaoServico").value.trim();

    const horaInicio = $("horaInicio").value.trim();
    const horaFim = $("horaFim").value.trim();
    const kmInicial = $("kmInicial").value.trim();
    const kmFinal = $("kmFinal").value.trim();
    const totalKm = $("totalKm").value.trim();
    const tempoViagem = $("tempoViagem").value.trim();
    const tempoEspera = $("tempoEspera").value.trim();

    const funcionarios = coletarFuncionarios();

    if (!empresaDestino || !solicitante || !horaInicio || !horaFim) {
      alert("Preencha pelo menos: Empresa de destino, Solicitante, Horário inicial e final da viagem.");
      return null;
    }

    const recibo = {
      id: Date.now(),
      emitidoEm: new Date().toISOString(),
      // perfil
      empresa: perfil.empresa || "",
      cnpj: perfil.cnpj || "",
      motorista: perfil.motorista || "",
      cpf: perfil.cpf || "",
      marca: perfil.marca || "",
      modelo: perfil.modelo || "",
      placa: perfil.placa || "",
      cor: perfil.cor || "",
      // viagem
      empresaDestino,
      empresaResponsavel,
      solicitante,
      horaChegadaPonto,
      descricaoServico,
      // resumo
      horaInicio,
      horaFim,
      kmInicial,
      kmFinal,
      totalKm,
      tempoViagem,
      tempoEspera,
      // funcionários
      funcionarios,
    };

    return recibo;
  }

  function initEmitir() {
    $("emitirPdf").onclick = () => {
      const recibo = coletarDadosRecibo();
      if (!recibo) return;

      const historico = loadHistorico();
      historico.push(recibo);
      saveHistorico(historico);
      renderHistorico();

      gerarReciboPdf(recibo);
    };

    $("enviarWa").onclick = () => {
      const recibo = coletarDadosRecibo();
      if (!recibo) return;

      const funcsResumo =
        (recibo.funcionarios || [])
          .map((f, i) => {
            return `Funcionário ${i + 1}: ${f.nome || "-"} | Empresa: ${
              f.empresa || "-"
            } | Embarque: ${f.localEmbarque || "-"} (${f.horarioEmbarque || "-"}) | Atraso: ${
              f.atraso === "sim" ? "Sim" : "Não"
            }`;
          })
          .join("\n") || "Nenhum funcionário informado.";

      const msg = `
Recibo de Viagem - ${recibo.empresa || "Serviço de Transporte"}

Dados da empresa/motorista:
Empresa: ${recibo.empresa || "-"}
CNPJ: ${recibo.cnpj || "-"}
Motorista: ${recibo.motorista || "-"}
CPF/RG: ${recibo.cpf || "-"}
Veículo: ${(recibo.marca || "") + " " + (recibo.modelo || "")}
Placa / Cor: ${(recibo.placa || "") + " / " + (recibo.cor || "")}

Dados da viagem:
Empresa de destino: ${recibo.empresaDestino || "-"}
Empresa responsável: ${recibo.empresaResponsavel || "-"}
Solicitante/responsável: ${recibo.solicitante || "-"}
Chegada ao ponto: ${recibo.horaChegadaPonto || "-"}
Descrição: ${recibo.descricaoServico || "-"}

Funcionários:
${funcsResumo}

Horários e quilometragem:
Início: ${recibo.horaInicio || "-"}
KM inicial: ${recibo.kmInicial || "-"}
Fim: ${recibo.horaFim || "-"}
KM final: ${recibo.kmFinal || "-"}
Total de KM: ${recibo.totalKm || "-"}
Tempo de viagem: ${recibo.tempoViagem || "-"}
Tempo de espera: ${recibo.tempoEspera || "-"}
`.trim();

      const url = "https://wa.me/?text=" + encodeURIComponent(msg);
      window.open(url, "_blank");
    };
  }

  // =============== BOOT ===============
  window.addEventListener("load", () => {
    checkPlano();
    initTheme();
    initPerfil();
    initFuncionarios();
    initResumoWatch();
    renderHistorico();
    recalcularResumo();
  });
})();
