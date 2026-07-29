/* ============================================================
   CRAZY CRAVINGS — DESPESAS DO NEGÓCIO — app.js
   Padrão: single-file style app (Firebase Firestore + GitHub Pages)
   ============================================================ */

// ---------- CONFIGURAÇÃO FIREBASE ----------
// TODO: substituir pelos dados do seu projeto Firebase (Console > Configurações do Projeto)
const firebaseConfig = {
  // TODO: cole aqui as credenciais do SEU NOVO projeto Firebase
  // (Firebase Console > Configurações do Projeto > Seus apps > SDK setup)
  // NUNCA reutilize aqui o firebaseConfig do app pessoal (finance-control-b42ed).
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.firebasestorage.app",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const FIREBASE_NOT_CONFIGURED = (firebaseConfig.apiKey === "SUA_API_KEY" || firebaseConfig.projectId === "SEU_PROJETO");
if(FIREBASE_NOT_CONFIGURED){
  window.addEventListener('DOMContentLoaded', () => {
    const errEl = document.getElementById('loginError');
    if(errEl){
      errEl.style.color = 'var(--danger)';
      errEl.innerHTML = '⚠️ Firebase is not configured yet — replace the placeholder values in firebaseConfig at the top of app.js with your real project credentials.';
    }
  });
}

// ---------- SENHA DE ACESSO ----------
const ACCESS_PASSWORD = "business@admin"; // troque aqui quando quiser
const LOGO_DATA_URI = "data:image/png;base64,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";


// ---------- ESTADO GLOBAL ----------
let transactions = [];   // cache local de todas as transações
let categories = [];     // categorias cadastradas (editável pela gestora)
let dashboardCharts = {}; // instâncias Chart.js do dashboard
let reportCharts = {};    // instâncias Chart.js dos relatórios
let currentPeriodFilter = "mensal"; // mensal | trimestral | semestral | anual
let currentReportRange = null; // {start, end, label, prevStart, prevEnd, prevLabel}

const CATEGORY_COLORS = [
  "#2563eb","#16a34a","#d97706","#dc2626","#7c3aed",
  "#0891b2","#db2777","#65a30d","#ea580c","#4f46e5"
];

// ============================================================
// LOGIN / LOGOUT
// ============================================================
function doLogin(){
  const val = document.getElementById('passwordInput').value;
  const errEl = document.getElementById('loginError');
  if(val === ACCESS_PASSWORD){
    sessionStorage.setItem('fc_auth', 'true');
    errEl.textContent = '';
    showApp();
  } else {
    errEl.textContent = 'Senha incorreta. Tente novamente.';
  }
}

function doLogout(){
  sessionStorage.removeItem('fc_auth');
  document.getElementById('app').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('passwordInput').value = '';
}

function showApp(){
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  initApp();
}

// checa sessão ao carregar
window.addEventListener('DOMContentLoaded', () => {
  const loginLogo = document.getElementById('loginLogo');
  const headerLogo = document.getElementById('headerLogo');
  if(loginLogo) loginLogo.src = LOGO_DATA_URI;
  if(headerLogo) headerLogo.src = LOGO_DATA_URI;

  if(sessionStorage.getItem('fc_auth') === 'true'){
    showApp();
  }
});

// ============================================================
// INIT
// ============================================================
function initApp(){
  renderDashboardShell();
  renderCadastroShell();
  renderRelatoriosShell();
  renderContasShell();
  loadCategories();
  loadTransactions();
}

// ============================================================
// TABS
// ============================================================
function switchTab(tab){
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');

  if(tab === 'dashboard') refreshDashboard();
  if(tab === 'relatorios') refreshReport();
  if(tab === 'contas') refreshContas();
}

// ============================================================
// HELPERS GERAIS
// ============================================================
function formatCurrency(v){
  return (v||0).toLocaleString('en-CA', {style:'currency', currency:'CAD'});
}
function formatDate(d){
  // Canadian date format: YYYY-MM-DD
  const date = (d instanceof Date) ? d : new Date(d);
  return date.toLocaleDateString('en-CA');
}
function monthLabel(year, month){
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[month]} ${year}`;
}
function todayISO(){
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// Native date input, with lang="en-CA" set on the element to force
// the Canadian YYYY-MM-DD picker format in supporting browsers.
function initDatePicker(defaultDate){
  const input = document.getElementById('txData');
  if(!input) return;
  input.value = defaultDate || todayISO();
}

function categoryById(id){
  return categories.find(c => c.id === id) || {nome:'Sem categoria', cor:'#94a3b8', icone:'🏷️'};
}

// ============================================================
// FIRESTORE — CATEGORIAS
// ============================================================
async function loadCategories(){
  try{
    const snap = await db.collection('cc_exp_categories').orderBy('nome').get();
    categories = snap.docs.map(d => ({id: d.id, ...d.data()}));
    if(categories.length === 0){
      await seedDefaultCategories();
      return loadCategories();
    }
    renderCategoryChips();
    populateCategorySelects();
    if(document.getElementById('accountsGrid')) refreshContas();
  }catch(e){
    console.error('Erro ao carregar categorias', e);
  }
}

async function seedDefaultCategories(){
  const defaults = [
    {nome:"Fuel", icone:"⛽"},
    {nome:"Van Maintenance", icone:"🔧"},
    {nome:"Ingredients & Supplies", icone:"🍦"},
    {nome:"Payroll", icone:"💵"},
    {nome:"Marketing", icone:"📣"},
    {nome:"Permits & Licenses", icone:"📋"},
    {nome:"Storage & Utilities", icone:"🏢"},
    {nome:"Other", icone:"🏷️"}
  ];
  for(let i=0;i<defaults.length;i++){
    await db.collection('cc_exp_categories').add({
      nome: defaults[i].nome,
      icone: defaults[i].icone,
      cor: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      criado_em: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

async function addCategory(){
  const input = document.getElementById('newCategoryInput');
  const errEl = document.getElementById('categoryError');
  const nome = input.value.trim();
  if(errEl) errEl.textContent = '';
  if(!nome) return;

  const cor = CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length];
  try{
    await db.collection('cc_exp_categories').add({
      nome, icone:"🏷️", cor,
      criado_em: firebase.firestore.FieldValue.serverTimestamp()
    });
    input.value = '';
    await loadCategories();
  }catch(e){
    console.error('Error adding category', e);
    if(errEl) errEl.textContent = `⚠️ Could not add category: ${e.code || e.message || 'unknown error'}. Check your firebaseConfig in app.js and your Firestore rules.`;
  }
}

async function deleteCategory(id){
  if(!confirm('Delete this category? Existing transactions will keep the old name.')) return;
  try{
    await db.collection('cc_exp_categories').doc(id).delete();
    await loadCategories();
  }catch(e){
    console.error('Error deleting category', e);
    alert('Could not delete category — check your Firebase connection/rules.');
  }
}

function renderCategoryChips(){
  const el = document.getElementById('categoryChips');
  if(!el) return;
  el.innerHTML = categories.map(c => `
    <span class="cat-chip" style="background:${c.cor}22;color:${c.cor}">
      ${c.icone} ${c.nome}
      <button onclick="openEditCategory('${c.id}')" title="Edit category" style="color:inherit;opacity:.75;">✏️</button>
      <button onclick="deleteCategory('${c.id}')" title="Delete category">✕</button>
    </span>
  `).join('');
}

function populateCategorySelects(){
  document.querySelectorAll('.category-select').forEach(sel => {
    const current = sel.value;
    sel.innerHTML = categories.map(c => `<option value="${c.id}">${c.icone} ${c.nome}</option>`).join('');
    if(current) sel.value = current;
  });
}

// ============================================================
// FIRESTORE — TRANSAÇÕES
// ============================================================
async function loadTransactions(){
  try{
    const container = document.getElementById('tx-list-container');
    const snap = await db.collection('cc_exp_transactions').orderBy('data', 'desc').get();
    transactions = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        data: data.data && data.data.toDate ? data.data.toDate() : new Date(data.data)
      };
    });
    refreshDashboard();
    refreshReport();
  }catch(e){
    console.error('Erro ao carregar transações', e);
  }
}

async function saveTransaction(e){
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  const valor = parseFloat(document.getElementById('txValor').value);
  const categoryId = document.getElementById('txCategoria').value;
  const descricao = document.getElementById('txDescricao').value.trim();
  const dataStr = document.getElementById('txData').value;
  const isRecurring = document.getElementById('txRecorrente').checked;
  const recurringYear = isRecurring ? parseInt(document.getElementById('txRecorrenteAno').value, 10) : null;

  if(!valor || valor <= 0 || !categoryId || !dataStr){
    msg.style.color = 'var(--danger)';
    msg.textContent = 'Please fill in amount, category and date correctly.';
    return;
  }
  if(isRecurring && selectedMonths.size === 0){
    msg.style.color = 'var(--danger)';
    msg.textContent = 'Select at least one month for a recurring expense.';
    return;
  }

  const [, , day] = dataStr.split('-').map(Number);
  const groupId = isRecurring ? `rec_${Date.now()}` : null;

  try{
    const batch = db.batch();
    const newEntries = [];

    if(isRecurring){
      const monthsSorted = [...selectedMonths].sort((a,b) => a-b);
      monthsSorted.forEach(monthIdx => {
        const entryDate = new Date(recurringYear, monthIdx, day, 12, 0, 0);
        const docRef = db.collection('cc_exp_transactions').doc();
        const entryData = {
          valor, categoryId,
          descricao: descricao || '(no description)',
          data: firebase.firestore.Timestamp.fromDate(entryDate),
          recorrente: true,
          recorrenteGroupId: groupId,
          criado_em: firebase.firestore.FieldValue.serverTimestamp()
        };
        batch.set(docRef, entryData);
        newEntries.push({ id: docRef.id, ...entryData, data: entryDate });
      });
    } else {
      const [y, m] = dataStr.split('-').map(Number);
      const entryDate = new Date(y, m-1, day, 12, 0, 0);
      const docRef = db.collection('cc_exp_transactions').doc();
      const entryData = {
        valor, categoryId,
        descricao: descricao || '(no description)',
        data: firebase.firestore.Timestamp.fromDate(entryDate),
        recorrente: false,
        recorrenteGroupId: null,
        criado_em: firebase.firestore.FieldValue.serverTimestamp()
      };
      batch.set(docRef, entryData);
      newEntries.push({ id: docRef.id, ...entryData, data: entryDate });
    }

    await batch.commit();

    // Update local cache directly instead of re-fetching everything from Firestore.
    transactions = [...newEntries, ...transactions].sort((a,b) => b.data - a.data);
    refreshDashboard();
    refreshReport();

    msg.style.color = 'var(--success)';
    msg.textContent = isRecurring
      ? `✅ Expense saved for ${newEntries.length} month(s) in ${recurringYear}!`
      : '✅ Expense saved successfully!';
    document.getElementById('txForm').reset();
    document.getElementById('recurringOptions').style.display = 'none';
    initDatePicker(todayISO());
    populateRecurringYearSelect();
    renderMonthGrid();
    setTimeout(() => { msg.textContent = ''; }, 3500);
  }catch(err){
    console.error(err);
    msg.style.color = 'var(--danger)';
    msg.textContent = 'Error saving expense. Please try again.';
  }
}

async function deleteTransaction(id){
  const tx = transactions.find(t => t.id === id);
  const isPartOfSeries = tx && tx.recorrente && tx.recorrenteGroupId;

  if(isPartOfSeries){
    const seriesCount = transactions.filter(t => t.recorrenteGroupId === tx.recorrenteGroupId).length;
    const deleteAll = confirm(
      `This expense is part of a recurring series (${seriesCount} entries).\n\n` +
      `Click OK to delete ALL ${seriesCount} entries in this series, or Cancel to delete just this one.`
    );
    if(deleteAll){
      await deleteTransactionSeries(tx.recorrenteGroupId);
      return;
    }
  } else {
    if(!confirm('Delete this expense?')) return;
  }

  try{
    await db.collection('cc_exp_transactions').doc(id).delete();
    // Remove locally instead of re-fetching everything — much faster.
    transactions = transactions.filter(t => t.id !== id);
    refreshDashboard();
    refreshReport();
    if(document.getElementById('accountsGrid')) refreshContas();
  }catch(e){
    console.error('Error deleting expense', e);
    alert(`Could not delete: ${e.code || e.message || 'unknown error'}`);
  }
}

async function deleteTransactionSeries(groupId){
  const toDelete = transactions.filter(t => t.recorrenteGroupId === groupId);
  try{
    const batch = db.batch();
    toDelete.forEach(t => batch.delete(db.collection('cc_exp_transactions').doc(t.id)));
    await batch.commit();
    const idsToRemove = new Set(toDelete.map(t => t.id));
    transactions = transactions.filter(t => !idsToRemove.has(t.id));
    refreshDashboard();
    refreshReport();
  }catch(e){
    console.error('Error deleting series', e);
    alert(`Could not delete series: ${e.code || e.message || 'unknown error'}`);
  }
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboardShell(){
  const el = document.getElementById('tab-dashboard');
  el.innerHTML = `
    <div class="kpi-grid" id="dashKpis"></div>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>Monthly Trend (last 6 months)</h3>
        <div class="chart-wrap"><canvas id="chartEvolucao"></canvas></div>
      </div>
      <div class="chart-card">
        <h3>Spending by Category (current month)</h3>
        <div class="chart-wrap"><canvas id="chartCategoria"></canvas></div>
      </div>
    </div>
    <div class="chart-card" style="margin-bottom:24px;">
      <h3>Recent Expenses</h3>
      <div id="recentTxList"></div>
    </div>
    <div class="chart-card" style="margin-bottom:24px;">
      <h3>📅 Upcoming &amp; Future Entries <span style="font-weight:400;color:var(--text-muted);font-size:12px;">(beyond next month)</span></h3>
      <div id="futureTxList"></div>
    </div>
  `;
}

function refreshDashboard(){
  if(!document.getElementById('dashKpis')) return;
  const now = new Date();
  const curMonth = now.getMonth(), curYear = now.getFullYear();
  const prevDate = new Date(curYear, curMonth - 1, 1);

  const curMonthTx = transactions.filter(t => t.data.getMonth() === curMonth && t.data.getFullYear() === curYear);
  const prevMonthTx = transactions.filter(t => t.data.getMonth() === prevDate.getMonth() && t.data.getFullYear() === prevDate.getFullYear());

  const totalCur = curMonthTx.reduce((s,t) => s + t.valor, 0);
  const totalPrev = prevMonthTx.reduce((s,t) => s + t.valor, 0);
  const variacao = totalPrev > 0 ? ((totalCur - totalPrev) / totalPrev * 100) : (totalCur > 0 ? 100 : 0);

  // categoria de maior impacto no mês
  const byCat = {};
  curMonthTx.forEach(t => { byCat[t.categoryId] = (byCat[t.categoryId]||0) + t.valor; });
  let topCatId = null, topCatVal = 0;
  Object.entries(byCat).forEach(([id,val]) => { if(val > topCatVal){ topCatVal = val; topCatId = id; }});
  const topCat = topCatId ? categoryById(topCatId) : null;

  document.getElementById('dashKpis').innerHTML = `
    <div class="kpi-card">
      <div class="label">This month's spending</div>
      <div class="value danger">${formatCurrency(totalCur)}</div>
      <div class="sub ${variacao>=0?'up':'down'}">${variacao>=0?'▲':'▼'} ${Math.abs(variacao).toFixed(1)}% vs previous month</div>
    </div>
    <div class="kpi-card">
      <div class="label">Previous month</div>
      <div class="value">${formatCurrency(totalPrev)}</div>
      <div class="sub">${monthLabel(prevDate.getFullYear(), prevDate.getMonth())}</div>
    </div>
    <div class="kpi-card">
      <div class="label">Top spending category</div>
      <div class="value" style="font-size:18px;">${topCat ? topCat.icone+' '+topCat.nome : '—'}</div>
      <div class="sub">${topCat ? formatCurrency(topCatVal) : 'No entries'}</div>
    </div>
    <div class="kpi-card">
      <div class="label">Entries this month</div>
      <div class="value">${curMonthTx.length}</div>
      <div class="sub">overall total: ${transactions.length}</div>
    </div>
  `;

  renderEvolutionChart();
  renderCategoryChart(curMonthTx);
  renderRecentTx();
  renderFutureTx();
}

function renderEvolutionChart(){
  const ctx = document.getElementById('chartEvolucao');
  const now = new Date();
  const labels = [], values = [];
  for(let i=5;i>=0;i--){
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    const total = transactions
      .filter(t => t.data.getMonth() === d.getMonth() && t.data.getFullYear() === d.getFullYear())
      .reduce((s,t) => s + t.valor, 0);
    labels.push(d.toLocaleDateString('pt-BR', {month:'short', year:'2-digit'}));
    values.push(total);
  }
  if(dashboardCharts.evolucao) dashboardCharts.evolucao.destroy();
  dashboardCharts.evolucao = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{
      label: 'Gastos', data: values, borderColor: '#2563eb',
      backgroundColor: 'rgba(37,99,235,0.1)', fill: true, tension: 0.35, pointRadius: 4
    }]},
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false}},
      scales:{ y:{ ticks:{ callback: v => 'R$ '+v } } }
    }
  });
}

function renderCategoryChart(monthTx){
  const ctx = document.getElementById('chartCategoria');
  const byCat = {};
  monthTx.forEach(t => { byCat[t.categoryId] = (byCat[t.categoryId]||0) + t.valor; });
  const entries = Object.entries(byCat);
  const labels = entries.map(([id]) => categoryById(id).nome);
  const values = entries.map(([,v]) => v);
  const colors = entries.map(([id]) => categoryById(id).cor);

  if(dashboardCharts.categoria) dashboardCharts.categoria.destroy();
  if(entries.length === 0){
    ctx.getContext('2d').clearRect(0,0,ctx.width,ctx.height);
    return;
  }
  dashboardCharts.categoria = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data: values, backgroundColor: colors, borderWidth: 2, borderColor:'#fff' }]},
    options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom', labels:{boxWidth:12,font:{size:11}}}} }
  });
}

function renderRecentTx(){
  const el = document.getElementById('recentTxList');
  const recent = transactions.slice(0,6);
  if(recent.length === 0){
    el.innerHTML = `<div class="empty-state"><div class="icon">📭</div>No expenses logged yet.</div>`;
    return;
  }
  el.innerHTML = `
    <table class="tx-table">
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th style="text-align:right">Amount</th><th></th></tr></thead>
      <tbody>
        ${recent.map(t => {
          const cat = categoryById(t.categoryId);
          return `<tr>
            <td>${formatDate(t.data)}</td>
            <td>${t.descricao}</td>
            <td><span class="cat-badge" style="background:${cat.cor}22">${cat.icone} ${cat.nome}</span></td>
            <td class="valor">${formatCurrency(t.valor)}</td>
            <td><button class="btn-edit" onclick="openEditTransaction('${t.id}')" title="Edit">✏️</button><button class="btn-del" onclick="deleteTransaction('${t.id}')" title="Delete">🗑️</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  `;
}

function renderFutureTx(){
  const el = document.getElementById('futureTxList');
  if(!el) return;
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth() + 2, 1); // beyond next month
  const future = transactions
    .filter(t => t.data >= cutoff)
    .sort((a,b) => a.data - b.data);

  if(future.length === 0){
    el.innerHTML = `<div class="empty-state"><div class="icon">📆</div>No future entries beyond next month.</div>`;
    return;
  }

  const groups = {};
  future.forEach(t => {
    const key = `${t.data.getFullYear()}-${String(t.data.getMonth()+1).padStart(2,'0')}`;
    if(!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  const totalFuture = future.reduce((s,t)=>s+t.valor,0);

  el.innerHTML = `
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:14px;">
      ${future.length} entr${future.length===1?'y':'ies'} scheduled ahead, totaling <strong style="color:var(--text);">${formatCurrency(totalFuture)}</strong>.
    </p>
    ${Object.keys(groups).sort().map(key => {
      const [y,m] = key.split('-').map(Number);
      const groupTotal = groups[key].reduce((s,t)=>s+t.valor,0);
      return `
        <div style="margin-bottom:16px;">
          <div style="font-size:13px;font-weight:700;color:var(--primary);margin-bottom:6px;">
            ${monthLabel(y, m-1)} — ${formatCurrency(groupTotal)}
          </div>
          <table class="tx-table">
            <tbody>
              ${groups[key].map(t => {
                const cat = categoryById(t.categoryId);
                return `<tr>
                  <td>${formatDate(t.data)}</td>
                  <td>${t.descricao}</td>
                  <td><span class="cat-badge" style="background:${cat.cor}22">${cat.icone} ${cat.nome}</span></td>
                  <td class="valor">${formatCurrency(t.valor)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }).join('')}
  `;
}

// ============================================================
// TAB CADASTRO DE DESPESA
// ============================================================
function renderCadastroShell(){
  const el = document.getElementById('tab-cadastro');
  el.innerHTML = `
    <div class="form-card">
      <h2>➕ New Expense</h2>
      <p class="hint">Log an expense — data is saved automatically to the cloud.</p>
      <form id="txForm">
        <div class="form-row">
          <div class="field">
            <label>Amount (CAD)</label>
            <input type="number" step="0.01" min="0" id="txValor" placeholder="0.00" required>
          </div>
          <div class="field">
            <label>Date</label>
            <input type="date" id="txData" lang="en-CA" required>
          </div>
        </div>
        <div class="form-row">
          <div class="field field-full">
            <label>Category</label>
            <select id="txCategoria" class="category-select" required></select>
          </div>
        </div>
        <div class="form-row">
          <div class="field field-full">
            <label>Description</label>
            <input type="text" id="txDescricao" placeholder="e.g. Groceries, electricity bill...">
          </div>
        </div>
        <div class="form-row">
          <div class="field field-full recurring-field">
            <label class="recurring-toggle">
              <input type="checkbox" id="txRecorrente">
              <span>🔁 This expense repeats across several months</span>
            </label>
            <div id="recurringOptions" style="display:none;">
              <div class="field" style="max-width:160px;margin-bottom:12px;">
                <label style="font-size:13px;font-weight:600;color:var(--text-muted);">Year</label>
                <select id="txRecorrenteAno"></select>
              </div>
              <label style="font-size:13px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:8px;">Select the months this expense applies to</label>
              <div class="month-grid" id="monthGrid"></div>
            </div>
          </div>
        </div>
        <button type="submit" class="btn-primary">Save Expense</button>
        <div id="formMsg"></div>
      </form>

      <hr style="margin:26px 0;border:none;border-top:1px solid var(--border);">

      <h2 style="font-size:16px;">🏷️ Manage Categories</h2>
      <p class="hint">Add or remove categories as needed.</p>
      <div style="display:flex;gap:8px;margin-bottom:14px;">
        <input type="text" id="newCategoryInput" placeholder="New category...">
        <button type="button" class="btn-secondary" id="addCategoryBtn">Add</button>
      </div>
      <div id="categoryError" style="color:var(--danger);font-size:13px;margin-bottom:8px;"></div>
      <div class="category-manager" id="categoryChips"></div>
    </div>
  `;
  initDatePicker(todayISO());

  // Attach listeners explicitly (more reliable than inline onclick inside dynamically-injected HTML)
  document.getElementById('txForm').addEventListener('submit', saveTransaction);

  const addBtn = document.getElementById('addCategoryBtn');
  addBtn.addEventListener('click', addCategory);

  const newCatInput = document.getElementById('newCategoryInput');
  newCatInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){ e.preventDefault(); addCategory(); }
  });

  document.getElementById('txRecorrente').addEventListener('change', (e) => {
    document.getElementById('recurringOptions').style.display = e.target.checked ? 'block' : 'none';
  });

  populateRecurringYearSelect();
  renderMonthGrid();
}

const MONTH_NAMES_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let selectedMonths = new Set();

function populateRecurringYearSelect(){
  const sel = document.getElementById('txRecorrenteAno');
  if(!sel) return;
  const curYear = new Date().getFullYear();
  const years = [];
  for(let y = curYear - 2; y <= curYear + 10; y++) years.push(y);
  sel.innerHTML = years.map(y => `<option value="${y}" ${y===curYear?'selected':''}>${y}</option>`).join('');
}

function renderMonthGrid(){
  const grid = document.getElementById('monthGrid');
  if(!grid) return;
  const curMonth = new Date().getMonth();
  selectedMonths = new Set([curMonth]); // default: current month pre-selected
  grid.innerHTML = MONTH_NAMES_SHORT.map((name, idx) => `
    <label class="month-chip ${selectedMonths.has(idx)?'selected':''}" data-month="${idx}">
      <input type="checkbox" value="${idx}" ${selectedMonths.has(idx)?'checked':''} style="display:none;">
      ${name}
    </label>
  `).join('');

  grid.querySelectorAll('.month-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(chip.dataset.month, 10);
      const checkbox = chip.querySelector('input');
      if(selectedMonths.has(idx)){
        selectedMonths.delete(idx);
        checkbox.checked = false;
        chip.classList.remove('selected');
      } else {
        selectedMonths.add(idx);
        checkbox.checked = true;
        chip.classList.add('selected');
      }
    });
  });
}

// ============================================================
// TAB RELATÓRIOS
// ============================================================
function renderRelatoriosShell(){
  const el = document.getElementById('tab-relatorios');
  el.innerHTML = `
    <div class="filters-bar">
      <div class="period-tabs" id="periodTabs">
        <button data-period="mensal" class="active" onclick="setPeriodFilter('mensal')">Monthly</button>
        <button data-period="trimestral" onclick="setPeriodFilter('trimestral')">Quarterly</button>
        <button data-period="semestral" onclick="setPeriodFilter('semestral')">Semi-annual</button>
        <button data-period="anual" onclick="setPeriodFilter('anual')">Annual</button>
        <button data-period="custom" onclick="setPeriodFilter('custom')">Custom Range</button>
      </div>
      <div class="field" id="refSelectWrap">
        <label style="font-size:12px;color:var(--text-muted);">Reference</label>
        <select id="refSelect" onchange="onRefChange()"></select>
      </div>
      <div class="custom-range-fields" id="customRangeFields" style="display:none;">
        <div class="field">
          <label style="font-size:12px;color:var(--text-muted);">From</label>
          <div class="month-year-group">
            <select id="customFromMonth" class="my-month"></select>
            <select id="customFromYear" class="my-year"></select>
          </div>
        </div>
        <div class="field">
          <label style="font-size:12px;color:var(--text-muted);">To</label>
          <div class="month-year-group">
            <select id="customToMonth" class="my-month"></select>
            <select id="customToYear" class="my-year"></select>
          </div>
        </div>
        <button type="button" class="btn-secondary" id="applyCustomRangeBtn">Apply</button>
      </div>
      <button type="button" class="btn-winter" id="winterBtn" title="Oct → May, Northern Hemisphere winter season">❄️ Prepare for Winter</button>
      <div class="export-btns">
        <button onclick="exportCSV()">⬇️ CSV</button>
        <button onclick="exportPDF()">📄 PDF</button>
      </div>
    </div>

    <div class="kpi-grid" id="reportKpis"></div>

    <div class="comparison-grid">
      <div class="chart-card">
        <h3 id="reportChartTitle">Comparison by Category</h3>
        <div class="chart-wrap"><canvas id="chartComparativo"></canvas></div>
      </div>
      <div class="chart-card">
        <h3>Period Distribution</h3>
        <div class="chart-wrap"><canvas id="chartDistribuicao"></canvas></div>
      </div>
    </div>

    <div class="chart-card">
      <h3>Period Transactions</h3>
      <div id="reportTxList"></div>
    </div>
  `;
  populateRefSelect();
  populateCustomRangeSelects();

  document.getElementById('applyCustomRangeBtn').addEventListener('click', applyCustomRange);
  document.getElementById('winterBtn').addEventListener('click', prepareForWinter);
}

function setPeriodFilter(period){
  currentPeriodFilter = period;
  document.querySelectorAll('#periodTabs button').forEach(b => b.classList.toggle('active', b.dataset.period === period));

  const refWrap = document.getElementById('refSelectWrap');
  const customFields = document.getElementById('customRangeFields');

  if(period === 'custom'){
    refWrap.style.display = 'none';
    customFields.style.display = 'flex';
    applyCustomRange();
  } else {
    refWrap.style.display = 'flex';
    customFields.style.display = 'none';
    populateRefSelect();
  }
}

// Populates the "From" / "To" month + year selects for custom range filtering
function populateCustomRangeSelects(){
  const fromMonthSel = document.getElementById('customFromMonth');
  const toMonthSel = document.getElementById('customToMonth');
  const fromYearSel = document.getElementById('customFromYear');
  const toYearSel = document.getElementById('customToYear');
  if(!fromMonthSel || !toMonthSel || !fromYearSel || !toYearSel) return;

  const now = new Date();

  // Month options (Jan–Dec) are the same for both — full names, easy to scan
  const monthOptHtml = MC_MONTHS_FULL.map((name, idx) => `<option value="${idx}">${name}</option>`).join('');
  fromMonthSel.innerHTML = monthOptHtml;
  toMonthSel.innerHTML = monthOptHtml;

  // Year options: 3 years back to 10 years forward, so distant future entries (e.g. 2032) are selectable
  const years = [];
  for(let y = now.getFullYear() - 3; y <= now.getFullYear() + 10; y++) years.push(y);
  const yearOptHtml = years.map(y => `<option value="${y}">${y}</option>`).join('');
  fromYearSel.innerHTML = yearOptHtml;
  toYearSel.innerHTML = yearOptHtml;

  // Default: current month/year for both
  fromMonthSel.value = now.getMonth();
  toMonthSel.value = now.getMonth();
  fromYearSel.value = now.getFullYear();
  toYearSel.value = now.getFullYear();
}

const MC_MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function applyCustomRange(){
  const fm = parseInt(document.getElementById('customFromMonth').value, 10);
  const fy = parseInt(document.getElementById('customFromYear').value, 10);
  const tm = parseInt(document.getElementById('customToMonth').value, 10);
  const ty = parseInt(document.getElementById('customToYear').value, 10);

  const start = new Date(fy, fm, 1);
  const end = new Date(ty, tm + 1, 0, 23, 59, 59);

  // Previous period of equal length, immediately preceding "start"
  const monthSpan = (ty - fy) * 12 + (tm - fm) + 1;
  const prevEnd = new Date(fy, fm, 0, 23, 59, 59);
  const prevStart = new Date(fy, fm - monthSpan, 1);

  const label = `${monthLabel(fy, fm)} – ${monthLabel(ty, tm)}`;
  const prevLabel = `${monthLabel(prevStart.getFullYear(), prevStart.getMonth())} – ${monthLabel(prevEnd.getFullYear(), prevEnd.getMonth())}`;

  currentReportRange = { start, end, label, prevStart, prevEnd, prevLabel };
  refreshReport();
}

// "Prepare for Winter" — shortcut for the Northern Hemisphere cold season, October through May
function prepareForWinter(){
  const now = new Date();
  // If we're currently past May, anchor the winter season starting this October;
  // otherwise (Jan–May) we're likely still inside a winter that started last October.
  let startYear = now.getFullYear();
  if(now.getMonth() < 9) startYear -= 1; // months are 0-indexed; Oct = 9

  setPeriodFilter('custom');
  document.getElementById('customFromMonth').value = 9;  // October
  document.getElementById('customFromYear').value = startYear;
  document.getElementById('customToMonth').value = 4;    // May
  document.getElementById('customToYear').value = startYear + 1;
  applyCustomRange();
}

// Gera opções de referência (ex: meses para "mensal", trimestres p/ "trimestral", etc.)
function populateRefSelect(){
  const sel = document.getElementById('refSelect');
  const now = new Date();
  const options = [];

  if(currentPeriodFilter === 'mensal'){
    for(let i=0;i<12;i++){
      const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
      options.push({value: `${d.getFullYear()}-${d.getMonth()}`, label: monthLabel(d.getFullYear(), d.getMonth())});
    }
  } else if(currentPeriodFilter === 'trimestral'){
    const curQ = Math.floor(now.getMonth()/3);
    for(let i=0;i<8;i++){
      let q = curQ - i, y = now.getFullYear();
      while(q < 0){ q += 4; y -= 1; }
      options.push({value: `${y}-${q}`, label: `Q${q+1} ${y}`});
    }
  } else if(currentPeriodFilter === 'semestral'){
    const curS = Math.floor(now.getMonth()/6);
    for(let i=0;i<6;i++){
      let s = curS - i, y = now.getFullYear();
      while(s < 0){ s += 2; y -= 1; }
      options.push({value: `${y}-${s}`, label: `H${s+1} ${y}`});
    }
  } else if(currentPeriodFilter === 'anual'){
    for(let i=0;i<5;i++){
      const y = now.getFullYear()-i;
      options.push({value: `${y}`, label: `Year ${y}`});
    }
  }

  sel.innerHTML = options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
  onRefChange();
}

function onRefChange(){
  const sel = document.getElementById('refSelect');
  const val = sel.value;
  currentReportRange = computeRange(currentPeriodFilter, val);
  refreshReport();
}

// Calcula início/fim do período atual + do período anterior equivalente
function computeRange(period, refValue){
  let start, end, label, prevStart, prevEnd, prevLabel;

  if(period === 'mensal'){
    const [y,m] = refValue.split('-').map(Number);
    start = new Date(y, m, 1);
    end = new Date(y, m+1, 0, 23,59,59);
    label = monthLabel(y,m);
    prevStart = new Date(y, m-1, 1);
    prevEnd = new Date(y, m, 0, 23,59,59);
    prevLabel = monthLabel(prevStart.getFullYear(), prevStart.getMonth());
  } else if(period === 'trimestral'){
    const [y,q] = refValue.split('-').map(Number);
    start = new Date(y, q*3, 1);
    end = new Date(y, q*3+3, 0, 23,59,59);
    label = `Q${q+1} ${y}`;
    let py=y, pq=q-1;
    if(pq<0){ pq=3; py=y-1; }
    prevStart = new Date(py, pq*3, 1);
    prevEnd = new Date(py, pq*3+3, 0, 23,59,59);
    prevLabel = `Q${pq+1} ${py}`;
  } else if(period === 'semestral'){
    const [y,s] = refValue.split('-').map(Number);
    start = new Date(y, s*6, 1);
    end = new Date(y, s*6+6, 0, 23,59,59);
    label = `H${s+1} ${y}`;
    let py=y, ps=s-1;
    if(ps<0){ ps=1; py=y-1; }
    prevStart = new Date(py, ps*6, 1);
    prevEnd = new Date(py, ps*6+6, 0, 23,59,59);
    prevLabel = `H${ps+1} ${py}`;
  } else { // anual
    const y = Number(refValue);
    start = new Date(y, 0, 1);
    end = new Date(y, 11, 31, 23,59,59);
    label = `Year ${y}`;
    prevStart = new Date(y-1, 0, 1);
    prevEnd = new Date(y-1, 11, 31, 23,59,59);
    prevLabel = `Year ${y-1}`;
  }
  return {start, end, label, prevStart, prevEnd, prevLabel};
}

// ============================================================
// RELATÓRIO — CÁLCULO E RENDER
// ============================================================
function txInRange(list, start, end){
  return list.filter(t => t.data >= start && t.data <= end);
}

function refreshReport(){
  if(!currentReportRange || !document.getElementById('reportKpis')) return;
  const { start, end, label, prevStart, prevEnd, prevLabel } = currentReportRange;

  const curTx = txInRange(transactions, start, end);
  const prevTx = txInRange(transactions, prevStart, prevEnd);

  const totalCur = curTx.reduce((s,t)=>s+t.valor,0);
  const totalPrev = prevTx.reduce((s,t)=>s+t.valor,0);
  const variacao = totalPrev > 0 ? ((totalCur-totalPrev)/totalPrev*100) : (totalCur>0?100:0);

  // média mensal dentro do período
  const monthsInPeriod = Math.max(1, Math.round((end - start) / (1000*60*60*24*30)));
  const mediaMensal = totalCur / monthsInPeriod;

  // categoria de maior impacto
  const byCat = {};
  curTx.forEach(t => { byCat[t.categoryId] = (byCat[t.categoryId]||0) + t.valor; });
  let topCatId=null, topCatVal=0;
  Object.entries(byCat).forEach(([id,val]) => { if(val>topCatVal){topCatVal=val;topCatId=id;} });
  const topCat = topCatId ? categoryById(topCatId) : null;

  // % economia -- aqui como não há receitas cadastradas, expressamos como redução de gasto vs período anterior
  const economiaPct = totalPrev > 0 ? Math.max(0, ((totalPrev-totalCur)/totalPrev*100)) : 0;

  document.getElementById('reportKpis').innerHTML = `
    <div class="kpi-card">
      <div class="label">Total spent — ${label}</div>
      <div class="value danger">${formatCurrency(totalCur)}</div>
      <div class="sub ${variacao>=0?'up':'down'}">${variacao>=0?'▲':'▼'} ${Math.abs(variacao).toFixed(1)}% vs ${prevLabel}</div>
    </div>
    <div class="kpi-card">
      <div class="label">Average monthly spending</div>
      <div class="value">${formatCurrency(mediaMensal)}</div>
      <div class="sub">for the selected period</div>
    </div>
    <div class="kpi-card">
      <div class="label">Top spending category</div>
      <div class="value" style="font-size:18px;">${topCat ? topCat.icone+' '+topCat.nome : '—'}</div>
      <div class="sub">${topCat ? formatCurrency(topCatVal) : 'No entries'}</div>
    </div>
    <div class="kpi-card">
      <div class="label">Savings vs previous period</div>
      <div class="value success">${economiaPct.toFixed(1)}%</div>
      <div class="sub">reduction in spending</div>
    </div>
  `;

  renderComparativoChart(curTx, prevTx, label, prevLabel);
  renderDistribuicaoChart(curTx);
  renderReportTxList(curTx);
}

function renderComparativoChart(curTx, prevTx, label, prevLabel){
  const ctx = document.getElementById('chartComparativo');
  const allCatIds = [...new Set([...curTx.map(t=>t.categoryId), ...prevTx.map(t=>t.categoryId)])];
  const curByCat = {}, prevByCat = {};
  curTx.forEach(t => curByCat[t.categoryId] = (curByCat[t.categoryId]||0)+t.valor);
  prevTx.forEach(t => prevByCat[t.categoryId] = (prevByCat[t.categoryId]||0)+t.valor);

  const labels = allCatIds.map(id => categoryById(id).nome);

  if(reportCharts.comparativo) reportCharts.comparativo.destroy();
  reportCharts.comparativo = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: prevLabel, data: allCatIds.map(id => prevByCat[id]||0), backgroundColor: '#cbd5e1' },
        { label: label, data: allCatIds.map(id => curByCat[id]||0), backgroundColor: '#2563eb' }
      ]
    },
    options: { responsive:true, maintainAspectRatio:false, scales:{ y:{ ticks:{callback: v=>'R$ '+v} } } }
  });
}

