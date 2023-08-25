import React from "react";
import { Loading } from "./Loading";

const TableOrder = ({ orders, loading }) => {
  return (
    <div>
      <h5>Order</h5>
      <table className="w-full border-separate border-spacing-2 border border-slate-400 ">
        <thead className="w-full">
          <tr className="">
            <th className=" border border-slate-300 ">ORDER</th>
            <th className=" border border-slate-300 ">PROCESS ID</th>
            <th className=" border border-slate-300 ">STATUS</th>
            <th className=" border border-slate-300 ">AMOUNT</th>
            {/* <th className=" border border-slate-300 ">ACTIONS</th> */}
          </tr>
        </thead>
        <tbody>
          {!loading && orders.map((order) => (
            <tr key={order._id}>
              <td className="border border-slate-300">{order._id}</td>
              <td className="border border-slate-300">{order?.processId}</td>
              <td className="border border-slate-300">{order.status}</td>
              <td className="border border-slate-300">
                {order.items.reduce((prev, curr) => {
                  return prev + curr.unit;
                }, 0)}
              </td>
              {/* <td className="border border-slate-300">Indianapolis</td> */}
            </tr>
          ))}
        </tbody>
      </table>
      {loading ? <Loading size={50} /> : undefined}
    </div>
  );
};

export default TableOrder;
