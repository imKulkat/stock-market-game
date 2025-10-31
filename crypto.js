// ====== CRYPTO DATA & INITIAL SETUP ======
const cryptos = [
  { symbol: "BTC", name: "Bitcoin", price: 68900, held: 0, history: [], color: "#F7931A", avgCost: 0, totalSpent: 0 },
  { symbol: "ETH", name: "Ethereum", price: 3700, held: 0, history: [], color: "#3C3C3D", avgCost: 0, totalSpent: 0 },
  { symbol: "SOL", name: "Solana", price: 160, held: 0, history: [], color: "#00FFA3", avgCost: 0, totalSpent: 0 },
  { symbol: "BNB", name: "BNB", price: 550, held: 0, history: [], color: "#F0B90B", avgCost: 0, totalSpent: 0 },
  { symbol: "DOGE", name: "Dogecoin", price: 0.16, held: 0, history: [], color: "#C2A633", avgCost: 0, totalSpent: 0 },
  { symbol: "ADA", name: "Cardano", price: 0.39, held: 0, history: [], color: "#0033AD", avgCost: 0, totalSpent: 0 },
  { symbol: "XRP", name: "XRP", price: 0.53, held: 0, history: [], color: "#23292F", avgCost: 0, totalSpent: 0 },
  { symbol: "AVAX", name: "Avalanche", price: 40, held: 0, history: [], color: "#E84142", avgCost: 0, totalSpent: 0 },
  { symbol: "MATIC", name: "Polygon", price: 0.55, held: 0, history: [], color: "#8247E5", avgCost: 0, totalSpent: 0 },
  { symbol: "LINK", name: "Chainlink", price: 14, held: 0, history: [], color: "#375BD2", avgCost: 0, totalSpent: 0 },
];

let yourCrypto = null; // your custom coin
defaultCash = 100000;
let cash = defaultCash;

// ====== CRYPTO TYPES AND COLORS ======
const cryptoTypes = [
  { type: "Layer 1", color: "#F7931A" },
  { type: "DeFi", color: "#3C3C3D" },
  { type: "Meme", color: "#C2A633" },
  { type: "Exchange", color: "#F0B90B" },
  { type: "Oracle", color: "#375BD2" },
  { type: "NFT/Game", color: "#8247E5" },
];

// ====== UTILITY: FILL HISTORIES ======
const historyLength = 40;
function padHistory(token) {
  while (token.history.length < historyLength) token.history.push(token.price);
  if (token.history.length > historyLength) token.history = token.history.slice(-historyLength);
}
cryptos.forEach(padHistory);

function getCryptoBySymbol(sym) {
  if (yourCrypto && sym === "YOU") return yourCrypto;
  return cryptos.find(c => c.symbol === sym);
}

// ====== MARKET EVENTS ======
const baseEvents = [
  { message: "Crypto exchange hacked! Market reels.", affect: () => allCryptoPercent(-0.07 - Math.random()*0.08) },
  { message: "Country legalizes crypto! Prices soar.", affect: () => allCryptoPercent(0.02 + Math.random()*0.03) },
  { message: "Celebrity shills meme coin. Meme tokens pump!", affect: () => memeCoinBoom() },
  { message: "SEC hints at crackdown. Market uneasy.", affect: () => allCryptoPercent(-0.05) },
  { message: "ETF approval rumors pump majors!", affect: () => allCryptoPercent(0.04 + Math.random()*0.02) }
];

function allCryptoPercent(delta) {
  cryptos.concat(yourCrypto ?? []).forEach(token => token && (token.price *= (1 + delta)));
}

function memeCoinBoom() {
  cryptos.forEach(token => {
    if (["DOGE", "SHIBA", "PEPE"].includes(token.symbol)) {
      token.price *= 1.15 + Math.random()*0.07;
    }
  });
  if (yourCrypto && yourCrypto.type === "Meme") yourCrypto.price *= 1.03 + Math.random()*0.04;
}

