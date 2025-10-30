// ====== STOCK DATA & INITIAL SETUP ======
// Expanded stocks array with 18 companies (you’ll add more below for full 15+3=18 in total)
const stocks = [
  { symbol: "AAPL", name: "Apple", price: 185, held: 0, history: [], color: "#FFD45C", avgCost: 0, totalSpent: 0 },
  { symbol: "GOOG", name: "Google", price: 2305, held: 0, history: [], color: "#FF8A65", avgCost: 0, totalSpent: 0 },
  { symbol: "TSLA", name: "Tesla", price: 1080, held: 0, history: [], color: "#90CAF9", avgCost: 0, totalSpent: 0 },
  { symbol: "AMZN", name: "Amazon", price: 3420, held: 0, history: [], color: "#A68BFF", avgCost: 0, totalSpent: 0 },
  { symbol: "MSFT", name: "Microsoft", price: 310, held: 0, history: [], color: "#53A653", avgCost: 0, totalSpent: 0 },
  { symbol: "FB", name: "Meta", price: 250, held: 0, history: [], color: "#8E68AD", avgCost: 0, totalSpent: 0 },
  { symbol: "DIS", name: "Disney", price: 140, held: 0, history: [], color: "#7C9ED9", avgCost: 0, totalSpent: 0 },
  { symbol: "NFLX", name: "Netflix", price: 520, held: 0, history: [], color: "#D4312B", avgCost: 0, totalSpent: 0 },
  { symbol: "NVDA", name: "Nvidia", price: 985, held: 0, history: [], color: "#76B900", avgCost: 0, totalSpent: 0 },
  { symbol: "PEPSI", name: "PepsiCo", price: 170, held: 0, history: [], color: "#005CB4", avgCost: 0, totalSpent: 0 },
  { symbol: "KO", name: "Coca-Cola", price: 62, held: 0, history: [], color: "#F40009", avgCost: 0, totalSpent: 0 },
  { symbol: "SONY", name: "Sony", price: 135, held: 0, history: [], color: "#1A1A1A", avgCost: 0, totalSpent: 0 },
  { symbol: "BABA", name: "Alibaba", price: 170, held: 0, history: [], color: "#FF6A00", avgCost: 0, totalSpent: 0 },
  { symbol: "GM", name: "GM", price: 40, held: 0, history: [], color: "#426BB4", avgCost: 0, totalSpent: 0 },
  { symbol: "F", name: "Ford", price: 15, held: 0, history: [], color: "#003478", avgCost: 0, totalSpent: 0 },
  { symbol: "WMT", name: "Walmart", price: 145, held: 0, history: [], color: "#0071CE", avgCost: 0, totalSpent: 0 },
  { symbol: "COST", name: "Costco", price: 520, held: 0, history: [], color: "#E31837", avgCost: 0, totalSpent: 0 },
  { symbol: "UBER", name: "Uber", price: 47, held: 0, history: [], color: "#000000", avgCost: 0, totalSpent: 0 },
];

let yourCompany = null; // { symbol, name, price, held, history, color, type }
let cash = 1000; // Starting cash is now $1,000

// ====== COMPANY TYPES AND COLORS ======
const companyTypes = [
  { type: "Tech", color: "#FFD45C" },
  { type: "Food", color: "#FF8A65" },
  { type: "Retail", color: "#53A653" },
  { type: "Automotive", color: "#90CAF9" },
  { type: "Entertainment", color: "#8E68AD" },
  { type: "Finance", color: "#FFD580" },
  { type: "Healthcare", color: "#DA6B99" }
];

// ====== UTILITY: FILL HISTORIES ======
const historyLength = 40;
function padHistory(stock) {
  while (stock.history.length < historyLength) stock.history.push(stock.price);
  if (stock.history.length > historyLength) stock.history = stock.history.slice(-historyLength);
}
stocks.forEach(padHistory);

// Utility to get stock by symbol (including yourCompany)
function getStockBySymbol(sym) {
  if (yourCompany && sym === "YOU") return yourCompany;
  return stocks.find(s => s.symbol === sym);
}

