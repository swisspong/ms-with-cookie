import axios from "axios";

export const customerRequest = axios.create({
  baseURL: "http://localhost/api/customer",
  withCredentials: true,
});
export const productRequest = axios.create({
  baseURL: "http://localhost/api/product",
  withCredentials: true,
});
export const shoppingRequest = axios.create({
  baseURL: "http://localhost/api/shopping",
  withCredentials: true,
});