function renderDistribuicaoChart(curTx){
  const ctx = document.getElementById('chartDistribuicao');
  const byCat = {};
  curTx.forEach(t => byCat[t.categoryId] = (byCat[t.categoryId]||0)+t.valor);
  const entries = Object.entries(byCat);
  if(reportCharts.distribuicao) reportCharts.distribuicao.destroy();
  if(entries.length === 0) return;
  reportCharts.distribuicao = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: entries.map(([id])=>categoryById(id).nome),
      datasets: [{ data: entries.map(([,v])=>v), backgroundColor: entries.map(([id])=>categoryById(id).cor) }]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom',labels:{boxWidth:12,font:{size:11}}}} }
  });
}

function renderReportTxList(curTx){
  const el = document.getElementById('reportTxList');
  const sorted = [...curTx].sort((a,b) => b.data - a.data);
  if(sorted.length === 0){
    el.innerHTML = `<div class="empty-state"><div class="icon">📭</div>No expenses in this period.</div>`;
    return;
  }
  el.innerHTML = `
    <table class="tx-table">
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th style="text-align:right">Amount</th><th></th></tr></thead>
      <tbody>
        ${sorted.map(t => {
          const cat = categoryById(t.categoryId);
          return `<tr>
            <td>${formatDate(t.data)}</td>
            <td>${t.descricao}</td>
            <td><span class="cat-badge" style="background:${cat.cor}22">${cat.icone} ${cat.nome}</span></td>
            <td class="valor">${formatCurrency(t.valor)}</td>
            <td><button class="btn-edit" onclick="openEditTransaction('${t.id}')" title="Edit">✏️</button><button class="btn-del" onclick="deleteTransaction('${t.id}')" title="Delete">🗑️</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  `;
}

// ============================================================
// EXPORTAÇÃO CSV
// ============================================================
function exportCSV(){
  if(!currentReportRange) return;
  const { start, end, label } = currentReportRange;
  const curTx = txInRange(transactions, start, end).sort((a,b)=>b.data-a.data);

  let csv = 'Data;Descricao;Categoria;Valor\n';
  curTx.forEach(t => {
    const cat = categoryById(t.categoryId);
    csv += `${formatDate(t.data)};${t.descricao.replace(/;/g,',')};${cat.nome};${t.valor.toFixed(2).replace('.',',')}\n`;
  });
  const total = curTx.reduce((s,t)=>s+t.valor,0);
  csv += `\n;;Total;${total.toFixed(2).replace('.',',')}\n`;

  const blob = new Blob(["\uFEFF" + csv], {type:'text/csv;charset=utf-8;'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `report_${label.replace(/\s+/g,'_')}.csv`;
  link.click();
}

// ============================================================
// EXPORTAÇÃO PDF
// ============================================================
function exportPDF(){
  if(!currentReportRange) return;
  const { start, end, label, prevLabel } = currentReportRange;
  const curTx = txInRange(transactions, start, end).sort((a,b)=>b.data-a.data);
  const total = curTx.reduce((s,t)=>s+t.valor,0);

  const byCat = {};
  curTx.forEach(t => byCat[t.categoryId] = (byCat[t.categoryId]||0)+t.valor);
  let topCatId=null, topCatVal=0;
  Object.entries(byCat).forEach(([id,val]) => { if(val>topCatVal){topCatVal=val;topCatId=id;} });
  const topCat = topCatId ? categoryById(topCatId) : null;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.setTextColor(37,99,235);
  doc.text('Expense Report', 14, 18);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Period: ${label}`, 14, 26);
  doc.text(`Issued on: ${formatDate(new Date())}`, 14, 32);

  doc.setFontSize(12);
  doc.setTextColor(30);
  doc.text(`Total spent: ${formatCurrency(total)}`, 14, 44);
  doc.text(`Top spending category: ${topCat ? topCat.nome+' ('+formatCurrency(topCatVal)+')' : '—'}`, 14, 51);
  doc.text(`Number of entries: ${curTx.length}`, 14, 58);

  doc.autoTable({
    startY: 66,
    head: [['Date', 'Description', 'Category', 'Amount']],
    body: curTx.map(t => [
      formatDate(t.data), t.descricao, categoryById(t.categoryId).nome, formatCurrency(t.valor)
    ]),
    foot: [['', '', 'TOTAL', formatCurrency(total)]],
    theme: 'grid',
    headStyles: { fillColor: [37,99,235] },
    footStyles: { fillColor: [241,245,249], textColor: [30,41,59], fontStyle: 'bold' },
    styles: { fontSize: 9 }
  });

  doc.save(`report_${label.replace(/\s+/g,'_')}.pdf`);
}