// ====== MARKET EVENTS ======
const baseEvents = [
  { message: "Federal interest rates changed!", affect: () => allStockPercent(Math.random()*0.04-0.02) },
  { message: "Global supply chain issues.", affect: () => allStockPercent(-0.01-Math.random()*0.025) },
  { message: "Tech stocks soar after innovation report!", affect: () => techStockBoom() },
  { message: "Market correction: Investors cash out gains.", affect: () => allStockPercent(-0.03) },
  { message: "Market confidence up.", affect: () => allStockPercent(Math.random()*0.015) }
];

function allStockPercent(delta) {
  stocks.concat(yourCompany ?? []).forEach(stock => stock && (stock.price *= (1 + delta)));
}

function techStockBoom() {
  stocks.forEach(stock => {
    if (["AAPL", "GOOG", "TSLA", "MSFT", "AMZN", "FB", "NFLX", "NVDA"].includes(stock.symbol)) {
      stock.price *= 1.03 + Math.random()*0.03;
    }
  });
  if (yourCompany && yourCompany.type === "Tech") yourCompany.price *= 1.01 + Math.random()*0.03;
}
// ====== PORTFOLIO LOGIC (with cost basis & average) ======
function getPortfolioValue() {
  let value = cash;
  stocks.forEach(s => value += s.held * s.price);
  if (yourCompany) value += yourCompany.held * yourCompany.price;
  return value;
}

// ====== BUY/SELL LOGIC ======
window.buy = function(symbol) {
  let stock = getStockBySymbol(symbol);
  if (cash >= stock.price) {
    // Cost basis update
    let newTotalSpent = (stock.totalSpent ?? 0) + stock.price;
    let newHeld = (stock.held ?? 0) + 1;
    stock.totalSpent = newTotalSpent;
    stock.held = newHeld;
    stock.avgCost = newTotalSpent / newHeld;
    cash -= stock.price;
    render();
  } else alert("Not enough cash!");
};

window.sell = function(symbol) {
  let stock = getStockBySymbol(symbol);
  if (stock.held > 0) {
    // Proportional reduction of cost basis on sell
    let perShareCost = stock.totalSpent / stock.held;
    stock.held--;
    stock.totalSpent -= perShareCost;
    if (stock.held === 0) {
      stock.totalSpent = 0;
      stock.avgCost = 0;
    } else {
      stock.avgCost = stock.totalSpent / stock.held;
    }
    cash += stock.price;
    // Selling has a minor impact on price
    stock.price *= 0.997 + Math.random()*0.006; 
    stock.price = Math.max(stock.price, 1);
    render();
  }
};

// ====== RENDER PORTFOLIO (enhanced) ======
function renderPortfolio() {
  const all = stocks.concat(yourCompany ?? []);
  document.getElementById('portfolio').innerHTML = `
    <div><strong>Cash:</strong> $${cash.toFixed(2)}</div>
    <div><strong>Holdings:</strong>
      <ul>
        ${all.filter(s => s.held > 0).length === 0
          ? '<li>No stocks owned yet.</li>'
          : all.filter(s => s.held > 0).map(s =>
              `<li>${s.name || s.symbol}: ${s.held} shares @ $${(s.avgCost||0).toFixed(2)} avg (<span style="color:#7cfc00">Paid: $${(s.totalSpent||0).toFixed(2)}</span>) → <span style="color:#FFD45C">Now: $${(s.held*(s.price)).toFixed(2)}</span></li>`).join('')}
      </ul>
    </div>
    <div><strong>Portfolio Value:</strong> $${getPortfolioValue().toFixed(2)}</div>
  `;
}

// You’ll need to call renderPortfolio() instead of directly rendering #portfolio elsewhere in your render()

