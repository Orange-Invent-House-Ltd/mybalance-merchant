import React, { useState, useEffect } from "react";
import Navbar from "../component/nav";
import laptop1Image from "../assets/images/laptop1.jpeg";
import laptop2Image from "../assets/images/laptop2.jpeg";
import laptop3Image from "../assets/images/laptop3.jpeg";
import shoe1Image from "../assets/images/sheo1.jpeg";
import shoe2Image from "../assets/images/sheo2.jpeg";
import Cart from "./Cart";
import { useGenerateWidget } from "../hooks/mutate";
import useStore from "../store";
import { publicApi } from "../api/axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const Home: React.FC = () => {
  const {mutate} = useGenerateWidget()
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [dataCart, setDataCart] = useState<any[]>(cartData); // Data to display products
  const [widget, setWidget] = useState(false)
  const store = useStore()
  const [url, setUrl] = useState('')
  const API_KEY = import.meta.env.VITE_API_KEY


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

  // const connectToBalance = async() => {
  //   mutate({
  //     customerEmail: localStorage.getItem('email')
  //   })
  // };

  const connectToBalance  = async () => {
    try {
      const res = await publicApi.post("/merchants/generate-widget-session", 
        {
          customerEmail: localStorage.getItem('email')
        }, 
        {
          headers: {
            'Authorization': API_KEY,
          }
        }
      );
      setUrl(res.data.data.url)
      const url = res.data.data.url
      const startString = "unlock-fund/";
      // Find the index of the starting string
      const startIndex = url.indexOf(startString);
      // Calculate the start of the substring (position after "unlock-fund/")
      const extractStartIndex = startIndex + startString.length;
      // Extract the substring from the calculated start index to the end of the URL
      const extractedValue = url.substring(extractStartIndex);
      localStorage.setItem("key", extractedValue);
      setWidget(true)
      // toast.success(res.data.message, {
      //   toastId: 'success1'
      // });
    } catch (error: any) {
        let resMessage;
        error.response.data.errors === null ? resMessage = error.response.data.message : 
        resMessage = error.response.data.errors.error
        toast.error(resMessage);
    }
  };

  useEffect(() => {
    // Update localStorage when cartItems change
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

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
              <div className="text-gray-600">₦{item.price}</div>
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
            onClick={connectToBalance}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Connect to MyBalance
          </button>
        </div>
      </div>
      {/* <X onClick={()=> setWidget(!widget)} className="w-fit absolute "/> */}
      {widget && (
        <div className="animate-jump fixed top-0 bottom-0 left-0 right-0 z-50 w-full h-full bg-[#3a3a3a]/30 backdrop-blur-[8px] py-8">
        <div className="max-w-[800px] mx-auto py-4 rounded-[16px] h-[100%] bg-white z-50 overflow-y-scroll no-scrollbar">
          <X onClick={()=> setWidget(!widget)} className="ml-auto mr-4 sticky top-0 no-scrollbar"/>
          <iframe src={url} frameBorder="0" width="100%" height='100%' allowFullScreen></iframe>
        </div>
        </div>
      )}
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