// ============================================================
// TAB ACCOUNTS/CATEGORIES — full detailed view per category
// ============================================================
function renderContasShell(){
  const el = document.getElementById('tab-contas');
  el.innerHTML = `
    <div class="chart-card" style="margin-bottom:20px;">
      <h3>🗂️ Accounts &amp; Categories</h3>
      <p class="hint" style="margin-top:-6px;margin-bottom:16px;">Click a category to see its full detail — total amount, all entries and instalments, across all years.</p>
      <div id="accountsGrid" class="accounts-grid"></div>
    </div>
    <div id="accountDetail"></div>
  `;
}

function refreshContas(){
  const grid = document.getElementById('accountsGrid');
  if(!grid) return;

  if(categories.length === 0){
    grid.innerHTML = `<div class="empty-state"><div class="icon">🏷️</div>No categories yet.</div>`;
    return;
  }

  grid.innerHTML = categories.map(cat => {
    const catTx = transactions.filter(t => t.categoryId === cat.id);
    const total = catTx.reduce((s,t) => s+t.valor, 0);
    return `
      <div class="account-card" style="border-left:4px solid ${cat.cor}" onclick="showAccountDetail('${cat.id}')">
        <div class="account-icon">${cat.icone}</div>
        <div class="account-name">${cat.nome}</div>
        <div class="account-total">${formatCurrency(total)}</div>
        <div class="account-count">${catTx.length} entr${catTx.length===1?'y':'ies'}</div>
      </div>
    `;
  }).join('');

  // keep detail view in sync if one is currently open
  if(window.currentAccountDetailId){
    showAccountDetail(window.currentAccountDetailId);
  }
}