// ====== COMPANY CREATION WITH TYPE & COLOR, AND COST ======
window.createCompany = function() {
  const name = document.getElementById('companyName').value.slice(0,20);
  const desc = document.getElementById('companyDesc').value.slice(0,32);
  let price = parseFloat(document.getElementById('companyPrice').value);
  const type = document.getElementById('companyType').value;
  if (!(name && desc && price >= 1 && price <= 5000)) return alert("Please enter valid info!");
  if (cash < 100000) return alert("You need $100,000 cash to start your business!");
  // Pick color by company type
  const typeEntry = companyTypes.find(c => c.type === type);
  yourCompany = {
    symbol: "YOU",
    name,
    price,
    held: 0,
    history: Array(historyLength).fill(price),
    color: (typeEntry ? typeEntry.color : "#F3A437"),
    avgCost: 0,
    totalSpent: 0,
    desc,
    type
  };
  cash -= 100000;
  logEvent(`You created <b>${yourCompany.name}</b> ($${yourCompany.price.toFixed(2)}) — type: ${type}.`, "company");
  render();
  updateChart();
}
// ====== BUSINESS DECISIONS: 20 Actions, 2 Per Minute, Shuffle, Global Cooldown ======
const companyActionsPool = [
  { name: "Go Green", desc: "Invest in eco-friendly practices.", outcomes: [
    { msg: "Praised by media, stock jumps!", eff: game => game.price *= 1.09 },
    { msg: "Upfront costs hit profits. Stock dips.", eff: game => game.price *= 0.93 },
    { msg: "Neutral response, no major impact.", eff: game => {} }
  ]},
  { name: "Lay Off Workers", desc: "Reduce payroll to save costs.", outcomes: [
    { msg: "Efficiency boost, stock rises.", eff: game => game.price *= 1.05 },
    { msg: "Reputation falls after protests. Stock sinks.", eff: game => game.price *= 0.89 },
    { msg: "No noticeable effect.", eff: game => {} }
  ]},
  { name: "Launch Viral Ad", desc: "Large marketing campaign online.", outcomes: [
    { msg: "Ad goes viral, surge in optimism!", eff: game => game.price *= 1.12 },
    { msg: "Mixed reaction, almost no impact.", eff: game => {} },
    { msg: "Backfire! Accusations of dishonesty tank stock.", eff: game => game.price *= 0.91 }
  ]},
  { name: "Sponsor a Sports Team", desc: "Boost brand via sports.", outcomes: [
    { msg: "Your team wins. Massive hype!", eff: game => game.price *= 1.15 },
    { msg: "Minor media buzz, little impact.", eff: game => {} },
    { msg: "Team loses badly. Stock suffers.", eff: game => game.price *= 0.92 }
  ]},
  { name: "Acquire Small Competitor", desc: "Buy out a rival.", outcomes: [
    { msg: "Smooth acquisition. Value up!", eff: game => game.price *= 1.13 },
    { msg: "Merger is costly. Profits fall.", eff: game => game.price *= 0.95 },
    { msg: "Complex integration. No effect.", eff: game => {} }
  ]},
  { name: "Launch New Product", desc: "Innovate for growth.", outcomes: [
    { msg: "Product is a hit! Stock up.", eff: game => game.price *= 1.22 },
    { msg: "Muted response. No effect.", eff: game => {} },
    { msg: "Product flops. Stock drops.", eff: game => game.price *= 0.92 }
  ]},
  { name: "Cut Prices", desc: "Slash prices to compete.", outcomes: [
    { msg: "Sales surge, stock rallies!", eff: game => game.price *= 1.12 },
    { msg: "No real effect.", eff: game => {} },
    { msg: "Profit margins erode. Value drops.", eff: game => game.price *= 0.90 }
  ]},
  { name: "Expand Overseas", desc: "Tap international markets.", outcomes: [
    { msg: "Huge success abroad!", eff: game => game.price *= 1.12 },
    { msg: "Regulatory headaches. Stock dips.", eff: game => game.price *= 0.93 },
    { msg: "Slow start. No big change.", eff: game => {} }
  ]},
  { name: "Host Big Public Event", desc: "Make headlines.", outcomes: [
    { msg: "Event is a smash, tons of buzz!", eff: game => game.price *= 1.13 },
    { msg: "Mediocre turnout. No effect.", eff: game => {} },
    { msg: "PR crisis hits! Stock stumbles.", eff: game => game.price *= 0.89 }
  ]},
  { name: "Win Award", desc: "Industry recognition.", outcomes: [
    { msg: "Prestigious award! Stock spikes.", eff: game => game.price *= 1.18 },
    { msg: "Runner-up. Mild approval.", eff: game => game.price *= 1.02 },
    { msg: "Forgotten quickly. No effect.", eff: game => {} }
  ]},
  { name: "Patent New Tech", desc: "Secure IP advantage.", outcomes: [
    { msg: "Patent granted. Investors excited!", eff: game => game.price *= 1.16 },
    { msg: "Long review ahead. Nothing yet.", eff: game => {} },
    { msg: "Patent denied. Setback.", eff: game => game.price *= 0.91 }
  ]},
  { name: "Recall Faulty Product", desc: "Safety first.", outcomes: [
    { msg: "Handled perfectly. Trust increases.", eff: game => game.price *= 1.06 },
    { msg: "Expensive recall. Margins suffer.", eff: game => game.price *= 0.92 },
    { msg: "Managed quietly. No effect.", eff: game => {} }
  ]},
  { name: "Celebrity Endorsement", desc: "Hire a public figure.", outcomes: [
    { msg: "Celebrity is a hit! Big rally.", eff: game => game.price *= 1.13 },
    { msg: "Backfires after scandal. Dip.", eff: game => game.price *= 0.89 },
    { msg: "Meh, no buzz.", eff: game => {} }
  ]},
  { name: "Redesign Brand", desc: "Refreshing your look.", outcomes: [
    { msg: "Customers love new look.", eff: game => game.price *= 1.09 },
    { msg: "Unnoticed. No change.", eff: game => {} },
    { msg: "Backlash, old fans upset.", eff: game => game.price *= 0.95 }
  ]},
  { name: "Legal Setback", desc: "Involved in a lawsuit.", outcomes: [
    { msg: "Win the case! Confidence up.", eff: game => game.price *= 1.1 },
    { msg: "Settlement paid. Stock dips.", eff: game => game.price *= 0.93 },
    { msg: "Case drags on. No effect.", eff: game => {} }
  ]},
  { name: "Partner with Charity", desc: "Good PR move.", outcomes: [
    { msg: "Praised widely! Stock up.", eff: game => game.price *= 1.07 },
    { msg: "No one notices. No change.", eff: game => {} },
    { msg: "Critics skeptical. Dip.", eff: game => game.price *= 0.96 }
  ]},
  { name: "Upgrade Infrastructure", desc: "Modernize company.", outcomes: [
    { msg: "Efficiency gains! Stock up.", eff: game => game.price *= 1.12 },
    { msg: "Delays and costs. Stock falls.", eff: game => game.price *= 0.94 },
    { msg: "Works as planned. No change.", eff: game => {} }
  ]},
  { name: "Mass Hiring", desc: "Expand the team.", outcomes: [
    { msg: "Excitement for future! Up.", eff: game => game.price *= 1.08 },
    { msg: "Dilutes profit. Stock dips.", eff: game => game.price *= 0.96 },
    { msg: "Steady as she goes.", eff: game => {} }
  ]},
  { name: "Announce Stock Buyback", desc: "Show faith in company.", outcomes: [
    { msg: "Investors cheer! Stock up.", eff: game => game.price *= 1.13 },
    { msg: "No one really cares. No effect.", eff: game => {} },
    { msg: "Seems desperate. Stock slides.", eff: game => game.price *= 0.95 }
  ]},
  { name: "License Technology", desc: "Get royalty income.", outcomes: [
    { msg: "Big partner! Stock surges.", eff: game => game.price *= 1.15 },
    { msg: "Deal fizzles. No effect.", eff: game => {} },
    { msg: "IP infringement claim! Fall.", eff: game => game.price *= 0.92 }
  ]}
];

