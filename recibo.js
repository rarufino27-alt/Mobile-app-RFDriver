// reciboPdf.js
// Gera o PDF profissional do Recibo de Viagem

function gerarReciboPdf(dados) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  const marginLeft = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;

  // ===== TÍTULO =====
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("RECIBO DE VIAGEM", centerX, 18, { align: "center" });

  // Empresa / cabeçalho pequeno
  doc.setFontSize(11);
  doc.setFont("Helvetica", "normal");

  let headerY = 24;
  if (dados.empresa) {
    doc.text(dados.empresa, centerX, headerY, { align: "center" });
    headerY += 5;
  }
  if (dados.cnpj) {
    doc.text("CNPJ: " + dados.cnpj, centerX, headerY, { align: "center" });
    headerY += 5;
  }

  let y = headerY + 6;

  // Helper para seções com quadrante pontilhado
  function desenharQuadrante(titulo, linhasFn) {
    const top = y;
    const left = 10;
    const width = pageWidth - 20;

    // título dentro
    let cursorY = top + 8;
    doc.setLineWidth(0.2);
    try {
      if (doc.setLineDash) doc.setLineDash([1, 1], 0); // linhas pontilhadas
    } catch (e) {}

    // desenha retângulo depois, quando souber altura
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text(titulo, left + 2, cursorY);
    cursorY += 6;

    // conteúdo do quadrante
    cursorY = linhasFn(left + 2, cursorY);

    const height = cursorY - top + 4;
    doc.rect(left, top, width, height);

    // volta para linha normal
    try {
      if (doc.setLineDash) doc.setLineDash([], 0);
    } catch (e) {}

    y = top + height + 6;
  }

  function linhaLabelValor(x, yLine, label, valor) {
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.text(label, x, yLine);
    doc.setFont("Helvetica", "normal");
    const maxWidth = pageWidth - x - 12;
    const texto = (valor && String(valor).trim()) ? String(valor) : "-";
    const linhas = doc.splitTextToSize(texto, maxWidth);
    doc.text(linhas, x + 32, yLine);
    return yLine + (linhas.length * 5);
  }

  // ===== QUADRANTE 1 - DADOS EMPRESA / MOTORISTA =====
  desenharQuadrante("Dados da empresa / motorista", (x, cy) => {
    cy = linhaLabelValor(x, cy, "Empresa:", dados.empresa);
    cy = linhaLabelValor(x, cy, "CNPJ:", dados.cnpj);
    cy = linhaLabelValor(x, cy, "Motorista:", dados.motorista);
    cy = linhaLabelValor(x, cy, "CPF/RG:", dados.cpf);
    cy = linhaLabelValor(
      x,
      cy,
      "Veículo:",
      `${dados.marca || ""} ${dados.modelo || ""}`.trim()
    );
    cy = linhaLabelValor(
      x,
      cy,
      "Placa / Cor:",
      `${dados.placa || ""} • ${dados.cor || ""}`.trim()
    );
    return cy;
  });

  // ===== QUADRANTE 2 - DADOS DA VIAGEM / EMPRESA =====
  desenharQuadrante("Dados da viagem e empresas", (x, cy) => {
    cy = linhaLabelValor(x, cy, "Empresa de destino:", dados.empresaDestino);
    cy = linhaLabelValor(
      x,
      cy,
      "Empresa responsável pelos funcionários:",
      dados.empresaResponsavel
    );
    cy = linhaLabelValor(x, cy, "Solicitante / responsável:", dados.solicitante);
    cy = linhaLabelValor(
      x,
      cy,
      "Horário de chegada ao ponto:",
      dados.horaChegadaPonto || "-"
    );
    cy = linhaLabelValor(x, cy, "Descrição da viagem:", dados.descricaoServico);
    return cy;
  });

  // ===== QUADRANTE 3 - FUNCIONÁRIOS =====
  desenharQuadrante("Funcionários transportados", (x, cy) => {
    if (!dados.funcionarios || !dados.funcionarios.length) {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Nenhum funcionário informado.", x, cy);
      cy += 6;
      return cy;
    }

    dados.funcionarios.forEach((f, idx) => {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`Funcionário ${idx + 1}`, x, cy);
      cy += 5;

      cy = linhaLabelValor(x, cy, "Nome:", f.nome);
      cy = linhaLabelValor(x, cy, "Empresa:", f.empresa);
      cy = linhaLabelValor(x, cy, "Local de embarque:", f.localEmbarque);
      cy = linhaLabelValor(x, cy, "Horário de embarque:", f.horarioEmbarque);
      cy = linhaLabelValor(
        x,
        cy,
        "Houve atraso?",
        f.atraso === "sim" ? "Sim" : "Não"
      );

      cy += 3;
    });

    return cy;
  });

  // ===== QUADRANTE 4 - HORÁRIOS / KM =====
  desenharQuadrante("Horários, quilometragem e tempos", (x, cy) => {
    cy = linhaLabelValor(x, cy, "Horário inicial da viagem:", dados.horaInicio);
    cy = linhaLabelValor(x, cy, "KM inicial:", dados.kmInicial);
    cy = linhaLabelValor(x, cy, "Horário final da viagem:", dados.horaFim);
    cy = linhaLabelValor(x, cy, "KM final:", dados.kmFinal);
    cy = linhaLabelValor(x, cy, "Total de KM:", dados.totalKm);
    cy = linhaLabelValor(x, cy, "Tempo de viagem:", dados.tempoViagem);
    cy = linhaLabelValor(x, cy, "Tempo de espera:", dados.tempoEspera);
    return cy;
  });

  // ===== ASSINATURAS =====
  const assinaturaY = Math.min(y + 10, 265);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);

  // Linha Motorista
  const linhaLarg = 70;
  const x1 = marginLeft;
  const x2 = pageWidth - marginLeft - linhaLarg;

  doc.line(x1, assinaturaY, x1 + linhaLarg, assinaturaY);
  doc.text("Assinatura do motorista", x1 + linhaLarg / 2, assinaturaY + 5, {
    align: "center",
  });
  if (dados.motorista) {
    doc.setFont("Helvetica", "bold");
    doc.text(dados.motorista, x1 + linhaLarg / 2, assinaturaY + 10, {
      align: "center",
    });
    doc.setFont("Helvetica", "normal");
  }

  // Linha Responsável
  doc.line(x2, assinaturaY, x2 + linhaLarg, assinaturaY);
  doc.text(
    "Assinatura do responsável pela viagem",
    x2 + linhaLarg / 2,
    assinaturaY + 5,
    { align: "center" }
  );
  if (dados.solicitante) {
    doc.setFont("Helvetica", "bold");
    doc.text(dados.solicitante, x2 + linhaLarg / 2, assinaturaY + 10, {
      align: "center",
    });
    doc.setFont("Helvetica", "normal");
  }

  doc.save("recibo_viagem.pdf");
}