function showAccountDetail(categoryId){
  window.currentAccountDetailId = categoryId;
  const cat = categoryById(categoryId);
  const catTx = transactions.filter(t => t.categoryId === categoryId).sort((a,b) => a.data - b.data);
  const total = catTx.reduce((s,t) => s+t.valor, 0);

  // group by year to make instalments/recurring entries easy to scan
  const byYear = {};
  catTx.forEach(t => {
    const y = t.data.getFullYear();
    if(!byYear[y]) byYear[y] = [];
    byYear[y].push(t);
  });

  const detailEl = document.getElementById('accountDetail');
  detailEl.innerHTML = `
    <div class="chart-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:18px;">
        <div>
          <h3 style="margin-bottom:4px;">${cat.icone} ${cat.nome} — Full Detail</h3>
          <p class="hint" style="margin:0;">${catTx.length} entr${catTx.length===1?'y':'ies'} across ${Object.keys(byYear).length} year(s)</p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:12px;color:var(--text-muted);">Total (all time)</div>
          <div style="font-size:24px;font-weight:700;color:${cat.cor};">${formatCurrency(total)}</div>
        </div>
      </div>

      ${catTx.length === 0 ? `<div class="empty-state"><div class="icon">📭</div>No entries in this category yet.</div>` :
        Object.keys(byYear).sort().map(y => {
          const yearTx = byYear[y];
          const yearTotal = yearTx.reduce((s,t)=>s+t.valor,0);
          return `
            <div style="margin-bottom:18px;">
              <div style="font-size:13px;font-weight:700;color:${cat.cor};margin-bottom:8px;">
                ${y} — ${formatCurrency(yearTotal)} (${yearTx.length} entr${yearTx.length===1?'y':'ies'})
              </div>
              <table class="tx-table">
                <thead><tr><th>Date</th><th>Description</th><th style="text-align:right">Amount</th><th></th></tr></thead>
                <tbody>
                  ${yearTx.map(t => `
                    <tr>
                      <td>${formatDate(t.data)} ${t.recorrente ? '<span title="Part of a recurring series">🔁</span>' : ''}</td>
                      <td>${t.descricao}</td>
                      <td class="valor">${formatCurrency(t.valor)}</td>
                      <td style="white-space:nowrap;">
                        <button class="btn-edit" onclick="openEditTransaction('${t.id}')" title="Edit">✏️</button>
                        <button class="btn-del" onclick="deleteTransaction('${t.id}')" title="Delete">🗑️</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;
        }).join('')
      }
    </div>
  `;
}

// ============================================================
// MODAL — generic open/close
// ============================================================
function openModal(html){
  document.getElementById('modalBox').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal(){
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('modalBox').innerHTML = '';
}
// close modal when clicking the dark overlay (but not the box itself)
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modalOverlay');
  if(overlay){
    overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(); });
  }
});

