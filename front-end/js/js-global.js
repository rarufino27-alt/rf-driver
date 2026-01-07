(function(){

  // Tema
  const temaSalvo = localStorage.getItem("tema") || "dark";
  document.body.dataset.theme = temaSalvo;

  window.toggleTheme = function(){
    const novo = document.body.dataset.theme === "light" ? "dark" : "light";
    document.body.dataset.theme = novo;
    localStorage.setItem("tema", novo);
  }

  // Drawer
  window.toggleDrawer = function(){
    document.getElementById("drawer")?.classList.toggle("open");
  }

  // Loader simples de componentes
  window.loadComponent = async function(id, file){
    const el = document.getElementById(id);
    if(!el) return;
    const html = await fetch(file).then(r=>r.text());
    el.innerHTML = html;
  }

})();

// ================================
// 🔐 PROTEÇÃO GLOBAL RF DRIVER
// ================================

(function(){

  const paginaAtual = location.pathname.split("/").pop();

  // Páginas públicas
  const paginasPublicas = [
    "login.html",
    "cadastro.html"
  ];

  // Se for página pública, libera
  if(paginasPublicas.includes(paginaAtual)) return;

  // Verifica login
  const logado = localStorage.getItem("rf_usuario_logado");

  if(!logado){
    location.replace("login.html");
    return;
  }

  // ===== CONTROLE DE PLANO =====
  const plano = localStorage.getItem("rf_plano") || "free";

  // Módulos BLOQUEADOS no plano core (9.90)
  const paginasBloqueadas = [
    "registro-despesas.html",
    "despesas-registradas.html",
    "acompanhamento-pagamentos.html",
    "agendamentos.html",
    "calculadora.html",
    "resumo.html",
    "manutencao.html"
  ];

  if(plano === "core" && paginasBloqueadas.includes(paginaAtual)){
    alert("Este recurso faz parte do plano avançado.");
    location.replace("planos.html");
  }

})();
