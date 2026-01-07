(function(){

const read = (k,d)=>JSON.parse(localStorage.getItem(k)) ?? d;
const write = (k,v)=>localStorage.setItem(k,JSON.stringify(v));

const DB_KEY = "rfdriver_db";

function getDB(){
  return read(DB_KEY,{
    agendamentos: [],
    caixaAtual: [],
    caixaDiario: [],
    carteiraSaldo: 0,
    configuracoes: { tema:"dark" }
  });
}

function saveDB(db){
  write(DB_KEY,db);
}

window.DataManager = {

  /* ===== BÁSICO (COMPATÍVEL COM O ANTIGO) ===== */
  get(key, def=[]){
    return read(key, def);
  },

  set(key, value){
    write(key, value);
  },

  add(key, item){
    const data = read(key, []);
    data.push(item);
    write(key, data);
  },

  remove(key, index){
    const data = read(key, []);
    data.splice(index,1);
    write(key, data);
  },

  /* ===== AGENDAMENTOS ===== */
  listarAgendamentos(){
    return getDB().agendamentos;
  },

  adicionarAgendamento(item){
    const db = getDB();
    db.agendamentos.push(item);
    saveDB(db);
  },

  removerAgendamento(id){
    const db = getDB();
    db.agendamentos = db.agendamentos.filter(a=>a.id!==id);
    saveDB(db);
  },

  /* ===== CAIXA ===== */
  getCaixa(){
    return getDB().caixaAtual;
  },

  salvarCaixa(lista){
    const db = getDB();
    db.caixaAtual = lista;
    saveDB(db);
  },

  fecharCaixa(registro){
    const db = getDB();
    db.caixaDiario.push(registro);
    db.carteiraSaldo += registro.saldo;
    db.caixaAtual = [];
    saveDB(db);
  },

  listarCaixaDiario(){
    return getDB().caixaDiario;
  },

  /* ===== CARTEIRA ===== */
  getSaldoCarteira(){
    return getDB().carteiraSaldo || 0;
  },

  limparCarteira(){
    const db = getDB();
    db.carteiraSaldo = 0;
    db.caixaDiario = [];
    saveDB(db);
  },

  /* ===== CONFIG ===== */
  getTema(){
    return getDB().configuracoes.tema || "dark";
  },

  setTema(t){
    const db = getDB();
    db.configuracoes.tema = t;
    saveDB(db);
  }

};

})();