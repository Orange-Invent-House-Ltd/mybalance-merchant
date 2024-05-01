import React, { useState, useEffect } from "react";
import Navbar from "../component/nav";

const Cart: React.FC<any> = () => {
  const [cart, setCart] = useState<
    { id: number; name: string; image: string; price: number }[]
  >([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handlePayNow = () => {
    // Implement pay now logic here
  };

  const handlePayWithBalance = () => {
    // Implement pay with balance logic here
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-[70%] mx-auto mt-8">
        <h1 className="text-2xl font-semibold mb-4">Cart</h1>
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border p-4 mb-4 bg-slate-100 rounded-2xl shadow-md"
          >
            <div className="flex items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover mr-4 rounded-xl"
              />
              <div>
                <div className="text-lg font-semibold">{item.name}</div>
                <div className="text-gray-600">Price: ${item.price}</div>
              </div>
            </div>
            <div>
              <div>Quantity: 1</div>{" "}
              {/* You can replace '1' with dynamic quantity */}
              <div>Total: ${item.price * 1}</div>{" "}
              {/* You can replace '1' with dynamic quantity */}
            </div>
          </div>
        ))}
        <div className="mt-5 bg-slate-300 w-50 p-5 rounded-2xl mb-[5rem]">
          <div className="text-xl font-semibold mt-4">
            Total Price: ${getTotalPrice()}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handlePayNow}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-4 hover:bg-blue-600"
            >
              Pay Now
            </button>
            <button
              onClick={handlePayWithBalance}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 "
            >
              Pay with MyBalance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
