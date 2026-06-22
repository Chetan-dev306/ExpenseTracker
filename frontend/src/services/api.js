import axios from "axios";

const API = axios.create({
  baseURL: "https://expensetracker-backend-teim.onrender.com/api",
});

export default API;