// ---- Stock Data, Portfolio, and Initial Cash ----
const stocks = [
  { symbol: "AAPL", price: 200, held: 0 },
  { symbol: "GOOG", price: 1500, held: 0 },
  { symbol: "AMZN", price: 3500, held: 0 },
  { symbol: "TSLA", price: 900, held: 0 }
];

let cash = 10000; // Starting money

// ---- Real-Time Price Logic ----
function updateStocks() {
  stocks.forEach(stock => {
    // Price fluctuates randomly within a small range
    const change = (Math.random() - 0.5) * (stock.price * 0.02);
    stock.price = Math.max(1, stock.price + change);
  });
  render(); // UI update after every change
}

// ---- Rendering logic ----
function render() {
  // Render stocks market
  document.getElementById('stocks').innerHTML = stocks.map(stock => `
    <div class="stock-card">
      <span><b>${stock.symbol}</b> : $${stock.price.toFixed(2)}</span>
      <span>
        <button onclick="buy('${stock.symbol}')">Buy</button>
        <button onclick="sell('${stock.symbol}')">Sell</button>
        <span class="held">Held: ${stock.held}</span>
      </span>
    </div>
  `).join('');

  // Render portfolio
  document.getElementById('portfolio').innerHTML = `
    <div><strong>Cash:</strong> $${cash.toFixed(2)}</div>
    <div><strong>Holdings:</strong>
      <ul>
        ${stocks.filter(s => s.held > 0).length === 0
          ? '<li>No stocks owned yet.</li>'
          : stocks.filter(s => s.held > 0).map(stock =>
              `<li>${stock.symbol}: ${stock.held} shares ($${(stock.held * stock.price).toFixed(2)})</li>`).join('')}
      </ul>
    </div>
    <div><strong>Portfolio Value:</strong> $${getPortfolioValue().toFixed(2)}</div>
  `;
}

function getPortfolioValue() {
  let value = cash;
  stocks.forEach(stock => {
    value += stock.held * stock.price;
  });
  return value;
}

// ---- Buy/Sell Actions ----
window.buy = function(symbol) {
  const stock = stocks.find(s => s.symbol === symbol);
  if (cash >= stock.price) {
    stock.held += 1;
    cash -= stock.price;
    render();
  } else {
    alert("Not enough cash!");
  }
}

window.sell = function(symbol) {
  const stock = stocks.find(s => s.symbol === symbol);
  if (stock.held > 0) {
    stock.held -= 1;
    cash += stock.price;
    render();
  }
}

// ---- Tab Switching Logic ----
window.showTab = function(tab) {
  // Remove 'active' from all tab buttons
  document.querySelectorAll('.tablink').forEach(btn => btn.classList.remove('active'));
  // Hide all tab-panes
  document.querySelectorAll('.tab-pane').forEach(tabPane => tabPane.classList.remove('active'));
  // Activate the chosen tab
  if (tab === 'market') {
    document.querySelector('.tablink:nth-child(1)').classList.add('active');
    document.getElementById('market-tab').classList.add('active');
  } else if (tab === 'portfolio') {
    document.querySelector('.tablink:nth-child(2)').classList.add('active');
    document.getElementById('portfolio-tab').classList.add('active');
  }
}

// ---- App Startup ----
setInterval(updateStocks, 1250); // update every 1.25 seconds
render();
