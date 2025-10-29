// ====== STOCK DATA ======
const stocks = [
  { symbol: "AAPL", name: "Apple", price: 185, held: 0, history: [], color: "#FFD45C" },
  { symbol: "GOOG", name: "Google", price: 2305, held: 0, history: [], color: "#FF8A65" },
  { symbol: "TSLA", name: "Tesla", price: 1080, held: 0, history: [], color: "#90CAF9" }
];
let yourCompany = null; // { symbol, name, price, held, history, color }
let cash = 10000;

// ====== TIME & HISTORY ======
const historyLength = 40;
function padHistory(stock) {
  // Helper: fill histories to proper length
  while (stock.history.length < historyLength) stock.history.push(stock.price);
  if (stock.history.length > historyLength) stock.history = stock.history.slice(-historyLength);
}
stocks.forEach(padHistory);

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
    if (["AAPL", "GOOG", "TSLA"].includes(stock.symbol)) stock.price *= 1.03 + Math.random()*0.03;
  });
  if (yourCompany && yourCompany.symbol === "YOU") yourCompany.price *= 1.01 + Math.random()*0.03;
}

// ====== LINE CHART SETUP ======
let chartSymbol = stocks[0].symbol;
const ctx = document.getElementById('stockChart').getContext('2d');
const mainChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array(historyLength).fill(''),
    datasets: [{ label: '', data: [], borderColor: "", backgroundColor: "", tension: 0.2, pointRadius: 0 }]
  },
  options: { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { grid: { color: "#25334a" }} }}
});

function updateChart() {
  let cur = getStockBySymbol(chartSymbol);
  if (!cur) return;
  padHistory(cur);
  mainChart.data.datasets[0].data = cur.history;
  mainChart.data.datasets[0].label = cur.name || cur.symbol;
  mainChart.data.datasets[0].borderColor = cur.color || "#FFD45C";
  mainChart.update();
}

function getStockBySymbol(sym) {
  if (yourCompany && sym === "YOU") return yourCompany;
  return stocks.find(s => s.symbol === sym);
}

// ====== PORTFOLIO LOGIC ======
function getPortfolioValue() {
  let value = cash;
  stocks.forEach(s => value += s.held * s.price);
  if (yourCompany) value += yourCompany.held * yourCompany.price;
  return value;
}

// ====== STOCK PRICE SIMULATION ======
function updateStocks() {
  stocks.concat(yourCompany ?? []).forEach(stock => {
    if (!stock) return;
    // Random walk + mean-reversion + occasional spike
    let base = (Math.random() - 0.49) * (stock.price * 0.022);
    base += (stock.price * 0.0008) * ((stock.history?.[stock.history.length-1] ?? stock.price) - stock.price)/stock.price;
    stock.price = Math.max(1, stock.price + base);
    stock.history.push(stock.price);
    padHistory(stock);
  });
  render();
  updateChart();
}

// ====== DYNAMIC EVENTS ======
function randomMarketEvent() {
  const event = baseEvents[Math.floor(Math.random()*baseEvents.length)];
  event.affect();
  logEvent(event.message, "market");
  render();
  updateChart();
}

// ====== EVENT SYSTEM ======
function logEvent(message, type="info") {
  const area = document.getElementById('events-area');
  const stamp = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  area.innerHTML = `<div class="event-bubble ${type}"><span class="stamp">${stamp}</span> ${message}</div>` + area.innerHTML;
  // Auto-trim
  let bubbles = area.querySelectorAll('.event-bubble');
  if (bubbles.length > 20) area.removeChild(bubbles[bubbles.length-1]);
}

// ====== RENDER ======
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

  // PORTFOLIO
  const all = stocks.concat(yourCompany ?? []);
  document.getElementById('portfolio').innerHTML = `
    <div><strong>Cash:</strong> $${cash.toFixed(2)}</div>
    <div><strong>Holdings:</strong>
      <ul>
        ${all.filter(s => s.held > 0).length === 0
          ? '<li>No stocks owned yet.</li>'
          : all.filter(s => s.held > 0).map(s =>
              `<li>${s.name || s.symbol}: ${s.held} ($${(s.held*(s.price)).toFixed(2)})</li>`).join('')}
      </ul>
    </div>
    <div><strong>Portfolio Value:</strong> $${getPortfolioValue().toFixed(2)}</div>
  `;

  // YOUR COMPANY INFO PANEL
  if (yourCompany) {
    document.getElementById('yourCompanyName').textContent = yourCompany.name;
    document.getElementById('yourCompanyPrice').textContent = yourCompany.price.toFixed(2);
    document.getElementById('yourCompanyDesc').textContent = yourCompany.desc;
    // Show mini-graph for your company
    if (!yourCompany.chart) {
      // First draw
      const ownCtx = document.getElementById('yourCompanyChart').getContext('2d');
      yourCompany.chart = new Chart(ownCtx, {
        type: 'line',
        data: { labels: Array(historyLength).fill(''), datasets: [{
          label: yourCompany.name,
          data: yourCompany.history,
          borderColor: yourCompany.color,
          backgroundColor: yourCompany.color+"44",
          tension: 0.2,
          pointRadius: 0
        }]},
        options: { plugins:{legend:{display:false}}, scales:{x:{display:false},y:{grid:{color:"#29374e"}}} }
      });
    }
    // Update yourCompany's sub-chart on every tick
    yourCompany.chart.data.datasets[0].data = yourCompany.history;
    yourCompany.chart.update();
  }
  // Show/hide form/panel
  document.getElementById('new-company-form').style.display = yourCompany ? "none" : "";
  document.getElementById('company-info').style.display = yourCompany ? "" : "none";
  
  // Actions
  if (yourCompany) updateCompanyActions();
}
window.render = render;

