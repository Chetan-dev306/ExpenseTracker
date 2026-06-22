import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

function Dashboard() {
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dashboardRes = await API.get("/dashboard");
      setData(dashboardRes.data);

      const transactionRes = await API.get("/transactions");
      setTransactions(transactionRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTransaction = async (e) => {
    e.preventDefault();

    try {
      await API.post("/transactions", {
        title,
        amount: Number(amount),
        type,
        category,
      });

      alert("Transaction Added");

      setTitle("");
      setAmount("");
      setType("income");
      setCategory("");

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);

      alert("Transaction Deleted");

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const chartData = [
    {
      name: "Income",
      value: data?.totalIncome || 0,
    },
    {
      name: "Expense",
      value: data?.totalExpense || 0,
    },
  ];

  const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};


  return (
    <div className="min-h-screen bg-gray-100 p-8">
     <div className="flex justify-between items-center mb-8">
  <h1 className="text-4xl font-bold">
    Expense Tracker Dashboard
  </h1>

  <button
    onClick={logout}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" >
    Logout
  </button>
  
</div>

      {/* Add Transaction Form */}
      <h2 className="text-2xl font-bold mb-4">
        Add Transaction
      </h2>

      <form
        onSubmit={addTransaction}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <br />
        <br />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <br />
        <br />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <br />
        <br />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </form>

      {/* Analytics Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Income</h3>
            <p className="text-2xl font-bold">
              ₹{data.totalIncome}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Expense</h3>
            <p className="text-2xl font-bold">
              ₹{data.totalExpense}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Balance</h3>
            <p className="text-2xl font-bold">
              ₹{data.balance}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Transactions</h3>
            <p className="text-2xl font-bold">
              {data.totalTransactions}
            </p>
          </div>
        </div>
      )}

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Income vs Expense
        </h2>

        <PieChart width={400} height={300}>
          <Pie
            data={chartData}
            dataKey="value"
            outerRadius={100}
            label
          >
            <Cell fill="#22c55e" />
            <Cell fill="#ef4444" />
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Transaction History */}
      <h2 className="text-2xl font-bold mb-4">
        Transaction History
      </h2>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        transactions.map((t) => (
          <div
            key={t._id}
            className="bg-white p-4 rounded-xl shadow mb-4"
          >
            <h3 className="text-lg font-semibold">
              {t.title}
            </h3>

            <p>Amount: ₹{t.amount}</p>
            <p>Type: {t.type}</p>
            <p>Category: {t.category}</p>

            <button
              onClick={() =>
                deleteTransaction(t._id)
              }
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-2"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;