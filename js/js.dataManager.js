(function(){

const STORAGE_KEY = "rfdriver_data";

function load(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    configuracoes: { tema: "dark" },
    agendamentos: [],
    caixaAtual: [],
    caixaDiario: [],
    carteiraSaldo: 0
  };
}

function save(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

window.DataManager = {

  /* ================= CONFIG ================= */
  getTema(){
    return this.getData().configuracoes.tema || "dark";
  },

  setTema(tema){
    const d = this.getData();
    d.configuracoes.tema = tema;
    save(d);
  },

  /* ================= CORE ================= */
  getData(){
    return load();
  },

  saveData(data){
    save(data);
  },

  /* ================= AGENDAMENTOS ================= */
  listarAgendamentos(){
    return this.getData().agendamentos || [];
  },

  adicionarAgendamento(ag){
    const d = this.getData();
    d.agendamentos.push(ag);
    save(d);
  },

  removerAgendamento(id){
    const d = this.getData();
    d.agendamentos = d.agendamentos.filter(a=>a.id!==id);
    save(d);
  },

  /* ================= CAIXA ================= */
  getCaixaAtual(){
    return this.getData().caixaAtual || [];
  },

  salvarCaixaAtual(lista){
    const d = this.getData();
    d.caixaAtual = lista;
    save(d);
  },

  fecharCaixa(registro){
    const d = this.getData();
    d.caixaDiario.push(registro);
    d.caixaAtual = [];
    d.carteiraSaldo += registro.saldo;
    save(d);
  },

  listarCaixaDiario(){
    return this.getData().caixaDiario || [];
  },

  /* ================= CARTEIRA ================= */
  getSaldoCarteira(){
    return this.getData().carteiraSaldo || 0;
  },

  limparCarteira(){
    const d = this.getData();
    d.carteiraSaldo = 0;
    d.caixaDiario = [];
    save(d);
  }

};

})();