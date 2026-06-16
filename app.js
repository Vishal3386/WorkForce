// ══════════════════════════════════════════════════
// STATE & ROLE CONFIG
// ══════════════════════════════════════════════════
let currentRole = 'admin';
let currentUser = 'Rajesh Sharma';
let currentSiteView = null;

const ROLES = {
  admin:   { name:'Rajesh Sharma', label:'Admin Panel',   avatar:'R', greeting:'Rajesh',  assignedSites:['all'] },
  manager: { name:'Suresh Patel',  label:'Manager Panel', avatar:'S', greeting:'Suresh',  assignedSites:['Site B – Wakad','Site E – Baner'] },
  senior:  { name:'Deepak Singh',  label:'Senior Staff',  avatar:'D', greeting:'Deepak',  assignedSites:['Site A – MG Road'] },
  staff:   { name:'Amit Kumar',    label:'Staff App',     avatar:'A', greeting:'Amit',    assignedSites:['Site A – MG Road'] },
};

// Role permission matrix
const PERMS = {
  admin:   { viewAllPayroll:true,  viewOthersAtt:true,  viewAllEmployees:true,  canApprove:true,  canAssignTask:true,  viewWallet:true,   viewBanking:true,  viewReports:true,  canAddEmployee:true  },
  manager: { viewAllPayroll:false, viewOthersAtt:true,  viewAllEmployees:true,  canApprove:true,  canAssignTask:true,  viewWallet:false,  viewBanking:false, viewReports:true,  canAddEmployee:false },
  senior:  { viewAllPayroll:false, viewOthersAtt:false, viewAllEmployees:false, canApprove:false, canAssignTask:true,  viewWallet:false,  viewBanking:false, viewReports:false, canAddEmployee:false },
  staff:   { viewAllPayroll:false, viewOthersAtt:false, viewAllEmployees:false, canApprove:false, canAssignTask:false, viewWallet:false,  viewBanking:false, viewReports:false, canAddEmployee:false },
};

// ══════════════════════════════════════════════════
// SAMPLE DATA
// ══════════════════════════════════════════════════
const employees = [
  { id:1, name:'Amit Kumar',   role:'Manager',      dept:'Construction', phone:'9876501001', status:'Active', salary:32000, type:'Regular',     site:'Site A – MG Road',   color:'#388BFD', checkin:'09:02', checkout:'18:15', hours:'9h 13m', attStatus:'Present' },
  { id:2, name:'Suresh Patel', role:'Manager',      dept:'Security',     phone:'9876501002', status:'Active', salary:28000, type:'Regular',     site:'Site B – Wakad',     color:'#3FB950', checkin:'08:55', checkout:'',      hours:'Live',   attStatus:'Present' },
  { id:3, name:'Deepak Singh', role:'Senior Staff', dept:'Construction', phone:'9876501003', status:'Active', salary:22000, type:'Regular',     site:'Site A – MG Road',   color:'#A371F7', checkin:'09:30', checkout:'18:00', hours:'8h 30m', attStatus:'Present' },
  { id:4, name:'Ravi Sharma',  role:'Staff',        dept:'Construction', phone:'9876501004', status:'Active', salary:16000, type:'Daily Wage',  site:'Site C – Hinjewadi', color:'#F0883E', checkin:'',      checkout:'',      hours:'—',      attStatus:'Absent'  },
  { id:5, name:'Priya Verma',  role:'Staff',        dept:'Admin',        phone:'9876501005', status:'Active', salary:18000, type:'Regular',     site:'Head Office',        color:'#E3B341', checkin:'09:10', checkout:'',      hours:'Live',   attStatus:'Present' },
  { id:6, name:'Mohit Gupta',  role:'Staff',        dept:'Housekeeping', phone:'9876501006', status:'Active', salary:14000, type:'Contractual', site:'Site D – Kothrud',   color:'#39C5CF', checkin:'08:00', checkout:'16:00', hours:'8h',     attStatus:'Present' },
  { id:7, name:'Kavita Nair',  role:'Staff',        dept:'Security',     phone:'9876501007', status:'Active', salary:15000, type:'Regular',     site:'Site B – Wakad',     color:'#F85149', checkin:'',      checkout:'',      hours:'—',      attStatus:'On Leave'},
  { id:8, name:'Sanjay Pawar', role:'Staff',        dept:'Construction', phone:'9876501008', status:'Active', salary:17000, type:'Daily Wage',  site:'Site A – MG Road',   color:'#388BFD', checkin:'09:00', checkout:'17:30', hours:'8h 30m', attStatus:'Present' },
];

const leavesPending = [
  { name:'Kavita Nair', type:'Sick Leave',     from:'2025-06-10', to:'2025-06-12', days:3, reason:'Fever and cold' },
  { name:'Ravi Sharma', type:'Casual Leave',   from:'2025-06-14', to:'2025-06-14', days:1, reason:'Personal work' },
  { name:'Mohit Gupta', type:'Privilege Leave',from:'2025-06-20', to:'2025-06-22', days:3, reason:'Family function' },
];
const leavesApproved = [
  { name:'Deepak Singh', type:'Casual Leave', from:'2025-06-05', to:'2025-06-05', days:1, by:'Admin (Rajesh)' },
  { name:'Priya Verma',  type:'Sick Leave',   from:'2025-06-02', to:'2025-06-03', days:2, by:'Manager (Suresh)' },
];
const leavesRejected = [
  { name:'Sanjay Pawar', type:'Privilege Leave', from:'2025-06-15', to:'2025-06-18', days:4, reason:'Peak work period' },
];

const sites = [
  { name:'Site A – MG Road',   addr:'MG Road, Pune',    manager:'Amit Kumar',   assigned:12, present:10, progress:68, cost:'₹1.2L', alert:false, color:'#388BFD', lat:18.5204, lng:73.8567 },
  { name:'Site B – Wakad',     addr:'Wakad, Pune',      manager:'Suresh Patel', assigned:8,  present:7,  progress:45, cost:'₹0.8L', alert:false, color:'#3FB950', lat:18.5908, lng:73.7610 },
  { name:'Site C – Hinjewadi', addr:'Hinjewadi, Pune',  manager:'Deepak Singh', assigned:10, present:6,  progress:30, cost:'₹0.6L', alert:true,  color:'#F85149', lat:18.5930, lng:73.7384 },
  { name:'Site D – Kothrud',   addr:'Kothrud, Pune',    manager:'Mohit Gupta',  assigned:6,  present:6,  progress:85, cost:'₹0.5L', alert:false, color:'#A371F7', lat:18.5074, lng:73.8077 },
  { name:'Site E – Baner',     addr:'Baner, Pune',      manager:'Amit Kumar',   assigned:9,  present:8,  progress:55, cost:'₹0.9L', alert:false, color:'#F0883E', lat:18.5590, lng:73.7868 },
];

const tasks = [
  { title:'Foundation inspection – Block A', emp:'Deepak Singh', type:'Daily',   due:'2025-06-11', priority:'High',   status:'pending', site:'Site A – MG Road',   progress:0   },
  { title:'Security audit – Night shift',    emp:'Kavita Nair',  type:'Weekly',  due:'2025-06-14', priority:'Medium', status:'pending', site:'Site B – Wakad',     progress:40  },
  { title:'Material delivery verification',  emp:'Ravi Sharma',  type:'Daily',   due:'2025-06-10', priority:'High',   status:'overdue', site:'Site C – Hinjewadi', progress:0   },
  { title:'Monthly safety briefing',         emp:'Amit Kumar',   type:'Monthly', due:'2025-06-25', priority:'Low',    status:'pending', site:'All',                progress:20  },
  { title:'Site B equipment servicing',      emp:'Sanjay Pawar', type:'Weekly',  due:'2025-06-09', priority:'High',   status:'overdue', site:'Site B – Wakad',     progress:60  },
  { title:'Housekeeping roster update',      emp:'Mohit Gupta',  type:'Monthly', due:'2025-06-30', priority:'Low',    status:'pending', site:'Site D – Kothrud',   progress:10  },
  { title:'Attendance QR refresh – Site A',  emp:'Suresh Patel', type:'Daily',   due:'2025-06-11', priority:'Medium', status:'done',    site:'Site A – MG Road',   progress:100 },
  { title:'Progress report submission',      emp:'Deepak Singh', type:'Daily',   due:'2025-06-10', priority:'Medium', status:'done',    site:'Site A – MG Road',   progress:100 },
];

const expenses = [
  { date:'11 Jun', to:'Amit Kumar',   cat:'Materials',  amt:12000, mode:'UPI',          site:'Site A – MG Road', bill:'✅', balance:'₹88,000' },
  { date:'10 Jun', to:'Suresh Patel', cat:'Transport',  amt:3500,  mode:'Cash',         site:'Site B – Wakad',   bill:'✅', balance:'₹46,500' },
  { date:'09 Jun', to:'Deepak Singh', cat:'Fuel',       amt:2000,  mode:'Cash',         site:'Site A – MG Road', bill:'✅', balance:'₹18,000' },
  { date:'08 Jun', to:'Amit Kumar',   cat:'Tools',      amt:8000,  mode:'Bank Transfer',site:'Site A – MG Road', bill:'✅', balance:'₹100,000'},
  { date:'07 Jun', to:'Ravi Sharma',  cat:'Food',       amt:1500,  mode:'Cash',         site:'Site C – Hinjewadi',bill:'❌',balance:'₹22,000' },
  { date:'06 Jun', to:'Suresh Patel', cat:'Salary',     amt:28000, mode:'Bank Transfer',site:'Site B – Wakad',   bill:'✅', balance:'₹50,000' },
];

const walletData = [
  { name:'Amit Kumar',   role:'Manager', allocated:100000, spent:62000, lastTx:'11 Jun – Materials ₹12K', bills:8  },
  { name:'Suresh Patel', role:'Manager', allocated:80000,  spent:33500, lastTx:'10 Jun – Transport ₹3.5K',bills:5  },
  { name:'Deepak Singh', role:'Senior',  allocated:30000,  spent:12000, lastTx:'09 Jun – Fuel ₹2K',       bills:3  },
  { name:'Ravi Sharma',  role:'Staff',   allocated:25000,  spent:3000,  lastTx:'07 Jun – Food ₹1.5K',     bills:2  },
  { name:'Mohit Gupta',  role:'Staff',   allocated:20000,  spent:1200,  lastTx:'05 Jun – Supplies ₹1.2K', bills:1  },
];

const walletLedger = [
  { date:'11 Jun', staff:'Amit Kumar',   type:'Expense',          cat:'Materials',  amt:12000, mode:'UPI',   bill:'📸', balAfter:'₹38,000' },
  { date:'11 Jun', staff:'Suresh Patel', type:'Fund Allocated',   cat:'—',          amt:30000, mode:'Cash',  bill:'—',  balAfter:'₹46,500' },
  { date:'10 Jun', staff:'Suresh Patel', type:'Expense',          cat:'Transport',  amt:3500,  mode:'Cash',  bill:'📸', balAfter:'₹16,500' },
  { date:'09 Jun', staff:'Deepak Singh', type:'Expense',          cat:'Fuel',       amt:2000,  mode:'Cash',  bill:'📸', balAfter:'₹18,000' },
  { date:'08 Jun', staff:'Amit Kumar',   type:'Purchase',         cat:'Tools',      amt:8000,  mode:'NEFT',  bill:'📸', balAfter:'₹50,000' },
  { date:'07 Jun', staff:'Ravi Sharma',  type:'Expense',          cat:'Food',       amt:1500,  mode:'Cash',  bill:'❌', balAfter:'₹22,000' },
  { date:'06 Jun', staff:'Amit Kumar',   type:'Fund Allocated',   cat:'—',          amt:50000, mode:'Cash',  bill:'—',  balAfter:'₹58,000' },
];

const transactions = [
  { date:'11 Jun', bank:'SBI – 4521',  type:'Debit',  party:'Cement Traders',   amt:50000,  mode:'Cheque', ref:'CHQ2345', chequeDate:'15 Jun', proof:'✅' },
  { date:'10 Jun', bank:'HDFC – 7832', type:'Credit', party:'Client – ABC Corp', amt:200000, mode:'NEFT',   ref:'UTR8821', chequeDate:'—',      proof:'✅' },
  { date:'09 Jun', bank:'SBI – 4521',  type:'Debit',  party:'Suresh Patel',     amt:28000,  mode:'NEFT',   ref:'TRF2231', chequeDate:'—',      proof:'✅' },
  { date:'08 Jun', bank:'HDFC – 7832', type:'Debit',  party:'Iron Suppliers',   amt:75000,  mode:'Cheque', ref:'CHQ2301', chequeDate:'20 Jun', proof:'✅' },
];

const notifications = [
  { icon:'🏖️', bg:'var(--orange-dim)', text:'Kavita Nair applied for Sick Leave (10 Jun – 12 Jun). Needs approval.', time:'2 hours ago', unread:true  },
  { icon:'⚠️', bg:'var(--red-dim)',    text:'Site C – Hinjewadi is understaffed. 4 required, 6 present.',           time:'3 hours ago', unread:true  },
  { icon:'💰', bg:'var(--green-dim)',  text:'Reimbursement request: Deepak Singh – ₹3,500 for Tools at Site A.',    time:'5 hours ago', unread:true  },
  { icon:'📋', bg:'var(--blue-dim)',   text:'Payroll for June 2025 is due in 8 days. Total: ₹4,20,000',             time:'1 day ago',   unread:true  },
  { icon:'🏦', bg:'var(--yellow-dim)', text:'Cheque of ₹50,000 to Cement Traders due for withdrawal on 15 Jun.',   time:'1 day ago',   unread:true  },
  { icon:'✅', bg:'var(--green-dim)',  text:'Mohit Gupta checked in at Site D – 08:00 AM.',                         time:'Today 8:00',  unread:false },
  { icon:'📢', bg:'var(--purple-dim)', text:'Announcement: No work on 15 June – Company Holiday (Eid ul-Adha)',     time:'Yesterday',   unread:false },
];

const assets = [
  { name:'Drilling Machine',   cat:'Equipment',   date:'01 Mar 2025', value:'₹24,000', emp:'Deepak Singh', site:'Site A – MG Road', status:'Active' },
  { name:'Safety Helmets (10)',cat:'Safety',      date:'15 Jan 2025', value:'₹8,000',  emp:'—',            site:'Site B – Wakad',   status:'Active' },
  { name:'Generator',          cat:'Equipment',   date:'10 Feb 2025', value:'₹45,000', emp:'Amit Kumar',   site:'Site C – Hinjewadi',status:'Active'},
  { name:'Laptop – HP',        cat:'Electronics', date:'20 Dec 2024', value:'₹55,000', emp:'Suresh Patel', site:'HO',               status:'Active' },
];

const reimbs = [
  { emp:'Deepak Singh', item:'Cement bags (extra)',   amt:'₹3,500', date:'10 Jun', bill:'📸', status:'pending'  },
  { emp:'Ravi Sharma',  item:'Petrol for site visit', amt:'₹800',   date:'08 Jun', bill:'📸', status:'approved' },
  { emp:'Mohit Gupta',  item:'Cleaning supplies',     amt:'₹1,200', date:'05 Jun', bill:'📸', status:'approved' },
];

const ondutyData = [
  { emp:'Amit Kumar',   from:'2025-06-12', to:'2025-06-12', days:1, loc:'Client Meeting – Baner', reason:'Project discussion',  status:'approved' },
  { emp:'Suresh Patel', from:'2025-06-14', to:'2025-06-15', days:2, loc:'Govt Office – Camp',     reason:'Labour license',      status:'pending'  },
  { emp:'Priya Verma',  from:'2025-06-11', to:'2025-06-11', days:1, loc:'Bank – FC Road',         reason:'Payroll submission',  status:'approved' },
];

const documents = [
  { name:'Labour Contract – Site A',    type:'Contract',  site:'Site A – MG Road',   date:'01 Jan 2025', expiry:'31 Dec 2025', size:'2.4 MB', icon:'📄' },
  { name:'Building Permit – Site A',    type:'Permit',    site:'Site A – MG Road',   date:'15 Mar 2025', expiry:'14 Mar 2026', size:'1.1 MB', icon:'🏛️' },
  { name:'Safety Certificate – Site B', type:'Safety Certificate', site:'Site B – Wakad', date:'10 Feb 2025', expiry:'09 Feb 2026', size:'0.8 MB', icon:'🛡️' },
  { name:'Site Agreement – Site C',     type:'Agreement', site:'Site C – Hinjewadi', date:'20 Apr 2025', expiry:'19 Apr 2026', size:'3.2 MB', icon:'🤝' },
  { name:'Architectural Drawing – A3',  type:'Drawing',   site:'Site A – MG Road',   date:'05 May 2025', expiry:'—',           size:'8.7 MB', icon:'📐' },
  { name:'Sub-Contractor Invoice – SB', type:'Invoice',   site:'Site B – Wakad',     date:'11 Jun 2025', expiry:'—',           size:'0.5 MB', icon:'🧾' },
];

const reportsList = [
  { icon:'📋', name:'Attendance Report',  desc:'Daily/monthly attendance with check-in/out',   color:'var(--blue)',   roles:['admin','manager'] },
  { icon:'💰', name:'Payroll Report',     desc:'Monthly salary with deductions and net pay',    color:'var(--purple)', roles:['admin'] },
  { icon:'💸', name:'Expense Report',     desc:'All expenses by category, person, date range',  color:'var(--red)',    roles:['admin','manager'] },
  { icon:'📒', name:'Ledger Report',      desc:'Fund given vs spent vs balance per person',     color:'var(--green)',  roles:['admin'] },
  { icon:'🏖️', name:'Leave Report',       desc:'Leave taken and balance remaining',             color:'var(--orange)', roles:['admin','manager'] },
  { icon:'🏗️', name:'Site Cost Report',   desc:'Total cost incurred per site',                  color:'var(--cyan)',   roles:['admin','manager'] },
  { icon:'✅', name:'Task Report',        desc:'Assigned, completed, pending, overdue tasks',  color:'var(--yellow)', roles:['admin','manager'] },
  { icon:'📦', name:'Asset Report',       desc:'All company assets, assigned, status',          color:'var(--blue)',   roles:['admin'] },
  { icon:'💳', name:'Banking Ledger',     desc:'All transactions bank-wise',                   color:'var(--green)',  roles:['admin'] },
  { icon:'📊', name:'Cash Flow Report',   desc:'Total inflow vs outflow across all banks',     color:'var(--purple)', roles:['admin'] },
  { icon:'🧾', name:'CA Report',          desc:'Summary for Chartered Accountant',              color:'var(--orange)', roles:['admin'] },
  { icon:'📈', name:'Tally Export',       desc:'Export to Tally-compatible format',            color:'var(--cyan)',   roles:['admin'] },
];

// ══════════════════════════════════════════════════
// LOGIN & ROLE SYSTEM
// ══════════════════════════════════════════════════
function loginAs(role) {
  currentRole = role;
  const r = ROLES[role];
  currentUser = r.name;
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  document.getElementById('role-label').textContent = r.label;
  document.getElementById('sidebar-user').textContent = r.name;
  document.getElementById('sidebar-role-tag').textContent = role.charAt(0).toUpperCase()+role.slice(1);
  document.getElementById('sidebar-av').textContent = r.avatar;
  document.getElementById('top-av').textContent = r.avatar;
  document.getElementById('dash-greeting').textContent = `Good Morning, ${r.greeting} 👋`;
  applyRoleUI(role);
  initAll();
  showToast(`Welcome, ${r.name}! Logged in as ${role.charAt(0).toUpperCase()+role.slice(1)}`, 'success');
}