// ====== PORTFOLIO LOGIC ======
function getPortfolioValue() {
  let value = cash;
  cryptos.forEach(c => value += c.held * c.price);
  if (yourCrypto) value += yourCrypto.held * yourCrypto.price;
  return value;
}
const buySound = new Audio('sfx/kaching.mp3');
const sellSound = new Audio('sfx/sell.mp3');
// ====== BUY/SELL LOGIC ======
window.buy = function(symbol) {
  let token = getCryptoBySymbol(symbol);
  if (cash >= token.price) {
    let newTotalSpent = (token.totalSpent ?? 0) + token.price;
    let newHeld = (token.held ?? 0) + 1;
    token.totalSpent = newTotalSpent;
    token.held = newHeld;
    token.avgCost = newTotalSpent / newHeld;
    cash -= token.price;
    buySound.currentTime = 0;
    buySound.play();
    render();
  } else alert("Not enough cash!");
};

window.sell = function(symbol) {
  let token = getCryptoBySymbol(symbol);
  if (token.held > 0) {
    let perCoinCost = token.totalSpent / token.held;
    token.held--;
    token.totalSpent -= perCoinCost;
    if (token.held === 0) {
      token.totalSpent = 0;
      token.avgCost = 0;
    } else {
      token.avgCost = token.totalSpent / token.held;
    }
    cash += token.price;
    token.price *= 0.997 + Math.random()*0.006;
    token.price = Math.max(token.price, 0.01);
    sellSound.currentTime = 0;
    sellSound.play();
    render();
  }
};

// ====== RENDER PORTFOLIO ======
function renderPortfolio() {
  const all = cryptos.concat(yourCrypto ?? []);
  document.getElementById('portfolio').innerHTML = `
    <div><strong>Cash:</strong> $${cash.toFixed(2)}</div>
    <div><strong>Holdings:</strong>
      <ul>
        ${all.filter(c => c.held > 0).length === 0
          ? '<li>No crypto owned yet.</li>'
          : all.filter(c => c.held > 0).map(c =>
              `<li>${c.name || c.symbol}: ${c.held} coins @ $${(c.avgCost||0).toFixed(2)} avg (<span style="color:#7cfc00">Paid: $${(c.totalSpent||0).toFixed(2)}</span>) → <span style="color:#F7931A">Now: $${(c.held*(c.price)).toFixed(2)}</span></li>`).join('')}
      </ul>
    </div>
    <div><strong>Portfolio Value:</strong> $${getPortfolioValue().toFixed(2)}</div>
  `;
}

// ====== COIN CREATION WITH TYPE & COLOR, AND COST ======
window.createCrypto = function() {
  const name = document.getElementById('cryptoName').value.slice(0,20);
  const desc = document.getElementById('cryptoDesc').value.slice(0,32);
  let price = parseFloat(document.getElementById('cryptoPrice').value);
  const type = document.getElementById('cryptoType').value;
  if (!(name && desc && price >= 0.01 && price <= 1000000)) return alert("Please enter valid info!");
  if (cash < 100000) return alert("You need $100,000 cash to launch your coin!");
  const typeEntry = cryptoTypes.find(c => c.type === type);
  yourCrypto = {
    symbol: "YOU",
    name,
    price,
    held: 0,
    history: Array(historyLength).fill(price),
    color: (typeEntry ? typeEntry.color : "#F7931A"),
    avgCost: 0,
    totalSpent: 0,
    desc,
    type
  };
  cash -= 100000;
  logEvent(`You launched <b>${yourCrypto.name}</b> ($${yourCrypto.price.toFixed(2)}) — type: ${type}.`, "company");
  render();
  updateChart();
}