let currentActions = [];
let businessActionCount = 0;
let businessActionCooldown = false;
let businessActionTimeLeft = 0;
let businessActionTimerInterval = null;

function shuffleBusinessActions() {
  // Pick 2 random (non-repeating) actions
  const poolCopy = [...companyActionsPool];
  let sel = [];
  for (let i = 0; i < 2; i++) {
    const idx = Math.floor(Math.random() * poolCopy.length);
    sel.push(poolCopy[idx]);
    poolCopy.splice(idx, 1);
  }
  currentActions = sel;
}

function updateCompanyActions() {
  if (!yourCompany) return;
  let str = "";
  if (businessActionCooldown) {
    str = `<span style='color:#fa4; font-weight:bold'>You must wait ${businessActionTimeLeft}s for your next actions…</span>`;
  } else {
    str = currentActions.map((a, i) => 
      `<button class="bubble-btn" onclick="doAction(${i})" title="${a.desc}" ${businessActionCount >= 2 ? 'disabled' : ''}>${a.name}</button>`
    ).join(' ');
    if (businessActionCount < 2) str += `<span style='color:#7fc97f; margin-left:10px'>Actions left: ${2 - businessActionCount}</span>`;
  }
  document.getElementById('company-actions').innerHTML = str;
}

window.doAction = function(idx) {
  if (!yourCompany || businessActionCooldown || businessActionCount >=2 ) return;
  const act = currentActions[idx];
  const outcome = act.outcomes[Math.floor(Math.random()*act.outcomes.length)];
  outcome.eff(yourCompany);
  padHistory(yourCompany);
  logEvent(`<b>You (${yourCompany.name})</b>: ${outcome.msg}`, "company");
  document.getElementById('company-outcome').innerHTML = outcome.msg;
  businessActionCount++;
  render(); // Redraw prices/UI
  updateChart();
  // Check if both actions used
  if (businessActionCount >= 2) {
    startBusinessCooldown();
  }
}