function applyRoleUI(role) {
  const p = PERMS[role];
  // Finance nav — visible to all except pure staff (they see expenses only)
  document.getElementById('nav-finance').style.display = (role === 'staff' || role === 'senior') ? 'none' : '';
  // Wallet nav item – admin only
  const wNav = document.getElementById('nav-wallet');
  if (wNav) wNav.style.display = p.viewWallet ? '' : 'none';
  // Settings – admin only
  document.getElementById('nav-settings').style.display = (role === 'admin') ? '' : 'none';
  // Documents – admin/manager
  document.getElementById('nav-docs-section').style.display = (role === 'admin' || role === 'manager') ? '' : 'none';
  // Inventory/Revenue – admin/manager only
  const invEl = document.getElementById('nav-inventory-section');
  const revEl = document.getElementById('nav-revenue-section');
  if (invEl) invEl.style.display = (role === 'admin' || role === 'manager') ? '' : 'none';
  if (revEl) revEl.style.display = (role === 'admin') ? '' : 'none';
  // Add employee btn — HIDE for staff and senior
  const aeBtn = document.getElementById('btn-add-employee');
  if (aeBtn) aeBtn.style.display = (role === 'admin' || role === 'manager') ? '' : 'none';
  // Payroll admin buttons
  const paBtns = document.getElementById('payroll-admin-btns');
  if (paBtns) paBtns.style.display = (role === 'admin') ? '' : 'none';
  // Expense admin buttons — all roles see expenses but with different data
  const eaBtns = document.getElementById('expense-admin-btns');
  if (eaBtns) eaBtns.style.display = (role === 'admin' || role === 'manager') ? '' : 'none';
  // Reports: hide generate tab for staff/senior
  setTimeout(() => {
    const genEl = document.getElementById('no-generate');
    const genSection = document.getElementById('generate-reports-section');
    const consolEl = document.getElementById('admin-consolidated');
    const noConsol = document.getElementById('no-consolidated');
    if (role === 'staff' || role === 'senior') {
      if (genEl) genEl.style.display = 'block';
      if (genSection) genSection.style.display = 'none';
      if (consolEl) consolEl.style.display = 'none';
      if (noConsol) noConsol.style.display = 'block';
      // Hide generate tab button for staff
      const genBtn = document.getElementById('rtab-btn-generate');
      if (genBtn) genBtn.style.display = 'none';
    } else {
      if (genEl) genEl.style.display = 'none';
      if (genSection) genSection.style.display = 'block';
      if (consolEl) consolEl.style.display = 'block';
      if (noConsol) noConsol.style.display = 'none';
    }
  }, 100);
}

function perm(key) { return PERMS[currentRole]?.[key] || false; }

function getMyData() {
  const r = ROLES[currentRole];
  return {
    name: r.name,
    assignedSites: r.assignedSites,
    isAdmin: currentRole === 'admin',
    isManager: currentRole === 'manager',
    isSenior: currentRole === 'senior',
    isStaff: currentRole === 'staff',
  };
}

function filterBySite(list, siteKey='site') {
  const me = getMyData();
  if (me.isAdmin) return list;
  if (me.assignedSites.includes('all')) return list;
  return list.filter(item => me.assignedSites.some(s => (item[siteKey]||'').includes(s.replace(' – ','').substring(0,6))));
}

function filterByPerson(list, nameKey='name') {
  const me = getMyData();
  if (me.isAdmin || me.isManager) return list;
  return list.filter(item => item[nameKey] === me.name || item['emp'] === me.name || item['to'] === me.name);
}

function logout() {
  if (confirm('Log out?')) {
    document.getElementById('app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    // Reset nav
    currentEmpId=null; currentSiteView=null; ['nav-finance','nav-settings','nav-docs-section','nav-inventory-section','nav-revenue-section'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });
    showToast('Logged out successfully', 'info');
  }
}

// ══════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════
function navigate(el) {
  if (!el || !el.dataset) return;
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  if (el.classList) el.classList.add('active');
  const page = el.dataset.page;
  if (!page) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');
  const titleEl = document.getElementById('page-title');
  if (titleEl) {
    const iconEl = el.querySelector ? el.querySelector('.icon') : null;
    titleEl.textContent = iconEl?.nextSibling?.textContent?.trim() || page;
  }
  closeBizDropdown();
}

function openSiteByName(name) {
  const site = sites.find(s => s.name === name);
  if (site) openSiteDash(site);
}

function openSiteDash(site) {
  if (!site) return;
  currentSiteView = site;
  // Deactivate all nav items and pages
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-sitedash');
  if (pg) pg.classList.add('active');
  document.getElementById('page-title').textContent = '🏗️ ' + site.name;
  renderSiteDash(site);
}

// ══════════════════════════════════════════════════
// BIZ DROPDOWN
// ══════════════════════════════════════════════════
function toggleBizDropdown() { document.getElementById('biz-dropdown').classList.toggle('open'); }
function closeBizDropdown()  { document.getElementById('biz-dropdown').classList.remove('open'); }
function switchBiz(name) {
  if (name.startsWith('+')) { openModal('modal-add-bank'); closeBizDropdown(); return; }
  document.getElementById('active-biz').textContent = name;
  closeBizDropdown();
  showToast(`Switched to ${name}`, 'info');
}
document.addEventListener('click', e => { if (!e.target.closest('.biz-selector') && !e.target.closest('.biz-dropdown')) closeBizDropdown(); });

// ══════════════════════════════════════════════════
// MODAL
// ══════════════════════════════════════════════════
function openModal(id)  { const el = document.getElementById(id); if (el) el.classList.add('open'); }
function closeModal(id) { const el = document.getElementById(id); if (el) el.classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ══════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════
function showToast(msg, type='info') {
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => { el.classList.add('removing'); setTimeout(()=>el.remove(), 250); }, 3200);
}

// ══════════════════════════════════════════════════
// TABS
// ══════════════════════════════════════════════════
function switchTab(tabsId, paneId, btn) {
  const tabsEl = document.getElementById(tabsId);
  if (!tabsEl) return;
  tabsEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btn && btn.classList) btn.classList.add('active');
  const pane = document.getElementById(paneId);
  if (!pane) return;
  // Deactivate all sibling tab-panes within same parent section
  const parent = pane.parentElement;
  if (parent) parent.querySelectorAll(':scope > .tab-pane').forEach(p => p.classList.remove('active'));
  else {
    const container = pane.closest('.page,.modal-body,.card');
    if (container) container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  }
  pane.classList.add('active');
}

// ══════════════════════════════════════════════════
// LIVE CLOCK
// ══════════════════════════════════════════════════
function updateClock() {
  const now = new Date();
  const cl = document.getElementById('live-clock');
  const dl = document.getElementById('live-date');
  if (cl) cl.textContent = now.toLocaleTimeString('en-IN',{hour12:false});
  if (dl) dl.textContent = now.toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
}
setInterval(updateClock, 1000); updateClock();

// ══════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════
function openNotifPanel() { document.getElementById('notif-panel').classList.add('open'); }
function closeNotifPanel(){ document.getElementById('notif-panel').classList.remove('open'); }
function openQuickAdd() { showToast('Use + buttons in each module', 'info'); }

// ══════════════════════════════════════════════════
// INIT ALL
// ══════════════════════════════════════════════════
function initAll() {
  const safe = (fn) => { try { fn(); } catch(e) { console.warn('Render error:', e.message); } };
  safe(renderDashboard);
  safe(renderEmployees);
  safe(renderAttendance);
  safe(renderLeaves);
  safe(renderPayroll);
  safe(renderSites);
  safe(renderTasks);
  safe(renderExpenses);
  safe(renderBanking);
  safe(renderAssets);
  safe(renderNotifications);
  safe(renderReports);
  safe(renderOnDuty);
  safe(renderWallet);
  safe(renderDocuments);
  safe(renderInventory);
  safe(renderRevenue);
  safe(renderBackupHistory);
  safe(renderDailyReportsPage);
  safe(renderLossLog);
}

// ══════════════════════════════════════════════════
// DASHBOARD – ROLE-AWARE
// ══════════════════════════════════════════════════
function renderDashboard() {
  const me = getMyData();
  const stats = document.getElementById('dash-stats');
  const bottom = document.getElementById('dash-bottom');
  if (!stats) return;

  if (me.isAdmin) {
    stats.innerHTML = `
      <div class="stat-card stat-blue" onclick="navigate(document.querySelector('[data-page=employees]'))"><div class="stat-icon">👥</div><div class="stat-label">Total Employees</div><div class="stat-value" style="color:var(--blue)">48</div><div class="stat-sub">↑ 3 this month</div></div>
      <div class="stat-card stat-green" onclick="navigate(document.querySelector('[data-page=attendance]'))"><div class="stat-icon">✅</div><div class="stat-label">Present Today</div><div class="stat-value" style="color:var(--green)">41</div><div class="stat-sub">85% rate</div></div>
      <div class="stat-card stat-orange" onclick="navigate(document.querySelector('[data-page=leaves]'))"><div class="stat-icon">🏖️</div><div class="stat-label">On Leave</div><div class="stat-value" style="color:var(--orange)">4</div><div class="stat-sub">2 pending approval</div></div>
      <div class="stat-card stat-red"><div class="stat-icon">❌</div><div class="stat-label">Absent</div><div class="stat-value" style="color:var(--red)">3</div><div class="stat-sub">No reason given</div></div>
      <div class="stat-card stat-purple" onclick="navigate(document.querySelector('[data-page=payroll]'))"><div class="stat-icon">💰</div><div class="stat-label">Monthly Payroll</div><div class="stat-value" style="color:var(--purple);font-size:20px">₹4.2L</div><div class="stat-sub">Due in 8 days</div></div>
      <div class="stat-card stat-cyan" onclick="navigate(document.querySelector('[data-page=wallet]'))"><div class="stat-icon">👛</div><div class="stat-label">Wallet Balance</div><div class="stat-value" style="color:var(--cyan);font-size:20px">₹3.2L</div><div class="stat-sub">₹1.8L spent</div></div>
      <div class="stat-card stat-yellow" onclick="navigate(document.querySelector('[data-page=tasks]'))"><div class="stat-icon">✅</div><div class="stat-label">Pending Tasks</div><div class="stat-value" style="color:var(--yellow)">12</div><div class="stat-sub">3 overdue</div></div>
      <div class="stat-card stat-blue" onclick="navigate(document.querySelector('[data-page=sites]'))"><div class="stat-icon">🏗️</div><div class="stat-label">Active Sites</div><div class="stat-value" style="color:var(--blue)">5</div><div class="stat-sub">1 understaffed ⚠️</div></div>`;
    bottom.innerHTML = `
      <div class="card">
        <div class="card-title">🏗️ Site Status</div>
        ${sites.map(s=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="openSiteByName(this.dataset.sitename)" data-sitename="${s.name}">
          <div style="width:10px;height:10px;background:${s.color};border-radius:50%;flex-shrink:0"></div>
          <div style="flex:1"><div style="font-size:13px;font-weight:600">${s.name}</div>
          <div class="progress-bar" style="margin-top:4px"><div class="progress-fill" style="width:${s.progress}%;background:${s.color}"></div></div></div>
          <div style="text-align:right"><div style="font-size:12px;font-weight:700;color:${s.color}">${s.progress}%</div><div style="font-size:10px;color:var(--text3)">${s.present}/${s.assigned}</div></div>
          ${s.alert?'<span class="badge badge-red">⚠️</span>':''}
        </div>`).join('')}
      </div>
      <div class="card">
        <div class="card-title">⚡ Recent Activity</div>
        <div class="timeline">
          ${[{t:'9:02 AM',txt:'Amit Kumar checked in – Site A',c:'var(--green)'},{t:'8:55 AM',txt:'Suresh Patel checked in – Site B',c:'var(--green)'},{t:'8:30 AM',txt:'Kavita Nair applied for Sick Leave',c:'var(--orange)'},{t:'Yesterday',txt:'₹50,000 cheque issued to Cement Traders',c:'var(--yellow)'},{t:'Yesterday',txt:'Site C – Hinjewadi understaffed alert',c:'var(--red)'}]
          .map(a=>`<div class="tl-item"><div class="tl-dot" style="background:${a.c}"></div><div class="tl-time">${a.t}</div><div class="tl-text">${a.txt}</div></div>`).join('')}
        </div>
      </div>`;
  } else if (me.isManager) {
    // Manager sees only their assigned sites
    const mySites = sites.filter(s => me.assignedSites.includes(s.name));
    stats.innerHTML = `
      <div class="stat-card stat-blue"><div class="stat-icon">🏗️</div><div class="stat-label">My Sites</div><div class="stat-value" style="color:var(--blue)">${mySites.length}</div></div>
      <div class="stat-card stat-green"><div class="stat-icon">✅</div><div class="stat-label">Present (My Sites)</div><div class="stat-value" style="color:var(--green)">${mySites.reduce((a,s)=>a+s.present,0)}</div></div>
      <div class="stat-card stat-orange"><div class="stat-icon">🏖️</div><div class="stat-label">Pending Leaves</div><div class="stat-value" style="color:var(--orange)">2</div></div>
      <div class="stat-card stat-yellow"><div class="stat-icon">✅</div><div class="stat-label">My Tasks</div><div class="stat-value" style="color:var(--yellow)">5</div></div>`;
    bottom.innerHTML = `
      <div class="card">
        <div class="card-title">🏗️ My Assigned Sites</div>
        ${mySites.map(s=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="openSiteByName(this.dataset.sitename)" data-sitename="${s.name}">
          <div style="width:10px;height:10px;background:${s.color};border-radius:50%"></div>
          <div style="flex:1"><div style="font-size:13px;font-weight:600">${s.name}</div>
          <div class="progress-bar" style="margin-top:4px"><div class="progress-fill" style="width:${s.progress}%;background:${s.color}"></div></div></div>
          <div style="text-align:right"><div style="font-size:12px;font-weight:700;color:${s.color}">${s.progress}%</div></div>
        </div>`).join('')}
      </div>
      <div class="card">
        <div class="card-title">📋 My Attendance Today</div>
        <div style="text-align:center;padding:20px">
          <div style="font-size:36px;font-weight:800;color:var(--green)">09:02</div>
          <div style="color:var(--text2);font-size:13px">Checked In</div>
          <div style="margin-top:8px"><span class="badge badge-green">● Present</span></div>
        </div>
      </div>`;
  } else {
    // Staff / Senior – only own data
    const myEmp = employees.find(e => e.name === me.name);
    const myTasks = tasks.filter(t => t.emp === me.name);
    stats.innerHTML = `
      <div class="stat-card stat-green"><div class="stat-icon">📋</div><div class="stat-label">My Attendance</div><div class="stat-value" style="color:var(--green)">${myEmp?.attStatus||'—'}</div></div>
      <div class="stat-card stat-yellow"><div class="stat-icon">✅</div><div class="stat-label">My Tasks</div><div class="stat-value" style="color:var(--yellow)">${myTasks.length}</div></div>
      <div class="stat-card stat-orange"><div class="stat-icon">🏖️</div><div class="stat-label">Leave Balance</div><div class="stat-value" style="color:var(--orange)">8</div><div class="stat-sub">CL remaining</div></div>
      <div class="stat-card stat-blue"><div class="stat-icon">💰</div><div class="stat-label">My Salary</div><div class="stat-value" style="color:var(--blue);font-size:20px">₹${(myEmp?.salary||0).toLocaleString()}</div></div>`;
    bottom.innerHTML = `
      <div class="card">
        <div class="card-title">✅ My Tasks</div>
        ${myTasks.slice(0,4).map(t=>`<div style="padding:8px 0;border-bottom:1px solid var(--border)">
          <div style="font-weight:600;font-size:13px">${t.title}</div>
          <div style="font-size:11px;color:var(--text2);margin-top:2px">Due: ${t.due} · ${t.site}</div>
          <div class="progress-bar" style="margin-top:6px"><div class="progress-fill" style="width:${t.progress}%;background:${t.status==='done'?'var(--green)':t.status==='overdue'?'var(--red)':'var(--orange)'}"></div></div>
        </div>`).join('')}
      </div>
      <div class="card">
        <div class="card-title">📋 My Attendance This Week</div>
        <div class="cal-grid">
          ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>`<div class="cal-header">${d}</div>`).join('')}
          ${['present','present','present','present','today','weekoff','weekoff'].map(s=>`<div class="cal-day ${s}" style="font-size:10px">${s==='today'?'11':s==='weekoff'?'—':'✓'}</div>`).join('')}
        </div>
      </div>`;
  }
}

// ══════════════════════════════════════════════════
// EMPLOYEES – ROLE-FILTERED
// ══════════════════════════════════════════════════
function renderEmployees(list) {
  const grid = document.getElementById('emp-grid');
  if (!grid) return;
  const me = getMyData();

  let data = list || employees;
  if (!perm('viewAllEmployees')) {
    data = data.filter(e => e.name === me.name);
    const sr = document.getElementById('emp-search-row');
    if (sr) sr.style.display = 'none';
    const sub = document.getElementById('emp-subtitle');
    if (sub) sub.textContent = 'Your profile';
  } else if (me.isManager) {
    data = data.filter(e => me.assignedSites.some(s => e.site.includes(s.split(' – ')[0].trim())));
    const sub = document.getElementById('emp-subtitle');
    if (sub) sub.textContent = 'Employees on your assigned sites';
  }

  grid.innerHTML = data.map(e => `
    <div class="emp-card" onclick="openEmpDetail(${e.id})" style="cursor:pointer;transition:border-color .15s,box-shadow .15s" onmouseover="this.style.boxShadow='0 0 0 2px var(--blue)'" onmouseout="this.style.boxShadow=''">
      <div class="emp-card-top">
        <div class="emp-av" style="background:${e.color}">${e.name[0]}</div>
        <div style="flex:1">
          <div class="emp-name">${e.name}</div>
          <div class="emp-role">${e.role} · ${e.dept}</div>
          <div class="emp-dept">📍 ${e.site}</div>
        </div>
        <span class="badge ${e.status==='Active'?'badge-green':'badge-red'}">${e.status}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
        ${perm('viewAllPayroll') || e.name === me.name
          ? `<div><div style="font-size:11px;color:var(--text3)">Salary</div><div style="font-size:14px;font-weight:700">₹${e.salary.toLocaleString()}</div></div>`
          : '<div style="font-size:11px;color:var(--text3)">Salary: —</div>'}
        <div><div style="font-size:11px;color:var(--text3)">Type</div><div style="font-size:12px;font-weight:600">${e.type}</div></div>
        <div class="contact-btns" onclick="event.stopPropagation()">
          <div class="contact-btn cb-call" onclick="showToast('Calling ${e.name}…','success')" title="Call">📞</div>
          <div class="contact-btn cb-wa"   onclick="showToast('WhatsApp: ${e.name}','success')" title="WhatsApp">💬</div>
          <div class="contact-btn cb-sms"  onclick="showToast('SMS sent to ${e.name}','info')" title="SMS">📱</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
        <span class="chip">${e.phone}</span>
        <span style="font-size:11px;color:var(--blue)">View Details →</span>
      </div>
    </div>`).join('');
}

function filterEmployees() {
  const q    = (document.getElementById('emp-search')?.value||'').toLowerCase();
  const dept = document.getElementById('emp-filter-dept')?.value;
  const stat = document.getElementById('emp-filter-status')?.value;
  renderEmployees(employees.filter(e =>
    (!q    || e.name.toLowerCase().includes(q) || e.phone.includes(q)) &&
    (!dept || e.dept === dept) &&
    (!stat || e.status === stat)));
}

