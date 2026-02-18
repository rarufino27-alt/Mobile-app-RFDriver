function renderMenu(){

  const menuHTML = `
    <div id="menuOverlay" class="menu-overlay" onclick="fecharMenu()"></div>

    <div id="menuLateral" class="menu-lateral">
      <div class="menu-header" onclick="window.location.href='perfil.html'">
        <div class="avatar" id="avatarMenu"></div>
        <div class="menu-nome" id="menuNome">Usuário</div>
      </div>

      <div class="menu-lista">
        <div class="menu-item" onclick="window.location.href='viagem.html'">🚕 Atividade</div>
        <div class="menu-item" onclick="window.location.href='mensagens.html'">📩 Mensagens</div>
        <div class="menu-item" onclick="window.location.href='configuracoes.html'">⚙️ Configurações</div>
        <div class="menu-item" onclick="window.location.href='convite.html'">🎁 Convide Amigos</div>
        <div class="menu-item sair" onclick="logout()">🚪 Sair</div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("afterbegin", menuHTML);
}

function abrirMenu(){
  document.getElementById("menuLateral").classList.add("ativo");
  document.getElementById("menuOverlay").style.display="block";
}

function fecharMenu(){
  document.getElementById("menuLateral").classList.remove("ativo");
  document.getElementById("menuOverlay").style.display="none";
}