// ============================================================
// EDIT TRANSACTION
// ============================================================
function openEditTransaction(id){
  const tx = transactions.find(t => t.id === id);
  if(!tx) return;
  const catOptions = categories.map(c => `<option value="${c.id}" ${c.id===tx.categoryId?'selected':''}>${c.icone} ${c.nome}</option>`).join('');

  openModal(`
    <h2>✏️ Edit Expense</h2>
    <form id="editTxForm">
      <div class="form-row">
        <div class="field">
          <label>Amount (CAD)</label>
          <input type="number" step="0.01" min="0" id="editTxValor" value="${tx.valor}" required>
        </div>
        <div class="field">
          <label>Date</label>
          <input type="date" id="editTxData" lang="en-CA" value="${toISODateSimple(tx.data)}" required>
        </div>
      </div>
      <div class="form-row">
        <div class="field field-full">
          <label>Category</label>
          <select id="editTxCategoria" required>${catOptions}</select>
        </div>
      </div>
      <div class="form-row">
        <div class="field field-full">
          <label>Description</label>
          <input type="text" id="editTxDescricao" value="${tx.descricao.replace(/"/g,'&quot;')}">
        </div>
      </div>
      ${tx.recorrente ? `<p class="hint">🔁 This entry is part of a recurring series. Editing it only changes this single month's entry.</p>` : ''}
      <div id="editTxMsg" style="font-size:13px;color:var(--danger);min-height:16px;"></div>
      <div class="modal-actions">
        <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn-primary">Save Changes</button>
      </div>
    </form>
  `);

  document.getElementById('editTxForm').addEventListener('submit', (e) => saveEditedTransaction(e, id));
}

function toISODateSimple(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

async function saveEditedTransaction(e, id){
  e.preventDefault();
  const msg = document.getElementById('editTxMsg');
  const valor = parseFloat(document.getElementById('editTxValor').value);
  const categoryId = document.getElementById('editTxCategoria').value;
  const descricao = document.getElementById('editTxDescricao').value.trim();
  const dataStr = document.getElementById('editTxData').value;

  if(!valor || valor <= 0 || !categoryId || !dataStr){
    msg.textContent = 'Please fill in amount, category and date correctly.';
    return;
  }

  const [y, m, day] = dataStr.split('-').map(Number);
  const newDate = new Date(y, m-1, day, 12, 0, 0);

  try{
    await db.collection('cc_exp_transactions').doc(id).update({
      valor, categoryId,
      descricao: descricao || '(no description)',
      data: firebase.firestore.Timestamp.fromDate(newDate),
    });

    // update local cache
    const idx = transactions.findIndex(t => t.id === id);
    if(idx !== -1){
      transactions[idx] = { ...transactions[idx], valor, categoryId, descricao: descricao || '(no description)', data: newDate };
      transactions.sort((a,b) => b.data - a.data);
    }

    closeModal();
    refreshDashboard();
    refreshReport();
    refreshContas();
  }catch(err){
    console.error('Error updating expense', err);
    msg.textContent = `Could not save: ${err.code || err.message || 'unknown error'}`;
  }
}

// ============================================================
// EDIT CATEGORY
// ============================================================
function openEditCategory(id){
  const cat = categories.find(c => c.id === id);
  if(!cat) return;

  openModal(`
    <h2>✏️ Edit Category</h2>
    <form id="editCatForm">
      <div class="form-row">
        <div class="field field-full">
          <label>Name</label>
          <input type="text" id="editCatNome" value="${cat.nome.replace(/"/g,'&quot;')}" required>
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Icon (emoji)</label>
          <input type="text" id="editCatIcone" value="${cat.icone}" maxlength="4" style="text-align:center;font-size:18px;">
        </div>
        <div class="field">
          <label>Color</label>
          <input type="color" id="editCatCor" value="${cat.cor}" style="height:44px;padding:4px;">
        </div>
      </div>
      <div id="editCatMsg" style="font-size:13px;color:var(--danger);min-height:16px;"></div>
      <div class="modal-actions">
        <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn-primary">Save Changes</button>
      </div>
    </form>
  `);

  document.getElementById('editCatForm').addEventListener('submit', (e) => saveEditedCategory(e, id));
}

async function saveEditedCategory(e, id){
  e.preventDefault();
  const msg = document.getElementById('editCatMsg');
  const nome = document.getElementById('editCatNome').value.trim();
  const icone = document.getElementById('editCatIcone').value.trim() || '🏷️';
  const cor = document.getElementById('editCatCor').value;

  if(!nome){
    msg.textContent = 'Category name is required.';
    return;
  }

  try{
    await db.collection('cc_exp_categories').doc(id).update({ nome, icone, cor });
    const idx = categories.findIndex(c => c.id === id);
    if(idx !== -1) categories[idx] = { ...categories[idx], nome, icone, cor };

    closeModal();
    renderCategoryChips();
    populateCategorySelects();
    refreshDashboard();
    refreshReport();
    refreshContas();
  }catch(err){
    console.error('Error updating category', err);
    msg.textContent = `Could not save: ${err.code || err.message || 'unknown error'}`;
  }
}
