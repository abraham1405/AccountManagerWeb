import axios from 'axios';

const apiAuth = axios.create({
  baseURL: 'https://localhost:44381/AuthManagerAPI', 
  headers: {
    'Content-Type': 'application/json',
  },
});
const apiManager = axios.create({
  baseURL: 'https://localhost:44381/ManagerAPI', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export { apiAuth, apiManager };