// ====== TABS & VIEW SYMBOL ======
window.showTab = function(tab) {
  // Remove 'active' from all tab buttons
  document.querySelectorAll('.tablink').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(tabPane => tabPane.classList.remove('active'));
  // Activate the chosen tab
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

// ====== BUY/SELL ======
window.buy = function(symbol) {
  let stock = getStockBySymbol(symbol);
  if (cash >= stock.price) {
    stock.held++;
    cash -= stock.price;
    render();
  } else alert("Not enough cash!");
};
window.sell = function(symbol) {
  let stock = getStockBySymbol(symbol);
  if (stock.held > 0) {
    stock.held--;
    cash += stock.price;
    render();
  }
};

// ====== CREATE COMPANY ======
window.createCompany = function() {
  const name = document.getElementById('companyName').value.slice(0,20);
  const desc = document.getElementById('companyDesc').value.slice(0,32);
  let price = parseFloat(document.getElementById('companyPrice').value);
  if (!(name && desc && price >= 1 && price <= 5000)) return alert("Please enter valid info!");
  yourCompany = {
    symbol: "YOU",
    name,
    price, held: 0, history: Array(historyLength).fill(price),
    color: "#F3A437",
    desc
  };
  logEvent(`You created <b>${yourCompany.name}</b> ($${yourCompany.price.toFixed(2)}).`, "company");
  render();
  updateChart();
}

// ====== BUSINESS DECISIONS ======
const companyActions = [
  {
    name: "Go Green",
    desc: "Invest in eco-friendly practices.",
    outcomes: [
      { msg: "Praised by media, stock jumps!", eff: game => game.price *= 1.09 },
      { msg: "Upfront costs hit profits. Stock dips.", eff: game => game.price *= 0.93 },
      { msg: "Neutral response, no major impact.", eff: game => {} }
    ]
  },
  {
    name: "Lay Off Workers",
    desc: "Reduce payroll to save costs.",
    outcomes: [
      { msg: "Efficiency boost, stock rises.", eff: game => game.price *= 1.05 },
      { msg: "Reputation falls after protests. Stock sinks.", eff: game => game.price *= 0.89 },
      { msg: "No noticeable effect.", eff: game => {} }
    ]
  },
  {
    name: "Launch Viral Ad",
    desc: "Large marketing campaign online.",
    outcomes: [
      { msg: "Ad goes viral, surge in optimism!", eff: game => game.price *= 1.12 },
      { msg: "Mixed reaction, almost no impact.", eff: game => {} },
      { msg: "Backfire! Accusations of dishonesty tank stock.", eff: game => game.price *= 0.91 }
    ]
  }
];
function updateCompanyActions() {
  if (!yourCompany) return;
  // Action buttons
  document.getElementById('company-actions').innerHTML = companyActions.map((a, i) => 
    `<button class="bubble-btn" onclick="doAction(${i})" title="${a.desc}">${a.name}</button>`
  ).join(' ');
}
window.doAction = function(idx) {
  if (!yourCompany) return;
  const act = companyActions[idx];
  const outcome = act.outcomes[Math.floor(Math.random()*act.outcomes.length)];
  outcome.eff(yourCompany);
  padHistory(yourCompany);
  logEvent(`<b>You (${yourCompany.name})</b>: ${outcome.msg}`, "company");
  document.getElementById('company-outcome').innerHTML = outcome.msg;
  render(); // Redraw prices/UI
  updateChart();
}

// ====== MARKET EVENTS TIMER ======
setInterval(updateStocks, 1200); // Stocks tick
setInterval(randomMarketEvent, 15000); // Major event every 15s

// ====== INIT ======
render();
updateChart();
