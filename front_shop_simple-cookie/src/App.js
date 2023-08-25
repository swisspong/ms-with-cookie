import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableCart from "./components/TableCart";
import TableOrder from "./components/TableOrder";
import TableProduct from "./components/TableProduct";
import { shoppingRequest } from "./lib";


function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchOrdersHandler = (cb) => {
    return shoppingRequest
      .get("/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        cb(data);
        return data;
      });
  };

  useEffect(() => {
    fetchOrdersHandler(setOrders);
  }, []);

  const notify = (msg) => {
    toast.success(`🦄 ${msg}!`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  return (
    <>
      <div className="grid grid-cols-2 gap-4 h-screen">
        <div className="h-full w-full">
          <TableProduct />
        </div>
        <div className="h-full w-full">
          <TableCart
            notify={notify}
            setLoading={setLoading}
            fetchOrdersHandler={() => fetchOrdersHandler(setOrders)}
          />
        </div>
        <div className="h-full w-full">
          <TableOrder orders={orders} loading={loading}/>
        </div>

        <div>
         
        </div>
        <div>
          <button
            onClick={notify}
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded ml-2 mb-2"
          >
            Notify
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
