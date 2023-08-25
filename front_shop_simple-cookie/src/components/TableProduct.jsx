import axios from "axios";
import React, { useEffect, useState } from "react";
import { productRequest, shoppingRequest } from "../lib";

const TableRow = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [qty, setQty] = useState(0);
  const addToCartHandler = ({ product_id, qty }) => {
    console.log(product_id, qty);
    shoppingRequest.post("/cart", {
      product_id,
      qty,
    });
  };
  return (
    <tr key={product._id}>
      <td className="border border-slate-300">{product.name}</td>
      <td className="border border-slate-300">{product.unit}</td>
      <td className="border border-slate-300">{product.price}</td>
      <td className="border border-slate-300">
        {isAdded ? (
          <div className="grid grid-cols-3 gap-1">
            <input
              className="shadow appearance-none border rounded  py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Qty"
              type="number"
              onChange={(e) => setQty(e.target.value)}
              value={qty}
              placeholder="Qty"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-1 rounded"
              onClick={() => {
                setIsAdded((prevState) => !prevState);
                addToCartHandler({ product_id: product._id, qty });
              }}
            >
              Add To Cart
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white py-1 px-1 rounded"
              onClick={() => setIsAdded((prevState) => !prevState)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-1 rounded"
            onClick={() => setIsAdded((prevState) => !prevState)}
          >
            Add To Cart
          </button>
        )}
      </td>
    </tr>
  );
};
const TableProduct = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    productRequest
      .get("/")
      .then((response) => response.data)
      .then((data) => setProducts(data.products));
  }, []);

  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <div>
      <h5>Product</h5>
      <table className="w-full border-separate border-spacing-2 border border-slate-400 ">
        <thead className="w-full">
          <tr className="">
            <th className=" border border-slate-300 ">ITEM</th>
            <th className=" border border-slate-300 ">UNIT</th>
            <th className=" border border-slate-300 ">PRICE</th>
            <th className=" border border-slate-300 w-4/12">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <TableRow key={product._id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableProduct;