// ══════════════════════════════════════════════════
// ATTENDANCE – ROLE-FILTERED
// ══════════════════════════════════════════════════
function renderAttendance() {
  const me = getMyData();
  const myEmp = employees.find(e => e.name === me.name);

  // ── Initialise "My Attendance" card for ALL roles ──
  const avatarEl = document.getElementById('att-my-avatar');
  const nameEl   = document.getElementById('att-my-name');
  const siteEl   = document.getElementById('att-my-site');
  if (avatarEl) { avatarEl.textContent = me.name[0]; avatarEl.style.background = myEmp?.color || 'var(--blue2)'; }
  if (nameEl)   nameEl.textContent = me.name + ' — My Attendance';
  if (siteEl)   siteEl.textContent = myEmp?.site || 'Site A – MG Road';

  // Reflect existing check-in state
  const ciTime = document.getElementById('att-checkin-time');
  const coTime = document.getElementById('att-checkout-time');
  const totH   = document.getElementById('att-total-hours');
  const datEl  = document.getElementById('att-today-date');
  const badge  = document.getElementById('att-my-status-badge');
  const ciBtn  = document.getElementById('btn-checkin');
  const coBtn  = document.getElementById('btn-checkout');
  const countEl= document.getElementById('att-live-counter');

  if (myEmp?.checkin) {
    if (ciTime) ciTime.textContent = myEmp.checkin;
    if (ciBtn)  ciBtn.style.display = 'none';
    if (coBtn)  coBtn.style.display = myEmp.checkout ? 'none' : '';
    if (badge)  { badge.textContent = myEmp.checkout ? '🚪 Checked Out' : '✅ Checked In'; badge.className = myEmp.checkout ? 'badge badge-orange' : 'badge badge-green'; }
    if (countEl) countEl.style.display = (myEmp.hours === 'Live') ? 'inline-flex' : 'none';
  } else {
    if (ciBtn) ciBtn.style.display = '';
    if (coBtn) coBtn.style.display = 'none';
    if (badge) { badge.textContent = 'Not Checked In'; badge.className = 'badge badge-gray'; }
    if (countEl) countEl.style.display = 'none';
  }
  if (coTime) coTime.textContent = myEmp?.checkout || '—';
  if (totH)   totH.textContent   = myEmp?.hours   || '—';
  if (datEl)  datEl.textContent  = new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});

  // ── Admin / Manager / Senior: show QR + manual override buttons ──
  const qrBtn  = document.getElementById('btn-gen-qr');
  const manBtn = document.getElementById('btn-manual-att');
  const teamSection = document.getElementById('team-attendance-section');
  if (qrBtn)  qrBtn.style.display  = perm('viewOthersAtt') ? '' : 'none';
  if (manBtn) manBtn.style.display = perm('viewOthersAtt') ? '' : 'none';
  if (teamSection) teamSection.style.display = perm('viewOthersAtt') ? '' : 'none';

  // ── Team Attendance Table ──
  const tb = document.getElementById('attendance-table');
  if (!tb) return;

  let data = employees;
  if (me.isManager) {
    data = data.filter(e => me.assignedSites.some(s => e.site.includes(s.split(' – ')[0].trim())));
    const tt = document.getElementById('att-table-title');
    if (tt) tt.textContent = 'Team Attendance — Today';
  }

  const sc = { Present:'badge-green', Absent:'badge-red', 'On Leave':'badge-orange', 'Week Off':'badge-cyan' };
  tb.innerHTML = data.map(e => `<tr>
    <td>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="av" style="background:${e.color}">${e.name[0]}</div>
        <div>
          <div style="font-weight:600">${e.name}</div>
          <div style="font-size:10px;color:var(--text2)">${e.role}</div>
        </div>
      </div>
    </td>
    <td>${e.dept}</td>
    <td><span class="chip">${e.site}</span></td>
    <td style="color:var(--green);font-weight:600">${e.checkin || '<span style="color:var(--text3)">—</span>'}</td>
    <td style="color:var(--orange);font-weight:600">${e.checkout || '<span style="color:var(--text3)">—</span>'}</td>
    <td><b style="color:${e.hours==='Live'?'var(--green)':'var(--text)'}">${e.hours}</b></td>
    <td><span class="badge ${sc[e.attStatus]||'badge-gray'}">${e.attStatus}</span></td>
    <td>
      ${perm('viewOthersAtt')
        ? `<button class="btn btn-ghost btn-sm" onclick="showToast('Attendance updated for ${e.name}','success')">Override</button>`
        : '—'
      }
    </td>
  </tr>`).join('');
}

// ── Attendance state ──────────────────────────────────────────────
const attState = { checkedIn: false, checkInTime: null, checkOutTime: null, timerInterval: null };

function doCheckIn() {
  if (attState.checkedIn) { showToast('Already checked in!', 'warning'); return; }
  const now = new Date();
  attState.checkedIn  = true;
  attState.checkInTime = now;
  attState.checkOutTime = null;

  const timeStr = now.toLocaleTimeString('en-IN',{hour12:false,hour:'2-digit',minute:'2-digit'});
  const dateStr = now.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});

  // Update UI
  const ciBtn   = document.getElementById('btn-checkin');
  const coBtn   = document.getElementById('btn-checkout');
  const badge   = document.getElementById('att-my-status-badge');
  const ciTime  = document.getElementById('att-checkin-time');
  const coTime  = document.getElementById('att-checkout-time');
  const totH    = document.getElementById('att-total-hours');
  const todayD  = document.getElementById('att-today-date');
  const counter = document.getElementById('att-live-counter');
  const card    = document.getElementById('my-attendance-card').querySelector('.card');

  if (ciBtn)  { ciBtn.style.display = 'none'; }
  if (coBtn)  { coBtn.style.display = ''; }
  if (badge)  { badge.textContent = '✅ Checked In'; badge.className = 'badge badge-green'; }
  if (ciTime) ciTime.textContent = timeStr;
  if (coTime) coTime.textContent = '—';
  if (totH)   totH.textContent  = 'Live...';
  if (todayD) todayD.textContent = dateStr;
  if (counter) counter.style.display = 'inline-flex';
  if (card)   card.style.borderColor = 'var(--green)';

  // Update employee record
  const me = getMyData();
  const emp = employees.find(e => e.name === me.name);
  if (emp) { emp.checkin = timeStr; emp.checkout = ''; emp.hours = 'Live'; emp.attStatus = 'Present'; }

  // Start live counter
  if (attState.timerInterval) clearInterval(attState.timerInterval);
  attState.timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - attState.checkInTime.getTime()) / 1000);
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    const cv = document.getElementById('att-counter-val');
    if (cv) cv.textContent = `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }, 1000);

  renderAttendance();
  showToast(`✅ ${me.name} Checked IN at ${timeStr}`, 'success');
}

function doCheckOut() {
  if (!attState.checkedIn) { showToast('Not checked in yet!', 'warning'); return; }
  const now = new Date();
  attState.checkedIn   = false;
  attState.checkOutTime = now;

  const timeStr = now.toLocaleTimeString('en-IN',{hour12:false,hour:'2-digit',minute:'2-digit'});
  const elapsed = Math.floor((now - attState.checkInTime) / 1000);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const hoursStr = `${h}h ${String(m).padStart(2,'0')}m`;

  // Stop counter
  if (attState.timerInterval) clearInterval(attState.timerInterval);

  // Update UI
  const ciBtn   = document.getElementById('btn-checkin');
  const coBtn   = document.getElementById('btn-checkout');
  const badge   = document.getElementById('att-my-status-badge');
  const coTime  = document.getElementById('att-checkout-time');
  const totH    = document.getElementById('att-total-hours');
  const counter = document.getElementById('att-live-counter');
  const card    = document.getElementById('my-attendance-card')?.querySelector('.card');

  if (ciBtn)  { ciBtn.style.display = ''; ciBtn.textContent = '✅ Check In Again'; }
  if (coBtn)  { coBtn.style.display = 'none'; }
  if (badge)  { badge.textContent = '🚪 Checked Out'; badge.className = 'badge badge-orange'; }
  if (coTime) coTime.textContent = timeStr;
  if (totH)   totH.textContent  = hoursStr;
  if (counter) counter.style.display = 'none';
  if (card)   card.style.borderColor = 'var(--orange)';

  // Update employee record
  const me = getMyData();
  const emp = employees.find(e => e.name === me.name);
  if (emp) { emp.checkout = timeStr; emp.hours = hoursStr; }

  renderAttendance();
  showToast(`🚪 ${me.name} Checked OUT at ${timeStr} · Total: ${hoursStr}`, 'info');
}

// Keep backward-compatible simulateScan for QR modal buttons
function simulateScan(type) {
  if (type === 'checkin')  doCheckIn();
  else                     doCheckOut();
}

// ══════════════════════════════════════════════════
// LEAVES
// ══════════════════════════════════════════════════
function renderLeaves() {
  const me = getMyData();
  const showActionCol = perm('canApprove');
  const pending = me.isAdmin ? leavesPending : me.isManager ? leavesPending : leavesPending.filter(l=>l.name===me.name);
  const approved = me.isAdmin ? leavesApproved : me.isManager ? leavesApproved : leavesApproved.filter(l=>l.name===me.name);
  const rejected = me.isAdmin ? leavesRejected : leavesRejected.filter(l=>l.name===me.name);

  const pt = document.getElementById('leave-pending-table');
  if (pt) pt.innerHTML = pending.map(l=>`<tr>
    <td><b>${l.name}</b></td>
    <td><span class="badge badge-blue">${l.type}</span></td>
    <td>${l.from}</td><td>${l.to}</td><td>${l.days}d</td>
    <td style="color:var(--text2)">${l.reason}</td>
    <td><span class="badge badge-orange">Pending</span></td>
    <td>${showActionCol?`<button class="btn btn-success btn-sm" onclick="showToast('Leave approved for ${l.name}','success')">Approve</button> <button class="btn btn-danger btn-sm" onclick="showToast('Leave rejected','warning')">Reject</button>`:'—'}</td>
  </tr>`).join('');

  const at = document.getElementById('leave-approved-table');
  if (at) at.innerHTML = approved.map(l=>`<tr><td><b>${l.name}</b></td><td><span class="badge badge-blue">${l.type}</span></td><td>${l.from}</td><td>${l.to}</td><td>${l.days}</td><td>${l.by}</td><td><span class="badge badge-green">Approved</span></td></tr>`).join('');

  const rjt = document.getElementById('leave-rejected-table');
  if (rjt) rjt.innerHTML = rejected.map(l=>`<tr><td><b>${l.name}</b></td><td><span class="badge badge-blue">${l.type}</span></td><td>${l.from}</td><td>${l.to}</td><td>${l.days}</td><td>${l.reason}</td><td><span class="badge badge-red">Rejected</span></td></tr>`).join('');

  const bt = document.getElementById('leave-balance-table');
  if (bt) {
    const empList = me.isAdmin ? employees : me.isManager ? employees.filter(e=>me.assignedSites.some(s=>e.site.includes(s.split(' – ')[0]))) : employees.filter(e=>e.name===me.name);
    bt.innerHTML = empList.map(e=>`<tr>
      <td><b>${e.name}</b></td>
      <td><span style="font-size:11px">${Math.floor(Math.random()*6)}/12</span></td>
      <td><span style="font-size:11px">${Math.floor(Math.random()*4)}/12</span></td>
      <td><span style="font-size:11px">${Math.floor(Math.random()*5)}/15</span></td>
      <td><span style="color:var(--red)">${Math.floor(Math.random()*2)}</span></td>
      <td><span class="badge badge-green">Available</span></td>
    </tr>`).join('');
  }
}

// ══════════════════════════════════════════════════
// PAYROLL – ROLE-FILTERED
// ══════════════════════════════════════════════════
function renderPayroll() {
  const body = document.getElementById('payroll-body');
  if (!body) return;
  const me = getMyData();

  if (!perm('viewAllPayroll') && !me.isManager) {
    // Staff/Senior: show only their own payslip
    const myEmp = employees.find(e=>e.name===me.name);
    if (!myEmp) { body.innerHTML='<div class="card"><p style="color:var(--text2)">No payroll data.</p></div>'; return; }
    const hra=Math.round(myEmp.salary*.2), allow=Math.round(myEmp.salary*.1), pf=Math.round(myEmp.salary*.12), net=myEmp.salary+hra+allow-pf;
    body.innerHTML=`
      <div class="card" style="max-width:520px">
        <div class="card-title">💰 My Salary Slip — June 2025</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${[['Basic Salary','₹'+myEmp.salary.toLocaleString(),'var(--text)'],['HRA (20%)','₹'+hra.toLocaleString(),'var(--text)'],['Allowances (10%)','₹'+allow.toLocaleString(),'var(--text)'],['PF Deduction (12%)','- ₹'+pf.toLocaleString(),'var(--red)']].map(([l,v,c])=>`
            <div style="display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px solid var(--border)"><span>${l}</span><b style="color:${c}">${v}</b></div>`).join('')}
          <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;color:var(--green);padding:8px 0"><span>Net Pay</span><b>₹${net.toLocaleString()}</b></div>
        </div>
        <button class="btn btn-ghost btn-sm" style="margin-top:10px" onclick="showToast('Salary slip downloaded!','success')">📄 Download Slip</button>
      </div>`;
    document.getElementById('payroll-subtitle').textContent = 'Your salary — June 2025';
    return;
  }

  // Manager sees own + their site employees; Admin sees all
  let empList = employees;
  if (me.isManager) {
    empList = employees.filter(e=>e.name===me.name||me.assignedSites.some(s=>e.site.includes(s.split(' – ')[0])));
    document.getElementById('payroll-subtitle').textContent = 'My team payroll — June 2025';
    document.getElementById('payroll-admin-btns').style.display = 'none';
  }

  const summaryStats = `<div class="stats-grid" style="margin-bottom:16px">
    <div class="stat-card stat-purple"><div class="stat-label">Total Payroll</div><div class="stat-value" style="color:var(--purple);font-size:22px">₹4.2L</div></div>
    <div class="stat-card stat-green"><div class="stat-label">Paid</div><div class="stat-value" style="color:var(--green);font-size:22px">₹3.6L</div></div>
    <div class="stat-card stat-orange"><div class="stat-label">Pending</div><div class="stat-value" style="color:var(--orange);font-size:22px">₹0.6L</div></div>
    <div class="stat-card stat-blue"><div class="stat-label">Deductions</div><div class="stat-value" style="color:var(--blue);font-size:22px">₹28K</div></div>
  </div>`;

  const tableRows = empList.map(e=>{
    const hra=Math.round(e.salary*.2), allow=Math.round(e.salary*.1), pf=Math.round(e.salary*.12), net=e.salary+hra+allow-pf;
    const paid=Math.random()>.3;
    // Manager can only VIEW, not process payment
    const actionBtn = me.isAdmin
      ? `${!paid?`<button class="btn btn-success btn-sm" onclick="showToast('₹${net.toLocaleString()} paid to ${e.name}','success')">Pay</button>`:''}
         <button class="btn btn-ghost btn-sm" onclick="showToast('Salary slip downloaded!','success')">Slip</button>`
      : `<button class="btn btn-ghost btn-sm" onclick="showToast('View only — contact Admin to process','info')">View</button>`;
    return `<tr>
      <td><div style="display:flex;align-items:center;gap:8px"><div class="av" style="background:${e.color}">${e.name[0]}</div>${e.name}</div></td>
      <td><span class="badge badge-gray">${e.type}</span></td>
      <td>₹${e.salary.toLocaleString()}</td>
      <td>₹${hra.toLocaleString()}</td>
      <td>₹${allow.toLocaleString()}</td>
      <td style="color:var(--red)">-₹${pf.toLocaleString()}</td>
      <td><b style="color:var(--green)">₹${net.toLocaleString()}</b></td>
      <td><span class="badge ${paid?'badge-green':'badge-orange'}">${paid?'Paid':'Pending'}</span></td>
      <td>${actionBtn}</td>
    </tr>`;
  }).join('');

  body.innerHTML = summaryStats + `<div class="card"><div class="card-title">Employee Payroll — June 2025</div>
    <div class="table-wrap"><table><thead><tr><th>Employee</th><th>Type</th><th>Basic</th><th>HRA</th><th>Allowances</th><th>Deductions</th><th>Net Pay</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>${tableRows}</tbody></table></div></div>`;
}

// ══════════════════════════════════════════════════
// SITES – ROLE-FILTERED
// ══════════════════════════════════════════════════
function renderSites() {
  const grid = document.getElementById('sites-grid');
  if (!grid) return;
  const me = getMyData();
  let data = me.isAdmin ? sites : sites.filter(s=>me.assignedSites.includes(s.name));
  document.getElementById('sites-subtitle').textContent = me.isAdmin ? 'Monitor all active work sites' : 'Your assigned sites';
  document.getElementById('btn-add-site').style.display = me.isAdmin ? '' : 'none';

  grid.innerHTML = data.map(s=>`
    <div class="site-card" onclick="openSiteByName(this.dataset.sitename)" data-sitename="${s.name}">
      <div class="site-card-header">
        <div><div class="site-card-name">${s.name}</div><div class="site-card-addr">📍 ${s.addr}</div></div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          ${s.alert?'<span class="badge badge-red">⚠️ Understaffed</span>':'<span class="badge badge-green">✓ Normal</span>'}
          <span style="font-size:11px;color:var(--text2)">📍 ${s.lat}, ${s.lng}</span>
        </div>
      </div>
      <div style="display:flex;gap:12px;margin-bottom:10px">
        <div><div style="font-size:11px;color:var(--text3)">Assigned</div><div style="font-size:16px;font-weight:800">${s.assigned}</div></div>
        <div><div style="font-size:11px;color:var(--text3)">Present</div><div style="font-size:16px;font-weight:800;color:var(--green)">${s.present}</div></div>
        <div><div style="font-size:11px;color:var(--text3)">Cost</div><div style="font-size:16px;font-weight:800;color:var(--orange)">${s.cost}</div></div>
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text2);margin-bottom:4px"><span>Progress</span><span style="color:${s.color};font-weight:700">${s.progress}%</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${s.progress}%;background:${s.color}"></div></div>
      </div>
      <div style="display:flex;gap:6px;margin-top:10px">
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openSiteByName('${s.name}')">📊 Dashboard</button>
        ${me.isAdmin?`<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();showToast('Auto-assigning staff…','success')">Auto-Assign</button>`:''}
      </div>
    </div>`).join('');
}

// ══════════════════════════════════════════════════
// SITE DASHBOARD
// ══════════════════════════════════════════════════
function renderSiteDash(site) {
  if (!site) return;
  currentSiteView = site;
  document.getElementById('sitedash-name').textContent = site.name;
  document.getElementById('sitedash-title').textContent = site.name;
  document.getElementById('sitedash-addr').textContent = '📍 ' + site.addr + '  ·  GPS: ' + site.lat + ', ' + site.lng;

  // Site info strip
  const si = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  si('sd-info-type', site.siteType || 'Residential');
  si('sd-info-own',  site.ownership ? site.ownership.charAt(0).toUpperCase()+site.ownership.slice(1) : 'Personal');
  si('sd-info-cost', site.estimatedCost ? '₹'+(site.estimatedCost/10000000).toFixed(1)+'Cr' : '—');
  si('sd-info-mgr',  site.manager);
  si('sd-info-gps',  site.lat + ', ' + site.lng);

  // Show edit/delete only for admin/manager
  const me = getMyData();
  const editBtn = document.getElementById('sitedash-edit-btn');
  const delBtn  = document.getElementById('sitedash-delete-btn');
  if (editBtn) editBtn.style.display = (me.isAdmin || me.isManager) ? '' : 'none';
  if (delBtn)  delBtn.style.display  = me.isAdmin ? '' : 'none';

  // Stats
  const st = document.getElementById('sitedash-stats');
  if (st) st.innerHTML = `
    <div class="stat-card stat-green"><div class="stat-label">Present</div><div class="stat-value" style="color:var(--green)">${site.present}</div><div class="stat-sub">of ${site.assigned} assigned</div></div>
    <div class="stat-card stat-blue"><div class="stat-label">Assigned</div><div class="stat-value" style="color:var(--blue)">${site.assigned}</div></div>
    <div class="stat-card stat-orange"><div class="stat-label">Site Cost</div><div class="stat-value" style="color:var(--orange);font-size:20px">${site.cost}</div></div>
    <div class="stat-card stat-purple"><div class="stat-label">Progress</div><div class="stat-value" style="color:var(--purple)">${site.progress}%</div></div>
    ${site.alert ? '<div class="stat-card stat-red"><div class="stat-label">Alert</div><div class="stat-value" style="color:var(--red);font-size:14px">Understaffed</div></div>' : ''}`;

  // Employees
  const el = document.getElementById('sitedash-emp-list');
  const siteEmps = employees.filter(e => e.site === site.name);
  if (el) el.innerHTML = siteEmps.map(e => `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="openEmpDetail(${e.id})">
      <div class="av" style="background:${e.color}">${e.name[0]}</div>
      <div style="flex:1"><div style="font-weight:600;font-size:13px">${e.name}</div><div style="font-size:11px;color:var(--text2)">${e.role}</div></div>
      <span class="badge ${e.attStatus==='Present'?'badge-green':e.attStatus==='Absent'?'badge-red':'badge-orange'}">${e.attStatus}</span>
      <div class="contact-btns" onclick="event.stopPropagation()">
        <div class="contact-btn cb-call" onclick="showToast('Calling ${e.name}','success')">📞</div>
        <div class="contact-btn cb-wa"   onclick="showToast('WhatsApp: ${e.name}','success')">💬</div>
      </div>
    </div>`).join('') || '<div style="color:var(--text2);font-size:13px;padding:12px 0">No employees assigned to this site</div>';

  // Progress
  const pr = document.getElementById('sitedash-progress');
  if (pr) pr.innerHTML = `
    <div style="text-align:center;padding:10px 0">
      <div style="font-size:48px;font-weight:800;color:${site.color}">${site.progress}%</div>
      <div style="font-size:13px;color:var(--text2)">Overall Completion</div>
    </div>
    <div class="progress-bar" style="height:12px"><div class="progress-fill" style="width:${site.progress}%;background:${site.color}"></div></div>
    <div class="bar-chart" style="margin-top:16px">
      ${['Week 1','Week 2','Week 3','Week 4'].map((w,i)=>`<div class="bar-item"><div class="bar-val">${[15,28,42,site.progress][i]}%</div><div class="bar" style="height:${[15,28,42,site.progress][i]}px;background:${site.color};opacity:${.4+i*.2}"></div><div class="bar-label">${w}</div></div>`).join('')}
    </div>`;

  // Tasks
  const tk = document.getElementById('sitedash-tasks');
  const siteTasks = tasks.filter(t => t.site === site.name || t.site === 'All');
  if (tk) tk.innerHTML = siteTasks.slice(0, 5).map(t => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="font-weight:600;font-size:13px">${t.title}</div>
        <span class="badge ${t.status==='done'?'badge-green':t.status==='overdue'?'badge-red':'badge-orange'}">${t.status}</span>
      </div>
      <div style="font-size:11px;color:var(--text2)">👤 ${t.emp} · Due: ${t.due}</div>
      <div class="progress-bar" style="margin-top:4px"><div class="progress-fill" style="width:${t.progress}%;background:${t.status==='done'?'var(--green)':t.status==='overdue'?'var(--red)':'var(--orange)'}"></div></div>
    </div>`).join('') || '<div style="color:var(--text2);font-size:13px">No tasks for this site</div>';

  // Documents
  const dc = document.getElementById('sitedash-docs');
  const siteDocs = documents.filter(d => d.site === site.name || d.site === 'All Sites');
  if (dc) dc.innerHTML = siteDocs.length ? siteDocs.map(d => `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:20px">${d.icon}</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:13px">${d.name}</div>
        <div style="font-size:11px;color:var(--text2)">${d.type} · ${d.size} · Expires: ${d.expiry}</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="showToast('Opening ${d.name}','info')">📂 Open</button>
      ${me.isAdmin ? `<button class="btn btn-danger btn-sm" onclick="showToast('Document deleted','warning')">🗑️</button>` : ''}
    </div>`).join('') :
    `<div style="color:var(--text2);font-size:13px;padding:12px 0">No documents uploaded yet.<br><button class="btn btn-ghost btn-sm" style="margin-top:8px" onclick="openModal('modal-upload-doc')">+ Upload Document</button></div>`;

  // Site Reports shortcuts
  const rp = document.getElementById('sitedash-reports');
  if (rp) rp.innerHTML = ['Attendance','Expenses','Task Progress','Daily Reports','Loss Log'].map(r => `
    <div class="card" style="cursor:pointer;border-top:3px solid ${site.color}" onclick="openDemoReport('${r} – ${site.name}')">
      <div style="font-size:14px;font-weight:700;margin-bottom:4px">${r}</div>
      <div style="font-size:11px;color:var(--text2)">📍 ${site.name}</div>
      <div style="display:flex;gap:6px;margin-top:8px">
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();showToast('PDF exported!','success')">📄 PDF</button>
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();showToast('Excel exported!','success')">📊 Excel</button>
      </div>
    </div>`).join('');

  // Site-specific daily reports
  renderSiteDailyReports();
  // Site-specific loss log
  renderSiteLossLog();
}