function startBusinessCooldown() {
  businessActionCooldown = true;
  businessActionTimeLeft = 60;
  updateCompanyActions();
  if (businessActionTimerInterval) clearInterval(businessActionTimerInterval);
  businessActionTimerInterval = setInterval(() => {
    businessActionTimeLeft--;
    updateCompanyActions();
    if (businessActionTimeLeft <= 0) {
      businessActionCooldown = false;
      businessActionCount = 0;
      shuffleBusinessActions();
      updateCompanyActions();
      document.getElementById('company-outcome').innerHTML = '';
      clearInterval(businessActionTimerInterval);
    }
  }, 1000);
}

// Shuffle actions on business panel load and every cooldown
function initBusinessActions() {
  shuffleBusinessActions();
  businessActionCount = 0;
  businessActionCooldown = false;
  businessActionTimeLeft = 0;
}
// ====== TICKS, EVENTS, & FINAL RENDER HOOKS ======

// ====== STOCK PRICE SIMULATION ======
function updateStocks() {
  stocks.concat(yourCompany ?? []).forEach(stock => {
    if (!stock) return;
    // Random walk + mean-reversion + occasional spike
    let base = (Math.random() - 0.49) * (stock.price * 0.022);
    base += (stock.price * 0.0008) * ((stock.history?.[stock.history.length - 1] ?? stock.price) - stock.price) / stock.price;
    stock.price = Math.max(1, stock.price + base);
    stock.history.push(stock.price);
    padHistory(stock);
  });
  render();
  updateChart();
}

// ====== DYNAMIC EVENTS ======
function randomMarketEvent() {
  const event = baseEvents[Math.floor(Math.random() * baseEvents.length)];
  event.affect();
  logEvent(event.message, "market");
  render();
  updateChart();
}

// ====== EVENT SYSTEM ======
function logEvent(message, type = "info") {
  const area = document.getElementById('events-area');
  const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  area.innerHTML = `<div class="event-bubble ${type}"><span class="stamp">${stamp}</span> ${message}</div>` + area.innerHTML;
  let bubbles = area.querySelectorAll('.event-bubble');
  if (bubbles.length > 20) area.removeChild(bubbles[bubbles.length - 1]);
}

