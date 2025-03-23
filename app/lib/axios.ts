import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000", // Uses the backend URL from env
});

export default instance;