// ====== CRYPTO EVENTS: 2 PER MINUTE, SHUFFLE, COOLDOWN ======
const cryptoActionsPool = [
  { name: "Airdrop Event", desc: "Give free coins to wallets.", outcomes: [
    { msg: "Holders celebrate, coin pumps!", eff: game => game.price *= 1.15 },
    { msg: "Scammers exploit the airdrop. Price dips.", eff: game => game.price *= 0.9 },
    { msg: "No major impact.", eff: game => {} }
  ]},
  { name: "Major Partnership", desc: "Announce big DeFi tie-up.", outcomes: [
    { msg: "Partnership excites market! Surge!", eff: game => game.price *= 1.2 },
    { msg: "Rumor fades, no effect.", eff: game => {} },
    { msg: "Deal falls through. Coin dumps.", eff: game => game.price *= 0.85 }
  ]},
  { name: "Rugpull Fears", desc: "Rumors of devs running off.", outcomes: [
    { msg: "You prove transparency, price rebounds!", eff: game => game.price *= 1.12 },
    { msg: "Panic spreads, big sell-off.", eff: game => game.price *= 0.7 },
    { msg: "Rumors dismissed, no effect.", eff: game => {} }
  ]},
  { name: "Burn Tokens", desc: "Permanently remove supply.", outcomes: [
    { msg: "Burn successful, deflation pumps price!", eff: game => game.price *= 1.13 },
    { msg: "Tiny burn, no effect.", eff: game => {} },
    { msg: "Community unimpressed. Dips a bit.", eff: game => game.price *= 0.96 }
  ]},
  { name: "Exchange Listing", desc: "Get listed on exchange.", outcomes: [
    { msg: "Listing blows up! Huge volume surge.", eff: game => game.price *= 1.25 },
    { msg: "Mediocre debut, no effect.", eff: game => {} },
    { msg: "Technical bugs, listing yanked!
Price plummets.", eff: game => game.price *= 0.8 }
  ]},
  { name: "Hard Fork", desc: "Upgrade blockchain with fork.", outcomes: [
    { msg: "Fork successful! Community bullish.", eff: game => game.price *= 1.14 },
    { msg: "Fork drama, chain split fears.", eff: game => game.price *= 0.91 },
    { msg: "No drama, nothing changes.", eff: game => {} }
  ]}
];

let currentActions = [];
let actionCount = 0;
let actionCooldown = false;
let actionTimeLeft = 0;
let actionTimerInterval = null;

function shuffleCryptoActions() {
  const poolCopy = [...cryptoActionsPool];
  let sel = [];
  for (let i = 0; i < 2; i++) {
    const idx = Math.floor(Math.random() * poolCopy.length);
    sel.push(poolCopy[idx]);
    poolCopy.splice(idx, 1);
  }
  currentActions = sel;
}

function updateCryptoActions() {
  if (!yourCrypto) return;
  let str = "";
  if (actionCooldown) {
    str = `<span style='color:#fa4; font-weight:bold'>You must wait ${actionTimeLeft}s for your next actions…</span>`;
  } else {
    str = currentActions.map((a, i) => 
      `<button class="bubble-btn" onclick="doAction(${i})" title="${a.desc}" ${actionCount >= 2 ? 'disabled' : ''}>${a.name}</button>`
    ).join(' ');
    if (actionCount < 2) str += `<span style='color:#7fc97f; margin-left:10px'>Actions left: ${2 - actionCount}</span>`;
  }
  document.getElementById('crypto-actions').innerHTML = str;
}

window.doAction = function(idx) {
  if (!yourCrypto || actionCooldown || actionCount >=2 ) return;
  const act = currentActions[idx];
  const outcome = act.outcomes[Math.floor(Math.random()*act.outcomes.length)];
  outcome.eff(yourCrypto);
  padHistory(yourCrypto);
  logEvent(`<b>You (${yourCrypto.name})</b>: ${outcome.msg}`, "crypto");
  document.getElementById('crypto-outcome').innerHTML = outcome.msg;
  actionCount++;
  render();
  updateChart();
  if (actionCount >= 2) {
    startActionCooldown();
  }
}
function startActionCooldown() {
  actionCooldown = true;
  actionTimeLeft = 60;
  updateCryptoActions();
  if (actionTimerInterval) clearInterval(actionTimerInterval);
  actionTimerInterval = setInterval(() => {
    actionTimeLeft--;
    updateCryptoActions();
    if (actionTimeLeft <= 0) {
      actionCooldown = false;
      actionCount = 0;
      shuffleCryptoActions();
      updateCryptoActions();
      document.getElementById('crypto-outcome').innerHTML = '';
      clearInterval(actionTimerInterval);
    }
  }, 1000);
}
function initCryptoActions() {
  shuffleCryptoActions();
  actionCount = 0;
  actionCooldown = false;
  actionTimeLeft = 0;
}

// ====== CRYPTO PRICE SIMULATION ======
function updateCryptos() {
  cryptos.concat(yourCrypto ?? []).forEach(token => {
    if (!token) return;
    let base = (Math.random() - 0.49) * (token.price * 0.03);
    base += (token.price * 0.0008) * ((token.history?.[token.history.length-1] ?? token.price) - token.price)/token.price;
    token.price = Math.max(0.01, token.price + base);
    token.history.push(token.price);
    padHistory(token);
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
  document.getElementById('cryptos').innerHTML = 
    cryptos.concat(yourCrypto ?? []).map(token => `
      <div class="crypto-card" style="border-left:5px solid ${token.color || '#F7931A'}">
        <span>
          <b style="cursor:pointer; color:${token.color || '#F7931A'};" title="Show on graph" onclick="viewSymbol('${token.symbol || 'YOU'}')">
            ${token.name || token.symbol}
          </b>
          : $${token.price.toFixed(2)}
        </span>
        <span>
          <button onclick="buy('${token.symbol || "YOU"}')">Buy</button>
          <button onclick="sell('${token.symbol || "YOU"}')">Sell</button>
          <span class="held">Held: ${token.held}</span>
        </span>
      </div>
    `).join('');

  renderPortfolio();

  if (yourCrypto) {
    document.getElementById('yourCryptoName').textContent = yourCrypto.name;
    document.getElementById('yourCryptoPrice').textContent = yourCrypto.price.toFixed(2);
    document.getElementById('yourCryptoDesc').textContent = yourCrypto.desc;
    if (!yourCrypto.chart) {
      const ownCtx = document.getElementById('yourCryptoChart').getContext('2d');
      yourCrypto.chart = new Chart(ownCtx, {
        type: 'line',
        data: { labels: Array(historyLength).fill(''), datasets: [{
          label: yourCrypto.name,
          data: yourCrypto.history,
          borderColor: yourCrypto.color,
          backgroundColor: yourCrypto.color + "44",
          tension: 0.2,
          pointRadius: 0
        }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { grid: { color: "#222C40" } } } }
      });
    }
    yourCrypto.chart.data.datasets[0].data = yourCrypto.history;
    yourCrypto.chart.update();
  }
  document.getElementById('new-crypto-form').style.display = yourCrypto ? "none" : "";
  document.getElementById('crypto-info').style.display = yourCrypto ? "" : "none";
  if (yourCrypto) updateCryptoActions();
}
window.render = render;

// ====== TAB HANDLING & CHARTING ======
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
  } else if (tab === 'crypto') {
    document.querySelector('.tablink:nth-child(3)').classList.add('active');
    document.getElementById('crypto-tab').classList.add('active');
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
const ctx = document.getElementById('cryptoChart').getContext('2d');
const mainChart = new Chart(ctx, {
  type: 'line',
  data: { labels: Array(historyLength).fill(''), datasets: [{ label: '', data: [], borderColor: "", backgroundColor: "", tension: 0.2, pointRadius: 0 }] },
  options: { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { grid: { color: "#222C40" } } } }
});
let chartSymbol = cryptos[0].symbol;

function updateChart() {
  let cur = getCryptoBySymbol(chartSymbol);
  if (!cur) return;
  padHistory(cur);
  mainChart.data.datasets[0].data = cur.history;
  mainChart.data.datasets[0].label = cur.name || cur.symbol;
  mainChart.data.datasets[0].borderColor = cur.color || "#F7931A";
  mainChart.update();
}

// ====== CRYPTO TICKS ======
setInterval(updateCryptos, 1200);
setInterval(randomMarketEvent, 15000);

// ====== INITIALIZE GAME ======
render();
updateChart();