// ====== RENDER ALL ======
function render() {
  // MARKET/STOCKS
  document.getElementById('stocks').innerHTML = 
    stocks.concat(yourCompany ?? []).map(stock => `
      <div class="stock-card" style="border-left:5px solid ${stock.color || '#FFD45C'}">
        <span>
          <b style="cursor:pointer; color:${stock.color || '#FFD45C'};" title="Show on graph" onclick="viewSymbol('${stock.symbol || 'YOU'}')">
            ${stock.name || stock.symbol}
          </b>
          : $${stock.price.toFixed(2)}
        </span>
        <span>
          <button onclick="buy('${stock.symbol || "YOU"}')">Buy</button>
          <button onclick="sell('${stock.symbol || "YOU"}')">Sell</button>
          <span class="held">Held: ${stock.held}</span>
        </span>
      </div>
    `).join('');

  renderPortfolio(); // Enhanced portfolio logic, see earlier

  if (yourCompany) {
    document.getElementById('yourCompanyName').textContent = yourCompany.name;
    document.getElementById('yourCompanyPrice').textContent = yourCompany.price.toFixed(2);
    document.getElementById('yourCompanyDesc').textContent = yourCompany.desc;
    // Mini-graph for company
    if (!yourCompany.chart) {
      const ownCtx = document.getElementById('yourCompanyChart').getContext('2d');
      yourCompany.chart = new Chart(ownCtx, {
        type: 'line',
        data: { labels: Array(historyLength).fill(''), datasets: [{
          label: yourCompany.name,
          data: yourCompany.history,
          borderColor: yourCompany.color,
          backgroundColor: yourCompany.color + "44",
          tension: 0.2,
          pointRadius: 0
        }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { grid: { color: "#29374e" } } } }
      });
    }
    yourCompany.chart.data.datasets[0].data = yourCompany.history;
    yourCompany.chart.update();
  }

  document.getElementById('new-company-form').style.display = yourCompany ? "none" : "";
  document.getElementById('company-info').style.display = yourCompany ? "" : "none";
  if (yourCompany) updateCompanyActions();
}
window.render = render;

// ====== TAB HANDLING & CHARTING (unchanged but included for reference) ======
window.showTab = function(tab) {
  document.querySelectorAll('.tablink').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(tabPane => tabPane.classList.remove('active'));
  if (tab === 'market') {
    document.querySelector('.tablink:nth-child(1)').classList.add('active');
    document.getElementById('market-tab').classList.add('active');
    updateChart();
  } else if (tab === 'portfolio') {
    document.querySelector('.tablink:nth-child(2)').classList.add('active');
    document.getElementById('portfolio-tab').classList.add('active');
  } else if (tab === 'company') {
    document.querySelector('.tablink:nth-child(3)').classList.add('active');
    document.getElementById('company-tab').classList.add('active');
  } else if (tab === 'events') {
    document.querySelector('.tablink:nth-child(4)').classList.add('active');
    document.getElementById('events-tab').classList.add('active');
  }
}
window.viewSymbol = function(sym) {
  chartSymbol = sym;
  updateChart();
  showTab('market');
}

// ====== INIT CHARTS AND TICKERS ======
const ctx = document.getElementById('stockChart').getContext('2d');
const mainChart = new Chart(ctx, {
  type: 'line',
  data: { labels: Array(historyLength).fill(''), datasets: [{ label: '', data: [], borderColor: "", backgroundColor: "", tension: 0.2, pointRadius: 0 }] },
  options: { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { grid: { color: "#25334a" } } } }
});
let chartSymbol = stocks[0].symbol;

function updateChart() {
  let cur = getStockBySymbol(chartSymbol);
  if (!cur) return;
  padHistory(cur);
  mainChart.data.datasets[0].data = cur.history;
  mainChart.data.datasets[0].label = cur.name || cur.symbol;
  mainChart.data.datasets[0].borderColor = cur.color || "#FFD45C";
  mainChart.update();
}

// ====== MARKET TICKS ======
setInterval(updateStocks, 1200); // Stocks tick
setInterval(randomMarketEvent, 15000); // Major event every 15s

// ====== INITIALIZE GAME ======
render();
updateChart();
