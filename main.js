// --- Data setup ---
const stocks = [
  { symbol: "AAPL", price: 200, held: 0 },
  { symbol: "GOOG", price: 1500, held: 0 },
];

let cash = 10000; // Starting money for the player

// --- Price update logic ---
function updateStocks() {
  stocks.forEach(stock => {
    // Price fluctuates randomly by -5 to +5
    const change = (Math.random() - 0.5) * 10;
    stock.price = Math.max(1, stock.price + change);
  });
  render();
}

// --- Rendering logic ---
function render() {
  document.getElementById('stocks').innerHTML = stocks.map(stock => `
    <div class="stock-card">
      <strong>${stock.symbol}</strong> : $${stock.price.toFixed(2)}
      <button onclick="buy('${stock.symbol}')">Buy</button>
      <button onclick="sell('${stock.symbol}')">Sell</button>
      <span>Held: ${stock.held}</span>
    </div>
  `).join('');

  document.getElementById('portfolio').innerHTML = `
    <div>
      <strong>Cash:</strong> $${cash.toFixed(2)}
    </div>
    <div>
      <strong>Stock Holdings:</strong>
      <ul>
        ${stocks.map(stock => `<li>${stock.symbol}: ${stock.held} shares ($${(stock.held * stock.price).toFixed(2)})</li>`).join('')}
      </ul>
    </div>
  `;
}

// --- Actions ---
function buy(symbol) {
  const stock = stocks.find(s => s.symbol === symbol);
  if (cash >= stock.price) {
    stock.held += 1;
    cash -= stock.price;
    render();
  } else {
    alert("Not enough cash!");
  }
}

function sell(symbol) {
  const stock = stocks.find(s => s.symbol === symbol);
  if (stock.held > 0) {
    stock.held -= 1;
    cash += stock.price;
    render();
  }
}

// --- Start real-time trading! ---
setInterval(updateStocks, 1000);
render();
