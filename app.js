/* ============================================================
   CONTROLE FINANCEIRO PESSOAL — app.js
   Padrão: single-file style app (Firebase Firestore + GitHub Pages)
   ============================================================ */

// ---------- CONFIGURAÇÃO FIREBASE ----------
// TODO: substituir pelos dados do seu projeto Firebase (Console > Configurações do Projeto)
const firebaseConfig = {
  apiKey: "AIzaSyB1f40f6pyJrebL-bWRgHaMiGVzMBX_9Wg",
  authDomain: "finance-control-b42ed.firebaseapp.com",
  projectId: "finance-control-b42ed",
  storageBucket: "finance-control-b42ed.firebasestorage.app",
  messagingSenderId: "854815724997",
  appId: "1:854815724997:web:6b3fc6993ca600ca0d67ac"
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
const ACCESS_PASSWORD = "finance@admin"; // troque aqui quando quiser
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
    const snap = await db.collection('fc_categories').orderBy('nome').get();
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
    {nome:"Food", icone:"🍽️"},
    {nome:"Transportation", icone:"🚗"},
    {nome:"Housing", icone:"🏠"},
    {nome:"Health", icone:"🩺"},
    {nome:"Entertainment", icone:"🎉"},
    {nome:"Education", icone:"📚"},
    {nome:"Other", icone:"🏷️"}
  ];
  for(let i=0;i<defaults.length;i++){
    await db.collection('fc_categories').add({
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
    await db.collection('fc_categories').add({
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
    await db.collection('fc_categories').doc(id).delete();
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
    const snap = await db.collection('fc_transactions').orderBy('data', 'desc').get();
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
        const docRef = db.collection('fc_transactions').doc();
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
      const docRef = db.collection('fc_transactions').doc();
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
    await db.collection('fc_transactions').doc(id).delete();
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
    toDelete.forEach(t => batch.delete(db.collection('fc_transactions').doc(t.id)));
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
    await db.collection('fc_transactions').doc(id).update({
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
    await db.collection('fc_categories').doc(id).update({ nome, icone, cor });
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
