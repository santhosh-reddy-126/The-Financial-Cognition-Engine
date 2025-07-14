import "./HomePage.css";

const dummyAccounts = [
  { name: "Checking", balance: 3200.50, currency: "$", color: "#1976d2" },
  { name: "Savings", balance: 8200.00, currency: "$", color: "#42a5f5" },
  { name: "Investments", balance: 15250.75, currency: "$", color: "#0d47a1" },
];

const dummySummary = {
  income: 4200,
  expenses: 2900,
  savings: 1300,
};

const dummyTransactions = [
  { date: "2025-07-13", desc: "Salary", category: "Income", amount: 4000, type: "in" },
  { date: "2025-07-12", desc: "Groceries", category: "Food", amount: -120, type: "out" },
  { date: "2025-07-12", desc: "Electricity Bill", category: "Utilities", amount: -60, type: "out" },
  { date: "2025-07-11", desc: "Coffee", category: "Food", amount: -6, type: "out" },
  { date: "2025-07-10", desc: "Stocks", category: "Investments", amount: -300, type: "out" },
];

const dummyCategories = [
  { category: "Food", value: 350, color: "#42a5f5" },
  { category: "Utilities", value: 180, color: "#1976d2" },
  { category: "Transport", value: 120, color: "#90caf9" },
  { category: "Entertainment", value: 100, color: "#0d47a1" },
  { category: "Other", value: 60, color: "#ffd600" },
];

export default function HomePage({ user, onLogout }) {
  // Pie chart as SVG
  const total = dummyCategories.reduce((sum, cat) => sum + cat.value, 0);
  let startAngle = 0;
  const pieSlices = dummyCategories.map((cat, i) => {
    const angle = (cat.value / total) * 360;
    const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
    const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
    const x2 = 50 + 50 * Math.cos((Math.PI * (startAngle + angle)) / 180);
    const y2 = 50 + 50 * Math.sin((Math.PI * (startAngle + angle)) / 180);
    const largeArc = angle > 180 ? 1 : 0;
    const pathData = `
      M 50 50
      L ${x1} ${y1}
      A 50 50 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;
    startAngle += angle;
    return <path key={cat.category} d={pathData} fill={cat.color} />;
  });

  return (
    <div className="dashboard-bg">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <h1>
              <span role="img" aria-label="wave">👋</span> Welcome, {user.email}!
            </h1>
            <p className="dashboard-subtitle">Your Personal Finance Dashboard</p>
          </div>
          <button className="dashboard-logout" onClick={onLogout}>
            Logout
          </button>
        </header>

        {/* Account Balances */}
        <section className="dashboard-cards">
          {dummyAccounts.map((acc) => (
            <div className="dashboard-card account-card" key={acc.name} style={{ borderLeft: `6px solid ${acc.color}` }}>
              <div className="account-name">{acc.name}</div>
              <div className="account-balance">{acc.currency}{acc.balance.toLocaleString()}</div>
            </div>
          ))}
        </section>

        {/* Income/Expenses/Savings Summary */}
        <section className="dashboard-summary">
          <div className="dashboard-summary-item">
            <div className="summary-label">Income</div>
            <div className="summary-value income">${dummySummary.income.toLocaleString()}</div>
          </div>
          <div className="dashboard-summary-item">
            <div className="summary-label">Expenses</div>
            <div className="summary-value expenses">${dummySummary.expenses.toLocaleString()}</div>
          </div>
          <div className="dashboard-summary-item">
            <div className="summary-label">Savings</div>
            <div className="summary-value savings">${dummySummary.savings.toLocaleString()}</div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="dashboard-actions">
          <button className="action-btn">+ Add Transaction</button>
          <button className="action-btn">Transfer</button>
          <button className="action-btn">Export</button>
        </section>

        {/* Main Content: Transactions and Pie Chart */}
        <section className="dashboard-main">
          {/* Recent Transactions Table */}
          <div className="dashboard-table-section">
            <h3>Recent Transactions</h3>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {dummyTransactions.map((tx, idx) => (
                  <tr key={idx}>
                    <td>{tx.date}</td>
                    <td>{tx.desc}</td>
                    <td>{tx.category}</td>
                    <td className={tx.amount < 0 ? "neg" : "pos"}>
                      {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Spending by Category Pie Chart */}
          <div className="dashboard-pie-section">
            <h3>Spending by Category</h3>
            <svg viewBox="0 0 100 100" width={140} height={140}>
              {pieSlices}
            </svg>
            <ul className="pie-legend">
              {dummyCategories.map((cat) => (
                <li key={cat.category}>
                  <span style={{ background: cat.color }} className="pie-dot"></span>
                  {cat.category}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
