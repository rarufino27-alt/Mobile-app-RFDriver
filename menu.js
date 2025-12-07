// ===== MENU / PERMISSÕES =====

// PERMISSÕES (fica aqui)
const permissoes = {
  free: {
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

  basico: {
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

  premium: {
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

  pro: {
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

// ícones
function icon(level){
  if(level==="full") return "✅";
  if(level==="partial") return "🔑";
  return "🔒";
}

// abrir menu
function openMenu(){
  document.getElementById('sidebar').classList.add('open');
}

// fechar menu
function closeMenu(){
  document.getElementById('sidebar').classList.remove('open');
}

// navegar
function navegar(pagina, feature){
  const plano = getPlano();
  const level = permissoes[plano][feature];

  if(level==="locked"){
    alert("Atualize para desbloquear esta função.");
    return;
  }

  window.location.href = pagina + ".html";
}

// Renderizar
function renderMenu(){
  const plano = getPlano();

  for(const key in permissoes[plano]){
    const el = document.getElementById(`icon-${key.replaceAll("_","-")}`);
    if(el){
      el.innerText = icon(permissoes[plano][key]);
    }
  }
}

// iniciar
renderMenu();
