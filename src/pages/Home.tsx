import React, { useState, useEffect } from "react";
import Navbar from "../component/nav";
import laptop1Image from "../assets/images/laptop1.jpeg";
import laptop2Image from "../assets/images/laptop2.jpeg";
import laptop3Image from "../assets/images/laptop3.jpeg";
import shoe1Image from "../assets/images/sheo1.jpeg";
import shoe2Image from "../assets/images/sheo2.jpeg";
import Cart from "./Cart";

const Home: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [dataCart, setDataCart] = useState<any[]>(cartData); // Data to display products

  useEffect(() => {
    // Update localStorage when cartItems change
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const handleAddToCart = (item: any) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      alert("Item already in cart");
    } else {
      const newCartItems = [...cartItems, item];
      setCartItems(newCartItems);
      alert("Item added to cart");
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    }
  };

  const handleConnectToBalance = () => {
    console.log("Connect to MyBalance clicked");
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-[70%] mx-auto mt-8">
        <h1 className="text-2xl font-semibold mb-4">Cart Items</h1>
        <div className="grid grid-cols-3 gap-4">
          {dataCart.map((item) => (
            <div
              key={item.id}
              className="border p-4 shadow-md bg-slate-200 rounded-lg"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-[250px] mb-2 rounded-lg"
              />
              <div className="text-lg font-semibold">{item.name}</div>
              <div className="text-gray-600">${item.price}</div>
              <button
                onClick={() => handleAddToCart(item)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center mt-8 bg-slate-800 p-[4rem] mb-[4rem] rounded-lg">
          <button
            onClick={handleConnectToBalance}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Connect to MyBalance
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

const cartData = [
  { id: 1, name: "Laptop 1", image: laptop1Image, price: 10 },
  { id: 2, name: "Laptop 2", image: laptop2Image, price: 15 },
  { id: 3, name: "Laptop 3", image: laptop3Image, price: 20 },
  { id: 4, name: "Shoe 1", image: shoe1Image, price: 25 },
  { id: 5, name: "Shoe 2", image: shoe2Image, price: 30 },
  { id: 6, name: "Shoe 3", image: shoe1Image, price: 35 },
];
