import axios from "axios";
import React, { useEffect, useState } from "react";
import { customerRequest, shoppingRequest } from "../lib";
const LoginForm = () => {
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    console.log(credential);
  }, [credential]);
  const onChangeHandler = (event) => {
    setCredential((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const submitHandler = () => {
    console.log(credential);
    customerRequest
      .post("/signin", credential)
      .then((response) => response.data)
      .then((data) => {
        // localStorage.setItem("token", data.token);
      });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 px-2">
        <div className="mb-2">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username"
          >
            Email
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="email"
            type="text"
            placeholder="Email"
            onChange={onChangeHandler}
            value={credential.email}
          ></input>
        </div>
        <div className="mb-2">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username"
          >
            Password
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            onChange={onChangeHandler}
            value={credential.password}
          ></input>
        </div>
      </div>
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded ml-2 mb-2"
        onClick={submitHandler}
      >
        Signin
      </button>
      <p class="truncate">{localStorage.getItem("token")}</p>
      <div></div>
    </div>
  );
};
const TableCart = ({ notify, fetchOrdersHandler, setLoading }) => {
  const [cart, setCart] = useState(null);
  const getCart = () => {
    console.log(localStorage.getItem("token"));
    shoppingRequest
      .get("/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setCart(data);
      });
  };
  const placeOrderHandler = () => {
    setLoading(true);
    shoppingRequest
      .post(
        "/order",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        notify("Order Created");

        const interval = setInterval(() => {
          fetchOrdersHandler().then((result) => {
            const existingOrder = result.find((res) => res._id === data._id);
            if (existingOrder.status === "received") {
              clearInterval(interval);
              setLoading(false);
              notify("Order received");
            }
          });
        }, 1000);
      });
  };
  return (
    <div>
      <h5>Cart</h5>
      <LoginForm />

      <table className="w-full border-separate border-spacing-2 border border-slate-400 ">
        <thead className="w-full">
          <tr className="">
            <th className=" border border-slate-300 ">ITEM</th>
            <th className=" border border-slate-300 ">UNIT</th>
            <th className=" border border-slate-300 ">PRICE</th>
          </tr>
        </thead>
        <tbody>
          {cart?.items?.map((item) => (
            <tr key={item._id}>
              <td className="border border-slate-300">{item.product.name}</td>
              <td className="border border-slate-300">{item.unit}</td>
              <td className="border border-slate-300">{item.product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded ml-2 my-2"
        onClick={getCart}
      >
        Fetch Cart
      </button>
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded ml-2 my-2"
        onClick={placeOrderHandler}
      >
        Placeorder
      </button>
    </div>
  );
};

export default TableCart;