function renderSiteDailyReports() {
  const container = document.getElementById('sd-daily-reports-list');
  if (!container || !currentSiteView) return;
  const sort = document.getElementById('sd-dr-sort')?.value || 'newest';
  let data = dailyReports.filter(r => r.site === currentSiteView.name);
  if (sort === 'oldest') data = [...data].sort((a,b) => a.date.localeCompare(b.date));
  else if (sort === 'progress') data = [...data].sort((a,b) => b.progress - a.progress);
  const me = getMyData();

  const cnt = document.getElementById('sd-dr-count');
  if (cnt) cnt.textContent = `${data.length} report${data.length!==1?'s':''} for ${currentSiteView.name}`;

  container.innerHTML = data.length ? data.map(r => `
    <div class="card" style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;flex-wrap:wrap;gap:8px">
        <div style="display:flex;align-items:center;gap:8px">
          <div class="av" style="background:${employees.find(e=>e.name===r.emp)?.color||'#388BFD'}">${r.emp[0]}</div>
          <div><b>${r.emp}</b><div style="font-size:11px;color:var(--text2)">${r.role} · ${r.date}</div></div>
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          <span class="chip">🎯 ${r.progress}%</span>
          <button class="btn btn-ghost btn-sm" onclick="editDailyReport(${r.id})">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="deleteDailyReport(${r.id});renderSiteDailyReports()">🗑️</button>
        </div>
      </div>
      <div style="font-size:13px;margin-bottom:6px">${r.summary}</div>
      <div style="font-size:11px;color:var(--text2);margin-bottom:6px">🎯 <b>${r.milestone}</b></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${r.progress}%;background:var(--green)"></div></div>
      <div style="display:flex;gap:6px;margin-top:8px">
        ${r.photos ? `<span class="chip">📸 ${r.photos} photos</span>` : ''}
        ${r.files  ? `<span class="chip">📎 ${r.files} files</span>` : ''}
      </div>
    </div>`).join('') : '<div class="card" style="text-align:center;padding:24px;color:var(--text2)">No daily reports for this site yet.</div>';
}

function renderSiteLossLog() {
  const container = document.getElementById('sd-loss-log-list');
  if (!container || !currentSiteView) return;
  const data = lossLog.filter(l => l.site === currentSiteView.name);
  const scColors = { Logged:'badge-orange', 'Under Review':'badge-blue', Resolved:'badge-green' };
  const me = getMyData();

  container.innerHTML = data.length ? data.map(l => `
    <div class="card" style="margin-bottom:10px;border-left:3px solid ${l.type==='Structural'?'var(--red)':l.type==='Material Damage'?'var(--orange)':'var(--yellow)'}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div><div style="font-weight:700">⚠️ ${l.type}</div><div style="font-size:11px;color:var(--text2)">${l.date} · By: ${l.by}</div></div>
        <div style="display:flex;gap:6px;align-items:center">
          <span class="badge ${scColors[l.status]}">${l.status}</span>
          ${(me.isAdmin||me.isManager)?`<button class="btn btn-ghost btn-sm" onclick="showToast('Editing loss entry','info')">✏️</button><button class="btn btn-danger btn-sm" onclick="showToast('Loss entry deleted','warning')">🗑️</button>`:''}
        </div>
      </div>
      <div style="font-size:13px;margin-bottom:8px">${l.desc}</div>
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <div><div style="font-size:11px;color:var(--text3)">Cost</div><div style="font-weight:700;color:var(--red)">₹${l.cost.toLocaleString()}</div></div>
        ${l.photos?`<span class="chip">📸 ${l.photos} photos</span>`:''}
        ${(me.isAdmin||me.isManager)?`<button class="btn btn-success btn-sm" onclick="showToast('Marked resolved','success')">✓ Resolve</button>`:''}
      </div>
    </div>`).join('') : '<div class="card" style="text-align:center;padding:24px;color:var(--text2)">No loss entries for this site.</div>';
}


function renderTasks() {
  const grid = document.getElementById('tasks-grid');
  const ts   = document.getElementById('task-stats');
  if (!grid) return;
  const me = getMyData();
  let data = tasks;

  if (!me.isAdmin && !me.isManager) {
    data = tasks.filter(t=>t.emp===me.name);
  } else if (me.isManager) {
    data = tasks.filter(t=>me.assignedSites.some(s=>t.site.includes(s.split(' – ')[0]))||t.emp===me.name||t.site==='All');
  }

  const done=data.filter(t=>t.status==='done').length, overdue=data.filter(t=>t.status==='overdue').length, pending=data.filter(t=>t.status==='pending').length;
  if (ts) ts.innerHTML=`
    <div class="stat-card stat-blue"><div class="stat-label">Total</div><div class="stat-value" style="color:var(--blue)">${data.length}</div></div>
    <div class="stat-card stat-green"><div class="stat-label">Done</div><div class="stat-value" style="color:var(--green)">${done}</div></div>
    <div class="stat-card stat-orange"><div class="stat-label">Pending</div><div class="stat-value" style="color:var(--orange)">${pending}</div></div>
    <div class="stat-card stat-red"><div class="stat-label">Overdue</div><div class="stat-value" style="color:var(--red)">${overdue}</div></div>`;

  document.getElementById('btn-add-task').style.display = perm('canAssignTask') ? '' : 'none';
  const pColors={High:'badge-red',Medium:'badge-orange',Low:'badge-gray'};
  grid.innerHTML = data.map(t=>`
    <div class="task-card ${t.status}">
      <div class="task-title">${t.title}</div>
      <div class="task-meta"><span>👤 ${t.emp}</span><span>📍 ${t.site}</span><span>📅 ${t.due}</span><span>🔄 ${t.type}</span></div>
      <div style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text2);margin-bottom:3px"><span>Progress</span><span>${t.progress}%</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${t.progress}%;background:${t.status==='done'?'var(--green)':t.status==='overdue'?'var(--red)':'var(--orange)'}"></div></div>
      </div>
      <div class="task-footer">
        <div style="display:flex;gap:6px"><span class="badge ${pColors[t.priority]}">${t.priority}</span><span class="badge ${t.status==='done'?'badge-green':t.status==='overdue'?'badge-red':'badge-orange'}">${t.status}</span></div>
        ${t.status!=='done'?`<button class="btn btn-success btn-sm" onclick="markTaskDone('${t.title}')">✓ Done</button>`:'<span style="color:var(--green);font-size:12px">✅ Complete</span>'}
      </div>
    </div>`).join('');
}

// ══════════════════════════════════════════════════
// WALLET (ADMIN ONLY)
// ══════════════════════════════════════════════════
function renderWallet() {
  const tb = document.getElementById('wallet-staff-table');
  if (tb) tb.innerHTML = walletData.map((w,i)=>{
    const bal = w.allocated - w.spent;
    const pct = Math.round(w.spent/w.allocated*100);
    const bg = i%2===0?'var(--bg2)':'var(--bg3)';
    return `<tr style="background:${bg}">
      <td><b>${w.name}</b></td>
      <td><span class="badge badge-blue">${w.role}</span></td>
      <td>₹${w.allocated.toLocaleString()}</td>
      <td style="color:var(--red)">₹${w.spent.toLocaleString()}</td>
      <td><b style="color:var(--green)">₹${bal.toLocaleString()}</b>
        <div class="progress-bar" style="margin-top:4px"><div class="progress-fill" style="width:${pct}%;background:${pct>80?'var(--red)':pct>50?'var(--orange)':'var(--green)'}"></div></div>
      </td>
      <td style="font-size:11px;color:var(--text2)">${w.lastTx}</td>
      <td><span class="badge badge-blue">${w.bills} bills</span></td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="showToast('Viewing ${w.name} wallet details','info')">View</button>
        <button class="btn btn-primary btn-sm" onclick="openModal('modal-give-fund')">+ Add</button>
      </td>
    </tr>`;
  }).join('');

  const lt = document.getElementById('wallet-ledger-table');
  if (lt) lt.innerHTML = walletLedger.map((l,i)=>{
    const bg = i%2===0?'var(--bg2)':'var(--bg3)';
    const typeColor = l.type==='Fund Allocated'?'badge-green':l.type==='Expense'?'badge-red':'badge-orange';
    return `<tr style="background:${bg}">
      <td>${l.date}</td>
      <td><b>${l.staff}</b></td>
      <td><span class="badge ${typeColor}">${l.type}</span></td>
      <td>${l.cat}</td>
      <td><b style="color:${l.type==='Fund Allocated'?'var(--green)':'var(--red)'}">₹${l.amt.toLocaleString()}</b></td>
      <td><span class="badge badge-gray">${l.mode}</span></td>
      <td>${l.bill}</td>
      <td><b style="color:var(--blue)">${l.balAfter}</b></td>
      <td><button class="btn btn-ghost btn-sm" onclick="showToast('Transaction detail opened','info')">View</button></td>
    </tr>`;
  }).join('');
}

// ══════════════════════════════════════════════════
// EXPENSES
// ══════════════════════════════════════════════════
function renderExpenses() {
  const tb = document.getElementById('expense-table');
  if (!tb) return;
  const me = getMyData();

  // All roles can see expenses — filtered by site/person
  let data = expenses;
  if (me.isAdmin) {
    // Admin sees all
  } else if (me.isManager) {
    data = expenses.filter(e => me.assignedSites.some(s => (e.site||'').includes(s.split(' – ')[0])));
  } else {
    // Staff / Senior: see own expenses only
    data = expenses.filter(e => e.to === me.name);
  }

  // Apply search / filter / sort from UI
  const q = (document.getElementById('exp-search')?.value||'').toLowerCase();
  const cat = document.getElementById('exp-cat')?.value||'';
  const siteF = document.getElementById('exp-site-filter')?.value||'';
  const sort = document.getElementById('exp-sort')?.value||'newest';

  if (q)    data = data.filter(e=>(e.to+e.cat+e.mode).toLowerCase().includes(q));
  if (cat)  data = data.filter(e=>e.cat===cat);
  if (siteF) data = data.filter(e=>(e.site||'').includes(siteF.split(' – ')[0]));
  if (sort==='highest') data = [...data].sort((a,b)=>b.amt-a.amt);
  else if (sort==='lowest') data = [...data].sort((a,b)=>a.amt-b.amt);

  // Render KPI cards — top 4 expense categories today
  const kpiEl = document.getElementById('expense-kpi-cards');
  const catTotals = {};
  expenses.forEach(e=>{ catTotals[e.cat]=(catTotals[e.cat]||0)+e.amt; });
  const sorted = Object.entries(catTotals).sort((a,b)=>b[1]-a[1]);
  const kpiColors = ['stat-red','stat-orange','stat-blue','stat-purple','stat-cyan','stat-yellow'];
  const kpiIcons  = {Materials:'🏗️',Salary:'💰',Transport:'🚗',Fuel:'⛽',Food:'🍽️',Tools:'🔧',Other:'📦'};
  if (kpiEl) kpiEl.innerHTML = sorted.slice(0,4).map(([cat,amt],i)=>`
    <div class="stat-card ${kpiColors[i]}" style="border-left:4px solid var(--${['red','orange','blue','purple'][i]})">
      <div class="stat-icon">${kpiIcons[cat]||'📦'}</div>
      <div class="stat-label">${cat}</div>
      <div class="stat-value" style="color:var(--${['red','orange','blue','purple'][i]});font-size:20px">₹${(amt/1000).toFixed(0)}K</div>
      <div class="stat-sub">#${i+1} highest spend</div>
    </div>`).join('');

  // Summary stats
  const ss = document.getElementById('expense-summary-stats');
  const total = expenses.reduce((a,e)=>a+e.amt,0);
  if (ss) ss.innerHTML = `
    <div class="stat-card stat-blue"><div class="stat-label">Fund Given</div><div class="stat-value" style="color:var(--blue);font-size:20px">₹5.0L</div></div>
    <div class="stat-card stat-red"><div class="stat-label">Total Spent</div><div class="stat-value" style="color:var(--red);font-size:20px">₹${(total/1000).toFixed(0)}K</div></div>
    <div class="stat-card stat-green"><div class="stat-label">Balance</div><div class="stat-value" style="color:var(--green);font-size:20px">₹${((500000-total)/1000).toFixed(0)}K</div></div>
    <div class="stat-card stat-orange"><div class="stat-label">Transactions</div><div class="stat-value" style="color:var(--orange)">${expenses.length}</div></div>`;

  tb.innerHTML = data.length ? data.map(e=>`<tr>
    <td>${e.date}</td>
    <td><b>${e.to}</b></td>
    <td><span class="badge badge-blue">${e.cat}</span></td>
    <td><b style="color:var(--red)">₹${e.amt.toLocaleString()}</b></td>
    <td><span class="chip">${e.site||'—'}</span></td>
    <td><span class="badge badge-gray">${e.mode}</span></td>
    <td>${e.bill}</td>
    <td><b style="color:var(--green)">${e.balance}</b></td>
    <td>
      <button class="btn btn-ghost btn-sm" onclick="showToast('Viewing expense details','info')">View</button>
      ${(me.isAdmin||me.isManager)?`<button class="btn btn-danger btn-sm" onclick="showToast('Expense deleted','warning')" style="margin-left:4px">Del</button>`:''}
    </td>
  </tr>`).join('') : `<tr><td colspan="9" style="text-align:center;color:var(--text2);padding:20px">No expenses found</td></tr>`;
}

// ══════════════════════════════════════════════════
// BANKING
// ══════════════════════════════════════════════════
function renderBanking() {
  const bankData=[{name:'SBI',acct:'XXXX4521',balance:285000,color:'var(--blue)'},{name:'HDFC',acct:'XXXX7832',balance:420000,color:'var(--green)'},{name:'ICICI',acct:'XXXX2901',balance:95000,color:'var(--orange)'}];
  const bc=document.getElementById('bank-cards');
  if (bc) bc.innerHTML=bankData.map(b=>`
    <div class="card" style="border-top:3px solid ${b.color}">
      <div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:16px;font-weight:800">${b.name}</div><span class="badge badge-blue">Active</span></div>
      <div style="font-size:12px;color:var(--text2);margin:4px 0">${b.acct}</div>
      <div style="font-size:22px;font-weight:800;color:${b.color}">₹${(b.balance/1000).toFixed(0)}K</div>
      <div style="font-size:11px;color:var(--text3)">Available Balance</div>
    </div>`).join('');
  const tt=document.getElementById('transaction-table');
  if (tt) tt.innerHTML=transactions.map(t=>`<tr>
    <td>${t.date}</td><td><span class="chip">${t.bank}</span></td>
    <td><span class="badge ${t.type==='Debit'?'badge-red':'badge-green'}">${t.type}</span></td>
    <td><b>${t.party}</b></td>
    <td><b style="color:${t.type==='Debit'?'var(--red)':'var(--green)'}">₹${t.amt.toLocaleString()}</b></td>
    <td><span class="badge badge-gray">${t.mode}</span></td>
    <td style="font-size:12px;color:var(--text2)">${t.ref}</td>
    <td>${t.chequeDate!=='—'?`<span class="badge badge-yellow">📅 ${t.chequeDate}</span>`:'—'}</td>
    <td>${t.proof}</td>
  </tr>`).join('');
}

// ══════════════════════════════════════════════════
// ASSETS
// ══════════════════════════════════════════════════
function renderAssets() {
  const at=document.getElementById('asset-table');
  if (at) at.innerHTML=assets.map(a=>`<tr>
    <td><b>${a.name}</b></td><td><span class="badge badge-blue">${a.cat}</span></td>
    <td>${a.date}</td><td><b>${a.value}</b></td><td>${a.emp}</td><td>${a.site}</td>
    <td><span class="badge badge-green">${a.status}</span></td><td>📎 Bill</td>
    <td><button class="btn btn-ghost btn-sm" onclick="showToast('Asset updated','success')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="showToast('Asset removed','warning')">Del</button></td>
  </tr>`).join('');
  const rt=document.getElementById('reimb-table');
  if (rt) rt.innerHTML=reimbs.map(r=>`<tr>
    <td><b>${r.emp}</b></td><td>${r.item}</td><td><b>${r.amt}</b></td><td>${r.date}</td><td>${r.bill}</td>
    <td><span class="badge ${r.status==='approved'?'badge-green':'badge-orange'}">${r.status}</span></td>
    <td>${r.status==='pending'?`<button class="btn btn-success btn-sm" onclick="showToast('Reimbursement approved','success')">Approve</button>`:'—'}</td>
  </tr>`).join('');
}

// ══════════════════════════════════════════════════
// DOCUMENTS
// ══════════════════════════════════════════════════
function renderDocuments() {
  const grid = document.getElementById('docs-grid');
  if (!grid) return;
  const me = getMyData();
  let data = me.isAdmin ? documents : documents.filter(d=>me.assignedSites.some(s=>d.site.includes(s.split(' – ')[0]))||d.site==='All Sites');

  grid.innerHTML = data.map(d=>{
    const isExpiringSoon = d.expiry !== '—' && new Date(d.expiry.split(' ').join(' ')) < new Date(Date.now()+30*24*60*60*1000);
    return `<div class="card" style="cursor:pointer">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div style="font-size:28px">${d.icon}</div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          <span class="badge badge-blue">${d.type}</span>
          ${isExpiringSoon?'<span class="badge badge-orange">⚠️ Expiring Soon</span>':''}
        </div>
      </div>
      <div style="font-size:14px;font-weight:700;margin-bottom:4px">${d.name}</div>
      <div style="font-size:11px;color:var(--text2);margin-bottom:4px">📍 ${d.site}</div>
      <div style="font-size:11px;color:var(--text3)">Uploaded: ${d.date} · ${d.size}</div>
      ${d.expiry!=='—'?`<div style="font-size:11px;color:${isExpiringSoon?'var(--orange)':'var(--text3)'}">Expires: ${d.expiry}</div>`:''}
      <div style="display:flex;gap:6px;margin-top:10px">
        <button class="btn btn-ghost btn-sm" onclick="showToast('Opening ${d.name}','info')">📂 Open</button>
        ${me.isAdmin?`<button class="btn btn-danger btn-sm" onclick="showToast('Document deleted','warning')">🗑️</button>`:''}
      </div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════
function renderNotifications() {
  const me = getMyData();
  // Staff/Senior: only own notifications (no system-wide alerts)
  let data = notifications;
  if (me.isStaff || me.isSenior) {
    data = notifications.filter(n =>
      n.text.includes(me.name) ||
      n.icon === '📢' || // announcements for all
      n.icon === '✅'    // own check-in
    );
  } else if (me.isManager) {
    // Manager: own + their site notifications
    data = notifications.filter(n =>
      n.text.includes(me.name) ||
      me.assignedSites.some(s => n.text.includes(s.split(' – ')[0])) ||
      n.icon === '📢' ||
      n.icon === '🏖️' || // leave requests
      n.icon === '⚠️'    // site alerts
    );
  }
  const html = data.map(n=>`
    <div class="notif-item ${n.unread?'notif-unread':''}">
      <div class="notif-icon" style="background:${n.bg}">${n.icon}</div>
      <div style="flex:1"><div class="notif-text">${n.text}</div><div class="notif-time">${n.time}</div></div>
      ${n.unread?'<div style="width:8px;height:8px;background:var(--blue);border-radius:50%;flex-shrink:0;margin-top:4px"></div>':''}
    </div>`).join('') || '<div style="padding:20px;text-align:center;color:var(--text2)">No notifications</div>';
  const nl=document.getElementById('notif-list');
  const pl=document.getElementById('notif-panel-list');
  if (nl) nl.innerHTML=`<div class="card-title">Notifications (${data.length})</div>`+html;
  if (pl) pl.innerHTML=html;
}

// ══════════════════════════════════════════════════
// REPORTS – ROLE-FILTERED + DEMO MODAL
// ══════════════════════════════════════════════════
function renderReports() {
  const me = getMyData();

  // Consolidated sub-tabs
  if (me.isAdmin || me.isManager) {
    const cct = document.getElementById('consol-checkin-table');
    let attData = me.isAdmin ? employees : employees.filter(e=>me.assignedSites.some(s=>e.site.includes(s.split(' – ')[0])));
    if (cct) cct.innerHTML = attData.map(e=>`<tr>
      <td><b>${e.name}</b></td><td><span class="badge badge-blue">${e.role}</span></td>
      <td>${e.site}</td><td>11 Jun 2025</td>
      <td>${e.checkin||'—'}</td><td>${e.checkout||'—'}</td>
      <td style="color:${e.hours==='Live'?'var(--green)':'var(--text)'}">${e.hours}</td>
      <td><span class="badge ${e.attStatus==='Present'?'badge-green':e.attStatus==='Absent'?'badge-red':'badge-orange'}">${e.attStatus}</span></td>
    </tr>`).join('');

    const ctt = document.getElementById('consol-tasks-table');
    let tData = me.isAdmin ? tasks : tasks.filter(t=>me.assignedSites.some(s=>t.site.includes(s.split(' – ')[0])));
    if (ctt) ctt.innerHTML = tData.map(t=>`<tr>
      <td>${t.title}</td><td>${t.emp}</td><td>${t.site}</td><td>${t.due}</td>
      <td><div class="progress-bar" style="width:80px;display:inline-block"><div class="progress-fill" style="width:${t.progress}%;background:${t.status==='done'?'var(--green)':t.status==='overdue'?'var(--red)':'var(--orange)'}"></div></div> <span style="font-size:11px">${t.progress}%</span></td>
      <td><span class="badge ${t.status==='done'?'badge-green':t.status==='overdue'?'badge-red':'badge-orange'}">${t.status}</span></td>
      <td style="font-size:11px;color:var(--text2)">Today</td>
    </tr>`).join('');

    // Daily reports inner tab
    const drl = document.getElementById('daily-reports-list');
    let drData = me.isAdmin ? employees : employees.filter(e=>me.assignedSites.some(s=>e.site.includes(s.split(' – ')[0])));
    if (drl) drl.innerHTML = drData.slice(0,4).map(e=>`
      <div class="card" style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:8px"><div class="av" style="background:${e.color}">${e.name[0]}</div><div><b>${e.name}</b><div style="font-size:11px;color:var(--text2)">${e.site} · ${e.role}</div></div></div>
          <div style="font-size:11px;color:var(--text3)">11 Jun 2025</div>
        </div>
        <div style="font-size:13px;color:var(--text2)">Completed foundation inspection. Safety briefing conducted. Materials checked.</div>
        <div style="display:flex;gap:6px;margin-top:8px"><span class="chip">📸 2 photos</span><span class="chip">📎 1 file</span><span class="chip">🎯 68%</span></div>
      </div>`).join('');

    const cet = document.getElementById('consol-expense-table');
    if (cet) cet.innerHTML = (me.isAdmin?expenses:expenses.filter(e=>me.assignedSites.some(s=>(e.site||'').includes(s.split(' – ')[0])))).map(e=>`<tr>
      <td>${e.date}</td><td>${e.to}</td>
      <td><span class="badge badge-blue">${e.cat}</span></td>
      <td><b style="color:var(--red)">₹${e.amt.toLocaleString()}</b></td>
      <td>${e.site||'—'}</td><td>${e.mode}</td><td>${e.bill}</td>
    </tr>`).join('');
  }

  // Daily Reports page tab (all roles see this — filtered by role)
  renderDailyReportsPage();
  renderLossLog();

  // Reports grid (Admin/Manager only)
  const grid = document.getElementById('reports-grid');
  if (!grid) return;
  const visible = reportsList.filter(r=>r.roles.includes(me.isAdmin?'admin':me.isManager?'manager':'staff'));
  grid.innerHTML = visible.map(r=>`
    <div class="card" style="cursor:pointer;border-top:3px solid ${r.color}" onclick="openDemoReport('${r.name}')">
      <div style="font-size:28px;margin-bottom:10px">${r.icon}</div>
      <div style="font-size:14px;font-weight:800;margin-bottom:6px">${r.name}</div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px">${r.desc}</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();showToast('${r.name} PDF generated!','success')">📄 PDF</button>
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();showToast('${r.name} Excel exported!','success')">📊 Excel</button>
      </div>
    </div>`).join('');
}


// ══════════════════════════════════════════════════
// DEMO REPORT MODAL
// ══════════════════════════════════════════════════
function openDemoReport(name) {
  document.getElementById('report-view-title').textContent = '📊 ' + name;
  const body = document.getElementById('report-view-body');

  // Filter tag
  const sitePart = name.includes(' – ') ? name.split(' – ').slice(1).join(' – ') : '';
  const reportName = name.includes(' – ') ? name.split(' – ')[0] : name;

  const filterBadge = sitePart ? `<div style="margin-bottom:12px"><span class="badge badge-blue">📍 ${sitePart}</span></div>` : '';

  const demoReports = {
    'Attendance Report': `${filterBadge}
      <div style="margin-bottom:12px"><div style="display:flex;gap:12px;flex-wrap:wrap">
        <div class="stat-card stat-green" style="padding:10px;flex:1;min-width:100px"><div class="stat-label">Present</div><div class="stat-value" style="color:var(--green)">41</div></div>
        <div class="stat-card stat-red"   style="padding:10px;flex:1;min-width:100px"><div class="stat-label">Absent</div><div class="stat-value"  style="color:var(--red)">3</div></div>
        <div class="stat-card stat-orange"style="padding:10px;flex:1;min-width:100px"><div class="stat-label">Leave</div><div class="stat-value"  style="color:var(--orange)">4</div></div>
      </div></div>
      <div class="table-wrap"><table><thead><tr><th>Employee</th><th>Site</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr></thead><tbody>
        ${employees.slice(0,5).map(e=>`<tr><td>${e.name}</td><td>${e.site}</td><td>${e.checkin||'—'}</td><td>${e.checkout||'—'}</td><td>${e.hours}</td><td><span class="badge ${e.attStatus==='Present'?'badge-green':e.attStatus==='Absent'?'badge-red':'badge-orange'}">${e.attStatus}</span></td></tr>`).join('')}
      </tbody></table></div>`,
    'Payroll Report': `${filterBadge}
      <div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap">
        <div class="stat-card stat-purple" style="padding:10px;flex:1"><div class="stat-label">Total</div><div class="stat-value" style="color:var(--purple);font-size:18px">₹4.20L</div></div>
        <div class="stat-card stat-green"  style="padding:10px;flex:1"><div class="stat-label">Paid</div><div class="stat-value"  style="color:var(--green);font-size:18px">₹3.60L</div></div>
        <div class="stat-card stat-red"    style="padding:10px;flex:1"><div class="stat-label">Deductions</div><div class="stat-value" style="color:var(--red);font-size:18px">₹28K</div></div>
      </div>
      <div class="table-wrap"><table><thead><tr><th>Employee</th><th>Basic</th><th>HRA</th><th>Deductions</th><th>Net Pay</th><th>Status</th></tr></thead><tbody>
        ${employees.slice(0,5).map(e=>{const net=Math.round(e.salary*1.3*.88);return`<tr><td>${e.name}</td><td>₹${e.salary.toLocaleString()}</td><td>₹${Math.round(e.salary*.2).toLocaleString()}</td><td style="color:var(--red)">-₹${Math.round(e.salary*.12).toLocaleString()}</td><td><b style="color:var(--green)">₹${net.toLocaleString()}</b></td><td><span class="badge badge-green">Paid</span></td></tr>`}).join('')}
      </tbody></table></div>`,
    'Expense Report': `${filterBadge}
      <div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap">
        <div class="stat-card stat-blue"  style="padding:10px;flex:1"><div class="stat-label">Total Given</div><div class="stat-value" style="color:var(--blue);font-size:18px">₹5.0L</div></div>
        <div class="stat-card stat-red"   style="padding:10px;flex:1"><div class="stat-label">Spent</div><div class="stat-value"    style="color:var(--red);font-size:18px">₹1.8L</div></div>
        <div class="stat-card stat-green" style="padding:10px;flex:1"><div class="stat-label">Balance</div><div class="stat-value"  style="color:var(--green);font-size:18px">₹3.2L</div></div>
      </div>
      <div class="table-wrap"><table><thead><tr><th>Date</th><th>Staff</th><th>Category</th><th>Amount</th><th>Site</th><th>Mode</th><th>Bill</th></tr></thead><tbody>
        ${expenses.map(e=>`<tr><td>${e.date}</td><td>${e.to}</td><td><span class="badge badge-blue">${e.cat}</span></td><td style="color:var(--red)">₹${e.amt.toLocaleString()}</td><td>${e.site||'—'}</td><td>${e.mode}</td><td>${e.bill}</td></tr>`).join('')}
      </tbody></table></div>`,
    'Leave Report': `${filterBadge}
      <div class="table-wrap"><table><thead><tr><th>Employee</th><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr></thead><tbody>
        ${[...leavesPending,...leavesApproved,...leavesRejected].map(l=>`<tr><td>${l.name}</td><td><span class="badge badge-blue">${l.type}</span></td><td>${l.from}</td><td>${l.to}</td><td>${l.days}</td><td><span class="badge ${l.by?'badge-green':'badge-orange'}">${l.by?'Approved':'Pending'}</span></td></tr>`).join('')}
      </tbody></table></div>`,
    'Task Report': `${filterBadge}
      <div class="table-wrap"><table><thead><tr><th>Task</th><th>Assigned To</th><th>Site</th><th>Due</th><th>Progress</th><th>Status</th></tr></thead><tbody>
        ${tasks.map(t=>`<tr><td>${t.title}</td><td>${t.emp}</td><td>${t.site}</td><td>${t.due}</td><td><div class="progress-bar" style="width:80px;display:inline-block;vertical-align:middle"><div class="progress-fill" style="width:${t.progress}%;background:${t.status==='done'?'var(--green)':t.status==='overdue'?'var(--red)':'var(--orange)'}"></div></div> ${t.progress}%</td><td><span class="badge ${t.status==='done'?'badge-green':t.status==='overdue'?'badge-red':'badge-orange'}">${t.status}</span></td></tr>`).join('')}
      </tbody></table></div>`,
    'Site Cost Report': `${filterBadge}
      <div class="table-wrap"><table><thead><tr><th>Site</th><th>Type</th><th>Manager</th><th>Assigned</th><th>Present</th><th>Progress</th><th>Cost</th></tr></thead><tbody>
        ${sites.map(s=>`<tr><td><b>${s.name}</b></td><td>${s.siteType||'—'}</td><td>${s.manager}</td><td>${s.assigned}</td><td>${s.present}</td><td><div class="progress-bar" style="width:80px;display:inline-block;vertical-align:middle"><div class="progress-fill" style="width:${s.progress}%;background:${s.color}"></div></div> ${s.progress}%</td><td><b style="color:var(--orange)">${s.cost}</b></td></tr>`).join('')}
      </tbody></table></div>`,
    'Banking Ledger': `${filterBadge}
      <div class="table-wrap"><table><thead><tr><th>Date</th><th>Bank</th><th>Type</th><th>Party</th><th>Amount</th><th>Mode</th><th>Ref</th></tr></thead><tbody>
        ${transactions.map(t=>`<tr><td>${t.date}</td><td>${t.bank}</td><td><span class="badge ${t.type==='Debit'?'badge-red':'badge-green'}">${t.type}</span></td><td>${t.party}</td><td style="color:${t.type==='Debit'?'var(--red)':'var(--green)'}">₹${t.amt.toLocaleString()}</td><td>${t.mode}</td><td style="font-size:11px">${t.ref}</td></tr>`).join('')}
      </tbody></table></div>`,
    'Attendance': `${filterBadge}
      <div class="table-wrap"><table><thead><tr><th>Employee</th><th>Site</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr></thead><tbody>
        ${employees.filter(e=>!sitePart||e.site.includes(sitePart.split('–')[0].trim())).map(e=>`<tr><td>${e.name}</td><td>${e.site}</td><td>${e.checkin||'—'}</td><td>${e.checkout||'—'}</td><td>${e.hours}</td><td><span class="badge ${e.attStatus==='Present'?'badge-green':'badge-orange'}">${e.attStatus}</span></td></tr>`).join('')}
      </tbody></table></div>`,
    'Daily Reports': `${filterBadge}
      <div style="display:flex;flex-direction:column;gap:10px">
        ${dailyReports.filter(r=>!sitePart||r.site.includes(sitePart.split('–')[0].trim())).map(r=>`
          <div style="padding:12px;background:var(--bg3);border-radius:var(--radius-sm)">
            <div style="font-weight:700">${r.emp} · ${r.date}</div>
            <div style="font-size:12px;color:var(--text2);margin:4px 0">${r.summary}</div>
            <div style="font-size:11px">🎯 ${r.milestone} · ${r.progress}%</div>
          </div>`).join('')}
      </div>`,
    'Task Progress': `${filterBadge}
      <div class="table-wrap"><table><thead><tr><th>Task</th><th>Assigned To</th><th>Due</th><th>Progress</th><th>Status</th></tr></thead><tbody>
        ${tasks.filter(t=>!sitePart||t.site.includes(sitePart.split('–')[0].trim())).map(t=>`<tr><td>${t.title}</td><td>${t.emp}</td><td>${t.due}</td><td><div class="progress-bar" style="width:80px;display:inline-block;vertical-align:middle"><div class="progress-fill" style="width:${t.progress}%;background:var(--blue)"></div></div> ${t.progress}%</td><td><span class="badge ${t.status==='done'?'badge-green':t.status==='overdue'?'badge-red':'badge-orange'}">${t.status}</span></td></tr>`).join('')}
      </tbody></table></div>`,
    'Expenses': `${filterBadge}
      <div class="table-wrap"><table><thead><tr><th>Date</th><th>Staff</th><th>Category</th><th>Amount</th><th>Mode</th></tr></thead><tbody>
        ${expenses.filter(e=>!sitePart||(e.site||'').includes(sitePart.split('–')[0].trim())).map(e=>`<tr><td>${e.date}</td><td>${e.to}</td><td><span class="badge badge-blue">${e.cat}</span></td><td style="color:var(--red)">₹${e.amt.toLocaleString()}</td><td>${e.mode}</td></tr>`).join('')}
      </tbody></table></div>`,
    'Loss Log': `${filterBadge}
      <div style="display:flex;flex-direction:column;gap:8px">
        ${lossLog.filter(l=>!sitePart||l.site.includes(sitePart.split('–')[0].trim())).map(l=>`
          <div style="padding:10px;background:var(--red-dim);border-radius:var(--radius-sm)">
            <div style="font-weight:700;color:var(--red)">${l.type}</div>
            <div style="font-size:12px;margin:4px 0">${l.desc}</div>
            <div style="font-size:11px;color:var(--text2)">Cost: ₹${l.cost.toLocaleString()} · ${l.date} · ${l.by}</div>
          </div>`).join('')}
      </div>`,
  };

  // Match by base report name
  const reportHTML = demoReports[reportName] || demoReports[name] ||
    `${filterBadge}<div style="text-align:center;padding:30px;color:var(--text2)">
      <div style="font-size:40px;margin-bottom:12px">📊</div>
      <div style="font-size:16px;font-weight:700;margin-bottom:8px">${name}</div>
      <div style="font-size:13px">Select a date range to generate this report.</div>
      <div style="margin-top:16px;display:flex;gap:8px;justify-content:center;align-items:flex-end">
        <div class="form-group" style="width:140px;text-align:left"><label>From</label><input type="date"></div>
        <div class="form-group" style="width:140px;text-align:left"><label>To</label><input type="date"></div>
        <button class="btn btn-primary" onclick="showToast('Report generated!','success')">Generate</button>
      </div>
    </div>`;

  body.innerHTML = reportHTML;
  openModal('modal-report-view');
}


// ══════════════════════════════════════════════════
// ON-DUTY
// ══════════════════════════════════════════════════
function renderOnDuty() {
  const tb=document.getElementById('onduty-table');
  if (!tb) return;
  const me=getMyData();
  const data = me.isAdmin ? ondutyData : ondutyData.filter(o=>o.emp===me.name||me.assignedSites.some(()=>true));
  tb.innerHTML=data.map(o=>`<tr>
    <td><b>${o.emp}</b></td><td>${o.from}</td><td>${o.to}</td><td>${o.days}</td>
    <td>${o.loc}</td><td style="color:var(--text2)">${o.reason}</td>
    <td><span class="badge ${o.status==='approved'?'badge-green':'badge-orange'}">${o.status}</span></td>
    <td>${o.status==='pending'&&perm('canApprove')?`<button class="btn btn-success btn-sm" onclick="showToast('On-Duty approved','success')">Approve</button>`:'—'}</td>
  </tr>`).join('');
}

// ══════════════════════════════════════════════════
// QR GENERATOR
// ══════════════════════════════════════════════════
function generateQR() {
  document.getElementById('qr-placeholder').style.display='none';
  document.getElementById('qr-display').style.display='block';
  document.getElementById('qr-info').style.display='block';
  document.getElementById('qr-actions').style.display='flex';
  const site=document.getElementById('qr-site')?.value||'Site A';
  const lat=document.getElementById('qr-lat')?.value||'18.5204';
  const lng=document.getElementById('qr-lng')?.value||'73.8567';
  const radius=document.getElementById('qr-radius')?.value||'100';
  document.getElementById('qr-info-site').textContent=site;
  document.getElementById('qr-info-loc').textContent=`${lat}, ${lng}`;
  document.getElementById('qr-info-radius').textContent=radius+'m radius';
  document.getElementById('qr-info-valid').textContent='Valid today';
  showToast('QR generated with GPS coordinates!','success');
}

function refreshQR() { showToast('QR refreshed with new token','info'); }

function pickLocation() {
  const lat=(18.5+Math.random()*.1).toFixed(4);
  const lng=(73.7+Math.random()*.2).toFixed(4);
  document.getElementById('qr-lat').value=lat;
  document.getElementById('qr-lng').value=lng;
  showToast(`Location set: ${lat}, ${lng}`,'success');
}

document.getElementById('qr-radius')?.addEventListener('input', function() {
  const v=this.value||'100';
  const label=document.getElementById('radius-label');
  if (label) label.textContent=v+'m';
});

// ══════════════════════════════════════════════════
// ACTION FUNCTIONS
// ══════════════════════════════════════════════════
function addEmployee() {
  const name=document.getElementById('nef-name').value.trim();
  const phone=document.getElementById('nef-phone').value.trim();
  if (!name||!phone) { showToast('Name and phone required','error'); return; }
  const colors=['#388BFD','#3FB950','#A371F7','#F0883E','#E3B341','#39C5CF'];
  employees.push({ id:employees.length+1, name, role:document.getElementById('nef-role').value, dept:document.getElementById('nef-dept').value, phone, status:'Active', salary:parseInt(document.getElementById('nef-salary').value)||15000, type:document.getElementById('nef-type').value, site:document.getElementById('nef-site').value, color:colors[employees.length%colors.length], checkin:'', checkout:'', hours:'—', attStatus:'Absent' });
  closeModal('modal-add-employee');
  renderEmployees(); renderAttendance();
  showToast(`${name} added! Credentials sent via SMS`, 'success');
  document.getElementById('nef-name').value=''; document.getElementById('nef-phone').value='';
}

function addLeave() {
  closeModal('modal-add-leave');
  showToast('Leave request submitted. Approver notified.', 'success');
  document.getElementById('nb-leaves').textContent='4';
}

function processPayroll() {
  closeModal('modal-process-payroll');
  showToast('Payroll ₹4,20,000 processed! Salary slips sent.', 'success');
}

function addSite() {
  const name=document.getElementById('ns-name')?.value.trim();
  if (!name) { showToast('Site name required','error'); return; }
  const siteType = document.getElementById('ns-type')?.value||'Residential';
  const cost = document.getElementById('ns-cost')?.value||'0';
  const ownership = document.querySelector('input[name="ns-ownership"]:checked')?.value||'personal';
  const lat = parseFloat(document.getElementById('ns-lat')?.value||18.5204);
  const lng = parseFloat(document.getElementById('ns-lng')?.value||73.8567);
  const colors=['#388BFD','#3FB950','#A371F7','#F0883E','#E3B341','#39C5CF'];
  sites.push({
    name, addr:document.getElementById('ns-addr')?.value||'Pune',
    manager:document.getElementById('ns-mgr')?.value||'Amit Kumar',
    assigned:0, present:0, progress:0, cost:'₹0', alert:false,
    color:colors[sites.length%colors.length], lat, lng,
    siteType, estimatedCost:parseInt(cost)||0, ownership
  });
  closeModal('modal-add-site');
  renderSites();
  showToast(`${name} (${siteType}, ${ownership}) created!`, 'success');
  document.getElementById('ns-name').value='';
}

function addTask() {
  const title=document.getElementById('nt-title').value.trim();
  const emp=document.getElementById('nt-emp').value;
  if (!title) { showToast('Task title required','error'); return; }
  tasks.unshift({ title, emp, type:document.getElementById('nt-type').value, due:document.getElementById('nt-due').value||'2025-06-30', priority:document.getElementById('nt-priority').value, status:'pending', site:'Assigned Site', progress:0 });
  closeModal('modal-add-task'); renderTasks();
  showToast(`Task assigned to ${emp}!`, 'success');
  document.getElementById('nt-title').value='';
}

function markTaskDone(title) {
  const t=tasks.find(x=>x.title===title);
  if (t) { t.status='done'; t.progress=100; }
  renderTasks();
  showToast('Task marked done!', 'success');
}

function giveFund() {
  const amt=document.getElementById('gf-amount')?.value;
  if (!amt) { showToast('Amount required','error'); return; }
  closeModal('modal-give-fund');
  showToast(`₹${parseInt(amt).toLocaleString()} allocated. Wallet balance updated.`, 'success');
  document.getElementById('gf-amount').value='';
}

function toggleChequeFields() {
  const mode=document.getElementById('gf-mode')?.value;
  const ref=document.getElementById('gf-ref-group');
  const cd=document.getElementById('gf-cheque-date');
  if (ref) ref.style.display=(mode==='Cash')?'none':'block';
  if (cd)  cd.style.display=(mode==='Cheque')?'block':'none';
}

function uploadDoc() {
  const name=document.getElementById('doc-name').value.trim();
  if (!name) { showToast('Document name required','error'); return; }
  documents.unshift({ name, type:document.getElementById('doc-type').value, site:document.getElementById('doc-site').value, date:'11 Jun 2025', expiry:document.getElementById('doc-expiry').value||'—', size:'1.0 MB', icon:'📄' });
  closeModal('modal-upload-doc'); renderDocuments();
  showToast(`"${name}" uploaded successfully!`, 'success');
  document.getElementById('doc-name').value='';
}

function saveSettings() {
  const name=document.getElementById('settings-name')?.value.trim();
  if (name) document.getElementById('sidebar-user').textContent=name;
  showToast('Settings saved!','success');
}

// ══════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════
(function() {
  const h=new Date().getHours();
  const g=h<12?'Good Morning':h<17?'Good Afternoon':'Good Evening';
  const el=document.getElementById('dash-greeting');
  if (el) el.textContent=`${g}, Admin 👋`;


// ══════════════════════════════════════════════════
// DAILY REPORTS PAGE (sortable/filterable)
// ══════════════════════════════════════════════════
const dailyReports = [
  { id:1, date:'2025-06-11', month:'06', emp:'Deepak Singh', site:'Site A – MG Road', role:'Senior Staff', summary:'Foundation inspection completed – Block A. All pillars checked OK.', progress:68, photos:2, files:1, milestone:'Foundation – Block A' },
  { id:2, date:'2025-06-11', month:'06', emp:'Amit Kumar',   site:'Site A – MG Road', role:'Manager',      summary:'Weekly safety briefing conducted. 12 workers attended. PPE compliance 100%.', progress:68, photos:3, files:0, milestone:'Safety Compliance' },
  { id:3, date:'2025-06-10', month:'06', emp:'Suresh Patel', site:'Site B – Wakad',   role:'Manager',      summary:'Security patrol schedule updated. Night shift coverage increased.', progress:45, photos:1, files:1, milestone:'Security Setup' },
  { id:4, date:'2025-06-10', month:'06', emp:'Ravi Sharma',  site:'Site C – Hinjewadi',role:'Staff',       summary:'Aggregate delivery received and stacked. 18 tons verified.', progress:30, photos:2, files:0, milestone:'Material Received' },
  { id:5, date:'2025-06-09', month:'06', emp:'Mohit Gupta',  site:'Site D – Kothrud', role:'Staff',        summary:'Plumbing rough-in completed for floors 1-3. Water pressure test passed.', progress:85, photos:4, files:2, milestone:'Plumbing – Floors 1-3' },
  { id:6, date:'2025-06-08', month:'06', emp:'Deepak Singh', site:'Site A – MG Road', role:'Senior Staff', summary:'Brick laying started – East wing. 4000 bricks laid today.', progress:62, photos:3, files:0, milestone:'Brickwork – East Wing' },
];

const lossLog = [
  { id:1, date:'2025-06-08', site:'Site C – Hinjewadi', type:'Material Damage', desc:'Cement bags damaged due to rain exposure — 20 bags unusable.', cost:7600, photos:2, by:'Ravi Sharma', status:'Logged' },
  { id:2, date:'2025-06-05', site:'Site A – MG Road',   type:'Structural',      desc:'Minor wall crack in Block B — under observation.', cost:15000, photos:3, by:'Deepak Singh', status:'Under Review' },
  { id:3, date:'2025-06-01', site:'Site B – Wakad',     type:'Equipment Loss',  desc:'One generator fuel cap missing — replacement ordered.', cost:800, photos:1, by:'Suresh Patel', status:'Resolved' },
];

function renderDailyReportsPage() {
  const container = document.getElementById('daily-reports-page');
  if (!container) return;
  const me = getMyData();

  // Role-based data filtering
  let data = [...dailyReports];
  if (me.isAdmin) {
    // Admin sees all
  } else if (me.isManager) {
    // Manager: own reports + subordinates on assigned sites
    data = data.filter(r =>
      r.emp === me.name ||
      me.assignedSites.some(s => r.site.includes(s.split(' – ')[0]))
    );
  } else if (me.isSenior) {
    // Senior: own + juniors (Staff) on their site
    data = data.filter(r =>
      r.emp === me.name ||
      (r.role === 'Staff' && me.assignedSites.some(s => r.site.includes(s.split(' – ')[0])))
    );
  } else {
    // Staff: own only
    data = data.filter(r => r.emp === me.name);
  }

  // Apply UI filters
  const q = (document.getElementById('dr-search')?.value||'').toLowerCase();
  const site = document.getElementById('dr-filter-site')?.value||'';
  const month = document.getElementById('dr-filter-month')?.value||'';
  const sort = document.getElementById('dr-sort')?.value||'newest';

  if (q)     data = data.filter(r=>(r.emp+r.summary+r.site).toLowerCase().includes(q));
  if (site)  data = data.filter(r=>r.site.includes(site.split(' – ')[0]));
  if (month) data = data.filter(r=>r.month===month);
  if (sort==='oldest') data = [...data].sort((a,b)=>a.date.localeCompare(b.date));
  else if (sort==='site') data = [...data].sort((a,b)=>a.site.localeCompare(b.site));
  else if (sort==='progress') data = [...data].sort((a,b)=>b.progress-a.progress);

  const canEdit = (r) => me.isAdmin || r.emp === me.name;

  container.innerHTML = data.length ? data.map(r=>`
    <div class="card" style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;flex-wrap:wrap;gap:8px">
        <div style="display:flex;align-items:center;gap:10px">
          <div class="av" style="background:${employees.find(e=>e.name===r.emp)?.color||'#388BFD'}">${r.emp[0]}</div>
          <div>
            <div style="font-weight:700;font-size:14px">${r.emp}</div>
            <div style="font-size:11px;color:var(--text2)">${r.role} · ${r.site}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="text-align:right">
            <div style="font-size:12px;font-weight:700">${r.date}</div>
            <div style="font-size:11px;color:var(--text3)">Month: ${r.month==='06'?'June':r.month==='05'?'May':'Apr'} 2025</div>
          </div>
        </div>
      </div>
      <div style="font-size:13px;margin-bottom:8px">${r.summary}</div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap">
        <div style="font-size:11px;color:var(--text2)">🎯 Milestone: <b style="color:var(--text)">${r.milestone}</b></div>
        <div style="font-size:11px;color:var(--text2)">Progress: <b style="color:var(--green)">${r.progress}%</b></div>
      </div>
      <div class="progress-bar" style="margin-bottom:8px"><div class="progress-fill" style="width:${r.progress}%;background:var(--green)"></div></div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div style="display:flex;gap:6px">
          ${r.photos?`<span class="chip">📸 ${r.photos} photos</span>`:''}
          ${r.files?`<span class="chip">📎 ${r.files} files</span>`:''}
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="showToast('Opening report details','info')">View</button>
          ${canEdit(r)?`<button class="btn btn-ghost btn-sm" onclick="editDailyReport(${r.id})">✏️ Edit</button>`:''}
          ${canEdit(r)?`<button class="btn btn-danger btn-sm" onclick="deleteDailyReport(${r.id})">🗑️</button>`:''}
        </div>
      </div>
    </div>`).join('') : '<div class="card" style="text-align:center;padding:24px;color:var(--text2)">No reports found for the selected filters.</div>';
}

function filterDailyReports() { renderDailyReportsPage(); }
function editDailyReport(id)   { openModal('modal-daily-report'); showToast('Editing report #'+id,'info'); }
function deleteDailyReport(id) {
  const idx = dailyReports.findIndex(r=>r.id===id);
  if (idx>=0) dailyReports.splice(idx,1);
  renderDailyReportsPage();
  showToast('Report deleted','warning');
}

// ══════════════════════════════════════════════════
// LOSS LOG
// ══════════════════════════════════════════════════
function renderLossLog() {
  const grid = document.getElementById('loss-log-grid');
  if (!grid) return;
  const me = getMyData();
  let data = lossLog;
  if (me.isStaff || me.isSenior) {
    data = lossLog.filter(l => l.by === me.name || me.assignedSites.some(s=>l.site.includes(s.split(' – ')[0])));
  } else if (me.isManager) {
    data = lossLog.filter(l => me.assignedSites.some(s=>l.site.includes(s.split(' – ')[0])));
  }

  const scColors = { Logged:'badge-orange', 'Under Review':'badge-blue', Resolved:'badge-green' };
  grid.innerHTML = data.length ? data.map(l=>`
    <div class="card" style="border-left:3px solid ${l.type==='Structural'?'var(--red)':l.type==='Material Damage'?'var(--orange)':'var(--yellow)'}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-weight:700;font-size:14px">⚠️ ${l.type}</div>
          <div style="font-size:11px;color:var(--text2)">📍 ${l.site} · ${l.date}</div>
        </div>
        <span class="badge ${scColors[l.status]||'badge-gray'}">${l.status}</span>
      </div>
      <div style="font-size:13px;margin-bottom:8px">${l.desc}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div style="display:flex;gap:8px">
          <div><div style="font-size:11px;color:var(--text3)">Cost Impact</div><div style="font-weight:700;color:var(--red)">₹${l.cost.toLocaleString()}</div></div>
          <div><div style="font-size:11px;color:var(--text3)">Logged By</div><div style="font-weight:600;font-size:12px">${l.by}</div></div>
          ${l.photos?`<span class="chip">📸 ${l.photos}</span>`:''}
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="showToast('Loss details opened','info')">View</button>
          ${(me.isAdmin||me.isManager)?`<button class="btn btn-success btn-sm" onclick="showToast('Marked as resolved','success')">Resolve</button>`:''}
        </div>
      </div>
    </div>`).join('') : '<div class="card" style="text-align:center;padding:24px;color:var(--text2)">No loss entries for your sites.</div>';
}

// ══════════════════════════════════════════════════
// SITE MODAL HELPERS
// ══════════════════════════════════════════════════
function toggleOwnership(type) {
  const basic = document.getElementById('ownership-basic-fields');
  const partner = document.getElementById('ownership-partner-fields');
  if (basic) basic.style.display = type==='partnership' ? 'none' : 'block';
  if (partner) partner.style.display = type==='partnership' ? 'block' : 'none';
}
function addPartnerRow() {
  const container = document.getElementById('partner-rows');
  if (!container) return;
  const row = document.createElement('div');
  row.className = 'partner-row';
  row.style.cssText = 'display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:8px;margin-bottom:8px;align-items:end';
  row.innerHTML = `
    <div class="form-group" style="margin:0"><label>Partner Name</label><input placeholder="Partner name"></div>
    <div class="form-group" style="margin:0"><label>Share %</label><input type="number" placeholder="25" min="1" max="100" oninput="recalcShares()"></div>
    <div class="form-group" style="margin:0"><label>Fixed Amt (₹)</label><input type="number" placeholder="Optional"></div>
    <button class="btn btn-ghost btn-sm" style="height:36px;margin-top:20px" onclick="removePartnerRow(this)">✕</button>`;
  container.appendChild(row);
  recalcShares();
}
function removePartnerRow(btn) {
  btn.closest('.partner-row').remove();
  recalcShares();
}
function recalcShares() {
  const rows = document.querySelectorAll('.partner-row');
  let total = 0;
  rows.forEach(row => {
    // The share % is the SECOND input (index 1) in each row: Name | Share% | Fixed
    const allInputs = row.querySelectorAll('input');
    if (allInputs[1]) total += parseFloat(allInputs[1].value || 0);
  });
  const el = document.getElementById('share-total');
  if (el) {
    el.textContent = total + '%';
    el.style.color = total === 100 ? 'var(--green)' : total > 100 ? 'var(--red)' : 'var(--orange)';
  }
}



// ══════════════════════════════════════════════════
// EMPLOYEE DETAIL
// ══════════════════════════════════════════════════
let currentEmpId = null;

function openEmpDetail(id) {
  const e = employees.find(x => x.id === id);
  if (!e) return;
  currentEmpId = id;

  // Show page
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const empPage = document.getElementById('page-empdetail');
  if (empPage) empPage.classList.add('active');
  const ptitle = document.getElementById('page-title');
  if (ptitle) ptitle.textContent = '👤 ' + e.name;

  // Header
  const av = document.getElementById('empd-avatar');
  if (av) { av.textContent = e.name[0]; av.style.background = e.color; }
  const eln = id => document.getElementById(id);
  const set = (id, val) => { const el = eln(id); if (el) el.textContent = val; };
  set('empd-name', e.name);
  set('empd-role-dept', e.role + ' · ' + e.dept);
  set('empd-breadcrumb', e.name);
  const badge = eln('empd-status-badge');
  if (badge) { badge.textContent = e.status; badge.className = 'badge ' + (e.status==='Active'?'badge-green':'badge-red'); }

  // Stats
  const myTasks = tasks.filter(t => t.emp === e.name);
  const ss = eln('empd-stats');
  if (ss) ss.innerHTML = `
    <div class="stat-card stat-green"><div class="stat-label">Attendance</div><div class="stat-value" style="color:var(--green);font-size:16px">${e.attStatus}</div></div>
    <div class="stat-card stat-blue"><div class="stat-label">Today</div><div class="stat-value" style="color:var(--blue);font-size:14px">${e.checkin||'—'} → ${e.checkout||'—'}</div><div class="stat-sub">Check-in → Check-out</div></div>
    <div class="stat-card stat-purple"><div class="stat-label">Net Salary</div><div class="stat-value" style="color:var(--purple);font-size:18px">₹${Math.round(e.salary*1.18*.88).toLocaleString()}</div></div>
    <div class="stat-card stat-yellow"><div class="stat-label">Tasks</div><div class="stat-value" style="color:var(--yellow)">${myTasks.length}</div><div class="stat-sub">${myTasks.filter(t=>t.status==='done').length} done</div></div>
    <div class="stat-card stat-orange"><div class="stat-label">Live Hours</div><div class="stat-value" style="color:var(--orange);font-size:16px">${e.hours}</div></div>`;

  // Profile tab
  const pi = eln('empd-personal-info');
  if (pi) pi.innerHTML = [
    ['Employee ID', 'EMP-00'+e.id.toString().padStart(3,'0')],
    ['Full Name', e.name],
    ['Mobile', e.phone],
    ['Department', e.dept],
    ['Designation', e.role],
    ['Site', e.site],
    ['Employee Type', e.type],
    ['Status', e.status],
  ].map(([k,v]) => `<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:var(--text2)">${k}</span><b>${v}</b></div>`).join('');

  const ei = eln('empd-employ-info');
  const hra = Math.round(e.salary*.2), allow = Math.round(e.salary*.1), pf = Math.round(e.salary*.12);
  if (ei) ei.innerHTML = [
    ['Basic Salary', '₹'+e.salary.toLocaleString()],
    ['HRA (20%)', '₹'+hra.toLocaleString()],
    ['Allowances', '₹'+allow.toLocaleString()],
    ['PF Deduction', '₹'+pf.toLocaleString()],
    ['Net Pay', '₹'+(e.salary+hra+allow-pf).toLocaleString()],
    ['Pay Cycle', 'Monthly'],
    ['Joining Date', '01 Jan 2024'],
  ].map(([k,v]) => `<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:var(--text2)">${k}</span><b style="color:${k==='Net Pay'?'var(--green)':k==='PF Deduction'?'var(--red)':'var(--text)'}">${v}</b></div>`).join('');

  // History tab
  const hl = eln('empd-history-list');
  const history = [
    { time:'Today 09:02', text:`Checked in at ${e.site}`, icon:'✅', color:'var(--green)' },
    { time:'Yesterday', text:`Completed task: "Progress report submission"`, icon:'📋', color:'var(--blue)' },
    { time:'10 Jun', text:`Leave approved (Sick Leave – 1 day)`, icon:'🏖️', color:'var(--orange)' },
    { time:'08 Jun', text:`Expense ₹2,000 recorded (Fuel)`, icon:'💸', color:'var(--red)' },
    { time:'05 Jun', text:`Task assigned: "Foundation inspection"`, icon:'✅', color:'var(--purple)' },
    { time:'01 Jun', text:`Salary ₹${Math.round(e.salary*1.18*.88).toLocaleString()} processed`, icon:'💰', color:'var(--green)' },
  ];
  if (hl) hl.innerHTML = `<div class="timeline">${history.map(h=>`
    <div class="tl-item">
      <div class="tl-dot" style="background:${h.color}"></div>
      <div class="tl-time">${h.time}</div>
      <div class="tl-text">${h.icon} ${h.text}</div>
    </div>`).join('')}</div>`;

  // Tasks tab
  const tl = eln('empd-tasks-list');
  if (tl) {
    const empTasks = tasks.filter(t => t.emp === e.name);
    tl.innerHTML = empTasks.length ? empTasks.map(t => `
      <div style="padding:10px 0;border-bottom:1px solid var(--border)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <div style="font-weight:600;font-size:13px">${t.title}</div>
          <span class="badge ${t.status==='done'?'badge-green':t.status==='overdue'?'badge-red':'badge-orange'}">${t.status}</span>
        </div>
        <div style="font-size:11px;color:var(--text2)">📍 ${t.site} · Due: ${t.due} · ${t.type}</div>
        <div class="progress-bar" style="margin-top:6px"><div class="progress-fill" style="width:${t.progress}%;background:${t.status==='done'?'var(--green)':t.status==='overdue'?'var(--red)':'var(--orange)'}"></div></div>
      </div>`).join('') : '<div style="color:var(--text2);padding:16px 0">No tasks assigned</div>';
  }

  // Payroll history tab
  const pt = eln('empd-payroll-table');
  if (pt) {
    const months = ['June 2025','May 2025','Apr 2025','Mar 2025','Feb 2025','Jan 2025'];
    pt.innerHTML = months.map((m,i) => {
      const hra = Math.round(e.salary*.2), allow = Math.round(e.salary*.1), pf = Math.round(e.salary*.12);
      const net = e.salary + hra + allow - pf;
      return `<tr>
        <td><b>${m}</b></td>
        <td>₹${e.salary.toLocaleString()}</td>
        <td>₹${hra.toLocaleString()}</td>
        <td>₹${allow.toLocaleString()}</td>
        <td style="color:var(--red)">-₹${pf.toLocaleString()}</td>
        <td><b style="color:var(--green)">₹${net.toLocaleString()}</b></td>
        <td><span class="badge ${i<4?'badge-green':'badge-orange'}">${i<4?'Paid':'Pending'}</span></td>
        <td><button class="btn btn-ghost btn-sm" onclick="showToast('Salary slip downloaded!','success')">📄</button></td>
      </tr>`;
    }).join('');
  }

  // Attendance calendar
  const cal = eln('empd-calendar');
  if (cal) {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const statuses = ['present','present','present','absent','present','weekoff','weekoff','present','leave','present','present','present','weekoff','weekoff'];
    cal.innerHTML = `<div class="cal-grid">${days.map(d=>`<div class="cal-header">${d}</div>`).join('')}${statuses.map((s,i)=>`<div class="cal-day ${s}" title="${s}">${i+1}</div>`).join('')}</div>`;
  }
}

function toggleEmpStatus() {
  const e = employees.find(x => x.id === currentEmpId);
  if (!e) return;
  e.status = e.status === 'Active' ? 'Inactive' : 'Active';
  const badge = document.getElementById('empd-status-badge');
  if (badge) { badge.textContent = e.status; badge.className = 'badge '+(e.status==='Active'?'badge-green':'badge-red'); }
  showToast(`${e.name} marked as ${e.status}`, e.status==='Active'?'success':'warning');
  renderEmployees();
}

function openEditEmp() {
  openModal('modal-add-employee');
  const e = employees.find(x => x.id === currentEmpId);
  if (!e) return;
  setTimeout(() => {
    const n = document.getElementById('nef-name'); if (n) n.value = e.name;
    const p = document.getElementById('nef-phone'); if (p) p.value = e.phone;
    const s = document.getElementById('nef-salary'); if (s) s.value = e.salary;
  }, 50);
  showToast('Editing ' + e.name, 'info');
}

function deleteEmp() {
  const e = employees.find(x => x.id === currentEmpId);
  if (!e) return;
  if (confirm(`Delete ${e.name}? This cannot be undone.`)) {
    const idx = employees.findIndex(x => x.id === currentEmpId);
    employees.splice(idx, 1);
    navigate(document.querySelector('[data-page=employees]'));
    renderEmployees();
    showToast(e.name + ' deleted', 'warning');
  }
}

// ══════════════════════════════════════════════════
// SITE EDIT / DELETE
// ══════════════════════════════════════════════════
function openEditSite() {
  if (!currentSiteView) return;
  openModal('modal-add-site');
  setTimeout(() => {
    const n = document.getElementById('ns-name'); if (n) n.value = currentSiteView.name;
    const a = document.getElementById('ns-addr'); if (a) a.value = currentSiteView.addr;
  }, 50);
  showToast('Editing site: ' + currentSiteView.name, 'info');
}

function deleteSite() {
  if (!currentSiteView) return;
  if (confirm('Delete ' + currentSiteView.name + '? This cannot be undone.')) {
    const idx = sites.findIndex(s => s.name === currentSiteView.name);
    if (idx >= 0) sites.splice(idx, 1);
    currentSiteView = null;
    navigate(document.querySelector('[data-page=sites]'));
    renderSites();
    showToast('Site deleted', 'warning');
  }
}

// ══════════════════════════════════════════════════
// INVENTORY & MATERIALS
// ══════════════════════════════════════════════════
const inventoryData = [
  { name:'Cement (OPC 53)',  cat:'Cement', unit1:'Bags', qty1:450, unit2:'Kg',    qty2:22500, location:'Pune Hadapsar Godown', site:'Main Godown',      rate:380,  minAlert:50  },
  { name:'Steel (TMT 12mm)', cat:'Steel',  unit1:'Tons', qty1:8,   unit2:'Kg',    qty2:8000,  location:'Pune Katraj Godown',   site:'Main Godown',      rate:62000,minAlert:2   },
  { name:'Sand (River)',     cat:'Sand',   unit1:'Tons', qty1:25,  unit2:'Sq Ft', qty2:9000,  location:'Site A – MG Road',     site:'Site A – MG Road', rate:1800, minAlert:5   },
  { name:'Bricks (Red)',     cat:'Bricks', unit1:'Pieces',qty1:12000,unit2:'—',  qty2:0,     location:'Site B – Wakad',       site:'Site B – Wakad',   rate:8,    minAlert:2000},
  { name:'Aggregate (20mm)', cat:'Aggregate',unit1:'Tons',qty1:18,unit2:'Kg',    qty2:18000, location:'Site C – Hinjewadi',   site:'Site C – Hinjewadi',rate:1200,minAlert:3   },
  { name:'White Cement',     cat:'Cement', unit1:'Bags', qty1:80,  unit2:'Kg',    qty2:3200,  location:'Site D – Kothrud',     site:'Site D – Kothrud', rate:650,  minAlert:15  },
];
const transferLog = [
  { date:'10 Jun', mat:'Cement (OPC 53)',  qty:'50 Bags', from:'Main Godown',    to:'Site A – MG Road',   reason:'Site replenishment',      emergency:false, by:'Amit Kumar'  },
  { date:'09 Jun', mat:'Steel (TMT 12mm)', qty:'2 Tons',  from:'Main Godown',    to:'Site C – Hinjewadi', reason:'Foundation work starting', emergency:true,  by:'Admin'       },
  { date:'08 Jun', mat:'Sand (River)',      qty:'5 Tons',  from:'Site B – Wakad', to:'Site A – MG Road',   reason:'Shortage at Site A',       emergency:true,  by:'Suresh Patel'},
  { date:'07 Jun', mat:'Bricks (Red)',      qty:'3000 Pcs',from:'Main Godown',    to:'Site B – Wakad',     reason:'Brick laying phase',       emergency:false, by:'Amit Kumar'  },
];

function renderInventory() {
  // Guard: only render if on inventory page
  const sv = document.getElementById('inv-stats');
  const totalVal = inventoryData.reduce((a,i)=>a+i.qty1*i.rate,0);
  const lowStock = inventoryData.filter(i=>i.qty1<=i.minAlert*1.2).length;
  if (sv) sv.innerHTML = `
    <div class="stat-card stat-blue"><div class="stat-icon">📦</div><div class="stat-label">Material Types</div><div class="stat-value" style="color:var(--blue)">${inventoryData.length}</div></div>
    <div class="stat-card stat-green"><div class="stat-icon">💰</div><div class="stat-label">Total Stock Value</div><div class="stat-value" style="color:var(--green);font-size:20px">₹${(totalVal/100000).toFixed(1)}L</div></div>
    <div class="stat-card stat-orange"><div class="stat-icon">🔄</div><div class="stat-label">Transfers This Month</div><div class="stat-value" style="color:var(--orange)">${transferLog.length}</div></div>
    <div class="stat-card stat-red"><div class="stat-icon">⚠️</div><div class="stat-label">Low Stock Alerts</div><div class="stat-value" style="color:var(--red)">${lowStock}</div></div>`;

  // Stock table
  const st = document.getElementById('inv-stock-table');
  if (st) st.innerHTML = inventoryData.map((m,i)=>{
    const val = m.qty1*m.rate;
    const isLow = m.qty1 <= m.minAlert*1.2;
    const bg = i%2===0?'':'var(--bg3)';
    return `<tr style="background:${bg}">
      <td><b>${m.name}</b></td>
      <td><span class="badge badge-blue">${m.unit1}</span></td>
      <td><b style="color:${isLow?'var(--red)':'var(--text)'}">${m.qty1.toLocaleString()}</b>${isLow?'<span class="badge badge-red" style="margin-left:4px">Low</span>':''}</td>
      <td><span class="badge badge-gray">${m.unit2}</span></td>
      <td>${m.qty2>0?m.qty2.toLocaleString():'—'}</td>
      <td style="font-size:11px;color:var(--text2)">📍 ${m.location}</td>
      <td><span class="chip">${m.site}</span></td>
      <td><b style="color:var(--green)">₹${(val/1000).toFixed(0)}K</b></td>
      <td><span class="badge ${isLow?'badge-red':'badge-green'}">${isLow?'⚠️ Low Stock':'In Stock'}</span></td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="showToast('Editing ${m.name}','info')">Edit</button>
        <button class="btn btn-warning btn-sm" onclick="openModal('modal-material-transfer')">Transfer</button>
      </td>
    </tr>`;
  }).join('');

  // Godown cards
  const gc = document.getElementById('godown-cards');
  const godowns = [
    { name:'Pune Hadapsar Godown', items:3, value:'₹2.8L', color:'var(--blue)',   materials:['Cement 450 Bags','Steel 8T','Aggregate 18T'] },
    { name:'Pune Katraj Godown',   items:2, value:'₹1.2L', color:'var(--green)',  materials:['Sand 25T','Bricks 12K pcs'] },
    { name:'Site A – MG Road',     items:2, value:'₹0.4L', color:'var(--orange)', materials:['Sand 8T','White Cement 30 Bags'] },
    { name:'Site B – Wakad',       items:1, value:'₹0.1L', color:'var(--purple)', materials:['Bricks 4K pcs'] },
  ];
  if (gc) gc.innerHTML = godowns.map(g=>`
    <div class="card" style="border-top:3px solid ${g.color}">
      <div style="font-size:18px;font-weight:800;margin-bottom:4px">${g.name}</div>
      <div style="display:flex;gap:16px;margin-bottom:10px">
        <div><div style="font-size:11px;color:var(--text3)">Items</div><div style="font-size:18px;font-weight:700">${g.items}</div></div>
        <div><div style="font-size:11px;color:var(--text3)">Value</div><div style="font-size:18px;font-weight:700;color:${g.color}">${g.value}</div></div>
      </div>
      ${g.materials.map(m=>`<div class="chip" style="margin-bottom:4px">${m}</div>`).join('')}
      <div style="margin-top:10px;display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="showToast('Opening godown details','info')">View Details</button>
        <button class="btn btn-primary btn-sm" onclick="openModal('modal-add-material')">+ Add Stock</button>
      </div>
    </div>`).join('');

  // Transfer log
  const tl = document.getElementById('inv-transfer-table');
  if (tl) tl.innerHTML = transferLog.map((t,i)=>{
    const bg = i%2===0?'':'var(--bg3)';
    return `<tr style="background:${bg}">
      <td>${t.date}</td>
      <td><b>${t.mat}</b></td>
      <td>${t.qty}</td>
      <td><span class="chip">${t.from}</span></td>
      <td><span class="chip">${t.to}</span></td>
      <td style="font-size:12px;color:var(--text2)">${t.reason}</td>
      <td>${t.emergency?'<span class="badge badge-red">⚠️ Emergency</span>':'<span class="badge badge-green">Normal</span>'}</td>
      <td>${t.by}</td>
    </tr>`;
  }).join('');

  // Valuation stats
  const vs = document.getElementById('inv-val-stats');
  if (vs) vs.innerHTML = `
    <div class="stat-card stat-blue"><div class="stat-label">Total Stock Value</div><div class="stat-value" style="color:var(--blue);font-size:20px">₹${(totalVal/100000).toFixed(2)}L</div></div>
    <div class="stat-card stat-green"><div class="stat-label">Site A – MG Road</div><div class="stat-value" style="color:var(--green);font-size:20px">₹1.2L</div><div class="stat-sub">3 materials</div></div>
    <div class="stat-card stat-orange"><div class="stat-label">Site B – Wakad</div><div class="stat-value" style="color:var(--orange);font-size:20px">₹0.8L</div><div class="stat-sub">2 materials</div></div>
    <div class="stat-card stat-purple"><div class="stat-label">Main Godown</div><div class="stat-value" style="color:var(--purple);font-size:20px">₹4.0L</div><div class="stat-sub">5 materials</div></div>`;

  // Valuation table
  const vt = document.getElementById('inv-val-table');
  const valRows = [
    { site:'Site A – MG Road', mat:'Cement',  req:500,  cons:280, bal:220, val:'₹83,600' },
    { site:'Site A – MG Road', mat:'Steel',   req:15,   cons:9,   bal:6,   val:'₹3.7L'  },
    { site:'Site B – Wakad',   mat:'Bricks',  req:20000,cons:8000,bal:12000,val:'₹96,000'},
    { site:'Site C – Hinjewadi',mat:'Aggregate',req:30, cons:18,  bal:12,  val:'₹1.4L'  },
  ];
  if (vt) vt.innerHTML = valRows.map((r,i)=>{
    const pct = Math.round(r.cons/r.req*100);
    const bg = i%2===0?'':'var(--bg3)';
    return `<tr style="background:${bg}">
      <td><span class="chip">${r.site}</span></td>
      <td><b>${r.mat}</b></td>
      <td>${r.req.toLocaleString()}</td>
      <td>${r.cons.toLocaleString()}</td>
      <td><b style="color:${r.bal<r.req*.2?'var(--red)':'var(--green)'}">${r.bal.toLocaleString()}</b></td>
      <td><b>${r.val}</b></td>
      <td>
        <div class="progress-bar" style="width:100px;display:inline-block;vertical-align:middle">
          <div class="progress-fill" style="width:${pct}%;background:${pct>80?'var(--red)':pct>50?'var(--orange)':'var(--green)'}"></div>
        </div> <span style="font-size:11px">${pct}%</span>
      </td>
    </tr>`;
  }).join('');
}

// ══════════════════════════════════════════════════
// REVENUE & PARTNERS
// ══════════════════════════════════════════════════
const unitSales = [
  { unit:'A-101', site:'Site A – MG Road', type:'2 BHK', area:950, rate:5800, total:5510000, buyer:'Ramesh Kulkarni',  status:'Full Payment', revenue:5510000 },
  { unit:'A-201', site:'Site A – MG Road', type:'3 BHK', area:1350,rate:5800, total:7830000, buyer:'Deepa Sharma',    status:'Partial',       revenue:3000000 },
  { unit:'B-102', site:'Site B – Wakad',   type:'1 BHK', area:620, rate:6200, total:3844000, buyer:'Kiran Patil',     status:'Booking Amount',revenue:500000  },
  { unit:'B-201', site:'Site B – Wakad',   type:'2 BHK', area:880, rate:6200, total:5456000, buyer:'Anita Desai',     status:'Full Payment',  revenue:5456000 },
];
const partners = [
  { name:'Shri Ramesh Builders', site:'Site A – MG Road', shareType:'Percentage', share:'30%', contributed:1500000, pending:300000, sqft:2800, color:'#388BFD' },
  { name:'AB Infrastructure',    site:'Site B – Wakad',   shareType:'Fixed',      share:'₹25L',contributed:2000000, pending:500000, sqft:1500, color:'#3FB950' },
  { name:'Kapil Investments',    site:'Site A – MG Road', shareType:'Percentage', share:'20%', contributed:800000,  pending:200000, sqft:1200, color:'#A371F7' },
];
const fundTracking = [
  { site:'Site C – Hinjewadi', type:'Government', total:5000000, received:3200000, pending:1800000, lastReceipt:'01 Jun 2025' },
  { site:'Site D – Kothrud',   type:'Client',     total:3500000, received:3500000, pending:0,       lastReceipt:'15 May 2025' },
  { site:'Site E – Baner',     type:'Partner',    total:8000000, received:4000000, pending:4000000, lastReceipt:'20 Apr 2025' },
];

function renderRevenue() {
  const rs = document.getElementById('rev-stats');
  const totalRev = unitSales.reduce((a,u)=>a+u.revenue,0);
  const totalUnits = unitSales.length;
  const pendingFunds = fundTracking.reduce((a,f)=>a+f.pending,0);
  if (rs) rs.innerHTML = `
    <div class="stat-card stat-green"><div class="stat-icon">💰</div><div class="stat-label">Total Revenue</div><div class="stat-value" style="color:var(--green);font-size:20px">₹${(totalRev/100000).toFixed(1)}L</div></div>
    <div class="stat-card stat-blue"><div class="stat-icon">🏠</div><div class="stat-label">Units Sold</div><div class="stat-value" style="color:var(--blue)">${totalUnits}</div></div>
    <div class="stat-card stat-orange"><div class="stat-icon">⏳</div><div class="stat-label">Pending Funds</div><div class="stat-value" style="color:var(--orange);font-size:20px">₹${(pendingFunds/100000).toFixed(1)}L</div></div>
    <div class="stat-card stat-purple"><div class="stat-icon">🤝</div><div class="stat-label">Active Partners</div><div class="stat-value" style="color:var(--purple)">${partners.length}</div></div>`;

  // Units table
  const ut = document.getElementById('rev-units-table');
  if (ut) ut.innerHTML = unitSales.map((u,i)=>{
    const sc = {Full:'badge-green',Partial:'badge-orange',Booking:'badge-blue'};
    const bg = i%2===0?'':'var(--bg3)';
    return `<tr style="background:${bg}">
      <td><b>${u.unit}</b></td>
      <td><span class="chip">${u.site}</span></td>
      <td>${u.type}</td>
      <td>${u.area.toLocaleString()} sqft</td>
      <td>₹${u.rate.toLocaleString()}</td>
      <td><b>₹${(u.total/100000).toFixed(2)}L</b></td>
      <td>${u.buyer}</td>
      <td><span class="badge ${Object.entries(sc).find(([k])=>u.status.startsWith(k))?.[1]||'badge-gray'}">${u.status}</span></td>
      <td><b style="color:var(--green)">₹${(u.revenue/100000).toFixed(2)}L</b></td>
    </tr>`;
  }).join('');

  // Partner cards
  const pc = document.getElementById('partner-cards');
  if (pc) pc.innerHTML = partners.map(p=>{
    const pct = Math.round(p.contributed/(p.contributed+p.pending)*100);
    return `<div class="card" style="border-top:3px solid ${p.color}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div>
          <div style="font-weight:800;font-size:14px">${p.name}</div>
          <div style="font-size:11px;color:var(--text2)">📍 ${p.site}</div>
        </div>
        <span class="badge badge-blue">${p.shareType}: ${p.share}</span>
      </div>
      <div style="display:flex;gap:16px;margin-bottom:10px">
        <div><div style="font-size:11px;color:var(--text3)">Contributed</div><div style="font-weight:700;color:var(--green)">₹${(p.contributed/100000).toFixed(1)}L</div></div>
        <div><div style="font-size:11px;color:var(--text3)">Pending</div><div style="font-weight:700;color:var(--red)">₹${(p.pending/100000).toFixed(1)}L</div></div>
        <div><div style="font-size:11px;color:var(--text3)">Sq Ft</div><div style="font-weight:700">${p.sqft.toLocaleString()}</div></div>
      </div>
      <div class="progress-bar" style="margin-bottom:6px"><div class="progress-fill" style="width:${pct}%;background:${p.color}"></div></div>
      <div style="font-size:11px;color:var(--text2)">${pct}% paid</div>
      <div style="display:flex;gap:6px;margin-top:10px">
        <button class="btn btn-ghost btn-sm" onclick="showToast('Partner details opened','info')">View</button>
        <button class="btn btn-success btn-sm" onclick="showToast('Payment recorded for ${p.name}','success')">+ Payment</button>
      </div>
    </div>`;
  }).join('');

  // Fund tracking table
  const ft = document.getElementById('rev-funds-table');
  if (ft) ft.innerHTML = fundTracking.map((f,i)=>{
    const pct = Math.round(f.received/f.total*100);
    const bg = i%2===0?'':'var(--bg3)';
    return `<tr style="background:${bg}">
      <td><b>${f.site}</b></td>
      <td><span class="badge ${f.type==='Government'?'badge-blue':f.type==='Client'?'badge-green':'badge-purple'}">${f.type}</span></td>
      <td>₹${(f.total/100000).toFixed(1)}L</td>
      <td style="color:var(--green)"><b>₹${(f.received/100000).toFixed(1)}L</b></td>
      <td style="color:${f.pending>0?'var(--red)':'var(--green)'}"><b>${f.pending>0?'₹'+(f.pending/100000).toFixed(1)+'L':'—'}</b></td>
      <td style="font-size:11px">${f.lastReceipt}</td>
      <td>
        <div class="progress-bar" style="width:80px;display:inline-block;vertical-align:middle">
          <div class="progress-fill" style="width:${pct}%;background:var(--green)"></div>
        </div> <span style="font-size:10px">${pct}%</span>
      </td>
    </tr>`;
  }).join('');

  // Expense split
  const et = document.getElementById('rev-exp-table');
  if (et) et.innerHTML = partners.map((p,i)=>{
    const pct = Math.round(p.contributed/(p.contributed+p.pending)*100);
    const bg = i%2===0?'':'var(--bg3)';
    return `<tr style="background:${bg}">
      <td><b>${p.name}</b></td>
      <td>${p.site}</td>
      <td>${p.share}</td>
      <td style="color:var(--green)">₹${(p.contributed/100000).toFixed(1)}L</td>
      <td style="color:var(--red)">₹${(p.pending/100000).toFixed(1)}L</td>
      <td>
        <div class="progress-bar" style="width:100px;display:inline-block;vertical-align:middle">
          <div class="progress-fill" style="width:${pct}%;background:${pct>=100?'var(--green)':pct>=50?'var(--orange)':'var(--red)'}"></div>
        </div> ${pct}%
      </td>
    </tr>`;
  }).join('');
}

// ══════════════════════════════════════════════════
// THEME SYSTEM
// ══════════════════════════════════════════════════
const themes = {
  dark: {
    '--bg':'#0D1117','--bg2':'#161B22','--bg3':'#1C2333','--bg4':'#21262D',
    '--border':'#30363D','--border2':'#3D4451','--text':'#E6EDF3','--text2':'#8B949E',
    '--text3':'#6E7681','--blue':'#388BFD','--blue2':'#1F6FEB','--blue-dim':'#1D3557',
    '--green':'#3FB950','--green-dim':'#1A3A26','--orange':'#F0883E','--orange-dim':'#3D2A0F',
    '--red':'#F85149','--red-dim':'#3D1010','--purple':'#A371F7','--purple-dim':'#2D1E5E',
    '--yellow':'#E3B341','--yellow-dim':'#3D2D00','--cyan':'#39C5CF','--cyan-dim':'#0E2D33'
  },
  light: {
    '--bg':'#F0F2F5','--bg2':'#FFFFFF','--bg3':'#F5F7FA','--bg4':'#EAECEF',
    '--border':'#D0D7DE','--border2':'#BEC5CC','--text':'#1A1A2E','--text2':'#57606A',
    '--text3':'#8B949E','--blue':'#1F6FEB','--blue2':'#0D5BD4','--blue-dim':'#DDE8FF',
    '--green':'#1A7F37','--green-dim':'#DAFBE1','--orange':'#BC4C00','--orange-dim':'#FFF1E5',
    '--red':'#CF222E','--red-dim':'#FFEBE9','--purple':'#6E40C9','--purple-dim':'#F0EFFF',
    '--yellow':'#9A6700','--yellow-dim':'#FFF8C5','--cyan':'#0969DA','--cyan-dim':'#DBF0FF'
  },
  construction: {
    '--bg':'#0E0900','--bg2':'#1A1200','--bg3':'#261B00','--bg4':'#322400',
    '--border':'#4A3800','--border2':'#5C4800','--text':'#F5E6C8','--text2':'#C4A76A',
    '--text3':'#8B7355','--blue':'#F0883E','--blue2':'#D4721E','--blue-dim':'#3D2000',
    '--green':'#88C057','--green-dim':'#1A2A05','--orange':'#FFB020','--orange-dim':'#3D2A00',
    '--red':'#F85149','--red-dim':'#3D1010','--purple':'#C49A2E','--purple-dim':'#2A1E00',
    '--yellow':'#FFD700','--yellow-dim':'#3D3000','--cyan':'#E8A020','--cyan-dim':'#2A1A00'
  }
};
let currentTheme = 'dark';

function applyTheme(name) {
  if (!themes[name]) return;
  currentTheme = name;
  const t = themes[name];
  const root = document.documentElement;

  // 1. Apply all CSS custom properties to :root
  Object.entries(t).forEach(([k,v]) => root.style.setProperty(k,v));

  // 2. Force override inline backgrounds on key structural elements
  const sidebarEl    = document.getElementById('sidebar');
  const topbarEl     = document.getElementById('topbar');
  const contentEl    = document.getElementById('content');
  const appEl        = document.getElementById('app');

  const bgMap = {
    dark:         { body:'#0D1117', sidebar:'#161B22', topbar:'#161B22', content:'#0D1117' },
    light:        { body:'#F0F2F5', sidebar:'#FFFFFF', topbar:'#FFFFFF', content:'#F0F2F5' },
    construction: { body:'#0E0900', sidebar:'#1A1200', topbar:'#1A1200', content:'#0E0900' },
  };
  const bg = bgMap[name] || bgMap.dark;
  document.body.style.background     = bg.body;
  if (sidebarEl)  sidebarEl.style.background   = bg.sidebar;
  if (topbarEl)   topbarEl.style.background    = bg.topbar;
  if (contentEl)  contentEl.style.background   = bg.content;

  // 3. Force text colour on body for light mode
  if (name === 'light') {
    document.body.style.color = '#1A1A2E';
  } else {
    document.body.style.color = '';
  }

  // 4. Update setting page check marks
  ['dark','light','construction'].forEach(id => {
    const chk  = document.getElementById('theme-'+id+'-check');
    const card = document.getElementById('theme-'+id);
    if (chk)  chk.style.color        = id===name ? 'var(--blue)' : 'transparent';
    if (card) card.style.borderColor  = id===name ? 'var(--blue)' : '#30363D';
  });

  const label = name==='dark'?'🌙 Dark Mode':name==='light'?'☀️ Light Mode':'🏗️ Construction Theme';
  showToast(label + ' applied!', 'success');
}

// ══════════════════════════════════════════════════
// WALLPAPER SYSTEM
// ══════════════════════════════════════════════════
function uploadWallpaper(type) {
  // Simulate wallpaper upload — in real app would use FileReader
  const sampleColors = [
    'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
    'linear-gradient(135deg,#0d1117,#1e3a5f,#2d6a4f)',
    'linear-gradient(135deg,#2c1810,#4a2c1a,#8b4513)',
    'linear-gradient(135deg,#1a0533,#2d1b69,#11998e)',
  ];
  const chosen = sampleColors[Math.floor(Math.random()*sampleColors.length)];
  if (type === 'login') {
    const overlay = document.getElementById('login-wp-overlay');
    if (overlay) { overlay.style.display='block'; overlay.style.background=chosen; overlay.style.opacity='.6'; }
    showToast('Login wallpaper uploaded and applied!','success');
  } else {
    const overlay = document.getElementById('bg-wp-overlay');
    if (overlay) { overlay.style.display='block'; overlay.style.background=chosen; }
    document.getElementById('content').style.backgroundImage = chosen;
    document.getElementById('content').style.backgroundSize = 'cover';
    showToast('Background wallpaper applied! Cards auto-adjusted for readability.','success');
  }
}
function clearWallpaper(type) {
  if (type==='login') {
    const el = document.getElementById('login-wp-overlay');
    if (el) el.style.display='none';
    showToast('Login wallpaper removed','info');
  } else {
    const el = document.getElementById('bg-wp-overlay');
    if (el) el.style.display='none';
    document.getElementById('content').style.backgroundImage = '';
    showToast('Background wallpaper removed','info');
  }
}

// ══════════════════════════════════════════════════
// BACKUP & RECOVERY
// ══════════════════════════════════════════════════
const backupHistory = [
  { datetime:'11 Jun 2025 09:15 AM', filename:'backup_sharma_2025-06-11.json', size:'248 KB', email:'rajesh@sharma.com',  status:'Success' },
  { datetime:'01 Jun 2025 08:00 AM', filename:'backup_sharma_2025-06-01.json', size:'231 KB', email:'rajesh@sharma.com',  status:'Success' },
  { datetime:'15 May 2025 07:45 AM', filename:'backup_sharma_2025-05-15.json', size:'218 KB', email:'rajesh@sharma.com',  status:'Success' },
];

function renderBackupHistory() {
  const tb = document.getElementById('backup-history-table');
  if (!tb) return;
  tb.innerHTML = backupHistory.map((b,i)=>{
    const bg = i%2===0?'':'var(--bg3)';
    return `<tr style="background:${bg}">
      <td>${b.datetime}</td>
      <td><span style="font-family:var(--font-mono);font-size:11px;color:var(--blue)">${b.filename}</span></td>
      <td>${b.size}</td>
      <td>${b.email}</td>
      <td><span class="badge badge-green">✓ ${b.status}</span></td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="showToast('Downloading ${b.filename}','success')">⬇️ Download</button>
        <button class="btn btn-warning btn-sm" onclick="uploadBackupFile('${b.filename}')">🔄 Restore</button>
      </td>
    </tr>`;
  }).join('');
}

function generateBackup() {
  const email = document.getElementById('backup-email')?.value.trim();
  if (!email) { showToast('Enter backup email first','error'); return; }
  const btn = document.getElementById('backup-btn');
  const prog = document.getElementById('backup-progress');
  const result = document.getElementById('backup-result');
  const statusText = document.getElementById('backup-status-text');
  const bar = document.getElementById('backup-progress-bar');
  if (btn) btn.disabled = true;
  if (prog) prog.style.display = 'block';
  if (result) result.style.display = 'none';

  const steps = [
    {pct:15, msg:'Collecting employee data...'},
    {pct:30, msg:'Backing up sites & projects...'},
    {pct:50, msg:'Exporting inventory records...'},
    {pct:65, msg:'Saving attendance & payroll...'},
    {pct:80, msg:'Packing documents & reports...'},
    {pct:95, msg:'Encrypting & compressing...'},
    {pct:100,msg:'Sending to '+email+'...'},
  ];
  let i = 0;
  const interval = setInterval(()=>{
    if (i>=steps.length) {
      clearInterval(interval);
      if (result) {
        result.style.display = 'block';
        const today = new Date().toISOString().slice(0,10);
        const fname = `backup_sharma_${today}.json`;
        document.getElementById('backup-filename').textContent = fname;
        document.getElementById('backup-email-sent').textContent = email;
        // Add to history
        backupHistory.unshift({ datetime:new Date().toLocaleString('en-IN'), filename:fname, size:'252 KB', email, status:'Success' });
        renderBackupHistory();
      }
      if (btn) btn.disabled = false;
      showToast('Backup complete! File emailed to '+email,'success');
      return;
    }
    if (statusText) statusText.textContent = steps[i].msg;
    if (bar) bar.style.width = steps[i].pct + '%';
    i++;
  }, 380);
}

function downloadBackup() {
  // Generate a real JSON blob with app data
  const backupData = {
    version: '1.0',
    exported: new Date().toISOString(),
    company: 'Sharma Constructions',
    sites: sites.map(s=>({name:s.name,addr:s.addr,progress:s.progress})),
    employees: employees.map(e=>({name:e.name,role:e.role,dept:e.dept,phone:e.phone,salary:e.salary})),
    inventory: inventoryData,
    partners: partners,
    unitSales: unitSales,
    tasks: tasks.map(t=>({title:t.title,emp:t.emp,status:t.status})),
    expenses: expenses,
  };
  const blob = new Blob([JSON.stringify(backupData,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const today = new Date().toISOString().slice(0,10);
  a.href = url; a.download = `backup_sharma_${today}.json`;
  a.click(); URL.revokeObjectURL(url);
  showToast('Backup JSON downloaded!','success');
}

function uploadBackupFile(filename) {
  const preview = document.getElementById('restore-preview');
  const previewContent = document.getElementById('restore-preview-content');
  const fname = filename || 'backup_sharma_2025-06-01.json';
  if (preview) preview.style.display='block';
  if (previewContent) previewContent.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:6px;font-size:12px">
      <div style="display:flex;justify-content:space-between"><span style="color:var(--text2)">File:</span><b style="color:var(--blue)">${fname}</b></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--text2)">Employees:</span><b>${employees.length}</b></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--text2)">Sites:</span><b>${sites.length}</b></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--text2)">Tasks:</span><b>${tasks.length}</b></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--text2)">Inventory Items:</span><b>${inventoryData.length}</b></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--text2)">Partners:</span><b>${partners.length}</b></div>
      <div style="margin-top:6px;padding:8px;background:var(--orange-dim);border-radius:6px;color:var(--orange);font-size:11px">⚠️ This will replace all current data with backup data.</div>
    </div>`;
  showToast('Backup file validated successfully!','success');
}
function confirmRestore() {
  document.getElementById('restore-preview').style.display='none';
  showToast('✅ Data restored successfully from backup!','success');
}
function cancelRestore() {
  document.getElementById('restore-preview').style.display='none';
}

// ══════════════════════════════════════════════════
// INVENTORY ACTION FUNCTIONS
// ══════════════════════════════════════════════════
let transferType = 'normal';
function setTransferType(type) {
  transferType = type;
  const banner = document.getElementById('emergency-banner');
  if (banner) banner.style.display = type==='emergency'?'block':'none';
  document.getElementById('transfer-type-normal').className = type==='normal'?'btn btn-primary btn-sm':'btn btn-ghost btn-sm';
  document.getElementById('transfer-type-emergency').className = type==='emergency'?'btn btn-danger btn-sm':'btn btn-ghost btn-sm';
}
function saveMaterialTransfer() {
  const mat = document.getElementById('transfer-mat')?.value;
  const qty = document.getElementById('transfer-qty')?.value;
  const from = document.getElementById('transfer-from')?.value;
  const to = document.getElementById('transfer-to')?.value;
  if (!qty||!from||!to) { showToast('Fill all required fields','error'); return; }
  transferLog.unshift({ date:'Today', mat, qty:qty+' Units', from, to, reason: document.getElementById('transfer-reason')?.value||'Transfer', emergency:transferType==='emergency', by:currentUser });
  closeModal('modal-material-transfer');
  renderInventory();
  showToast(`${mat} transferred from ${from.split('–')[0].trim()} to ${to.split('–')[0].trim()}${transferType==='emergency'?' ⚠️ Admin notified!':''}`, transferType==='emergency'?'warning':'success');
}
function addMaterial() {
  const name = document.getElementById('mat-name')?.value.trim();
  if (!name) { showToast('Material name required','error'); return; }
  inventoryData.push({ name, cat:'Other', unit1:document.getElementById('mat-unit1')?.value||'Bags', qty1:parseInt(document.getElementById('mat-qty1')?.value)||0, unit2:document.getElementById('mat-unit2')?.value||'Kg', qty2:parseInt(document.getElementById('mat-qty2')?.value)||0, location:document.getElementById('mat-loc')?.value||'Godown', site:document.getElementById('mat-site')?.value||'Main Godown', rate:parseInt(document.getElementById('mat-rate')?.value)||0, minAlert:20 });
  closeModal('modal-add-material');
  renderInventory();
  showToast(`${name} added to inventory!`,'success');
  document.getElementById('mat-name').value='';
}

// ══════════════════════════════════════════════════
// REVENUE ACTION FUNCTIONS
// ══════════════════════════════════════════════════
function addPartner() {
  const name = document.getElementById('partner-name')?.value.trim();
  if (!name) { showToast('Partner name required','error'); return; }
  partners.push({ name, site:'Site A – MG Road', shareType:document.getElementById('partner-share-type')?.value||'Percentage', share:document.getElementById('partner-pct')?.value+'%'||'10%', contributed:0, pending:0, sqft:0, color:'#388BFD' });
  closeModal('modal-add-partner');
  renderRevenue();
  showToast(`Partner ${name} added!`,'success');
}
function recordSale() {
  closeModal('modal-add-unit-sale');
  showToast('Unit sale recorded! Revenue updated.','success');
}
function togglePartnerShare() {
  const type = document.getElementById('partner-share-type')?.value;
  document.getElementById('partner-pct-group').style.display = type==='Percentage'?'block':'none';
  document.getElementById('partner-fixed-group').style.display = type==='Fixed Amount'?'block':'none';
}

// ══════════════════════════════════════════════════
// EMERGENCY
// ══════════════════════════════════════════════════
function emergencyCall(service, num) {
  closeModal('modal-emergency');
  if (service==='Admin SOS') {
    showToast('🚨 SOS alert sent to Admin with your location!','warning');
  } else {
    showToast(`📞 Calling ${service} (${num})... Call initiated!`,'warning');
  }
}

// ══════════════════════════════════════════════════
// DAILY REPORT
// ══════════════════════════════════════════════════
function submitDailyReport() {
  closeModal('modal-daily-report');
  showToast('Daily work report submitted! Admin notified.','success');
}

})();
