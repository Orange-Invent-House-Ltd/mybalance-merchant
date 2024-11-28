import React, { useState, useEffect} from "react";
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
import { useNavigate } from "react-router-dom";
import moment from "moment";
const today = moment().format("YYYY-MM-DD");

const Home: React.FC = () => {
  const {mutate} = useGenerateWidget()
  // const [cartItems, setCartItems] = useState<any[]>([]);
  const [dataCart, setDataCart] = useState<any[]>(cartData); // Data to display products
  const [widget, setWidget] = useState(false)
  const store = useStore()
  const [url, setUrl] = useState('')
  const API_KEY = import.meta.env.VITE_API_KEY
  const navigate = useNavigate()
  // const today = moment().format("YYYY-MM-DD");

  const handleAddToCart = (item: any) => {
    const cartItems = store?.cartItems
    const existingItem = cartItems.find((cartItem:any) => cartItem.id === item.id);
    const nonExistItems = cartItems.filter((cartItem:any) => cartItem.id !== item.id);
    if (existingItem) {
      const newCartItems = [...nonExistItems, {...existingItem, itemQuantity: existingItem?.itemQuantity + 1, amount: existingItem?.amount + item?.amount}];
      // localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      store.setCartItems(newCartItems)
      alert("extra quantity added");
    } else {
      const newCartItems = [...cartItems, {...item, itemQuantity: 1}];
      // setCartItems(newCartItems);
      store.setCartItems(newCartItems)
      alert("Item added to cart");
      // localStorage.setItem("cartItems", JSON.stringify(newCartItems));
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

  // useEffect(() => {
  //   // Update localStorage when cartItems change
  //   const storedCart = localStorage.getItem("cartItems");
  //   if (storedCart) {
  //     setCartItems(JSON.parse(storedCart));
  //   }
  // }, []);


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
                alt={item.title}
                className="w-full h-[250px] mb-2 rounded-lg"
              />
              <div className="text-lg font-semibold">{item.title}</div>
              <p>{item?.description}</p>
              <div className="text-gray-600">₦{item.amount}</div>
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
        <button
          onClick={()=> {
            localStorage.clear()
            navigate('/')
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-8"
        >
          logout
        </button>
        
      </div>
      {/* <div className="animate-jump fixed top-0 bottom-0 left-0 right-0 z-50 w-full h-full bg-[#3a3a3a]/30 backdrop-blur-[8px] py-8">
        <div className="max-w-[800px] mx-auto py-4 rounded-[16px] h-[100%] bg-white z-50 overflow-y-scroll no-scrollbar"></div></div> */}
      {widget && (
        <div className="flex justify-center animate-jump fixed top-0 bottom-0 left-0 right-0 z-50 w-full h-full bg-[#3a3a3a]/30 backdrop-blur-[8px] py-8">
        <div className='relative mt-6'>
          <button className=" bg-white h-10 absolute z-50 -top-10 -right-10 text-gray-500 hover:text-gray-700 cursor-pointer w-10 justify-center items-center mx-auto flex rounded-full"
            onClick={()=> setWidget(!widget)} 
          >
            <X className='text-primary-normal' />
          </button>
          <div className="w-[350px] sm:w-[700px] md:w-[900px] h-[100%] mx-auto rounded-[16px] bg-white z-50 overflow-y-scroll">
            <iframe 
              src={url} frameBorder="0" seamless={true}
              width={'100%'}
              height={'100%'}
            ></iframe>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

const cartData = [
  { id: 1, title: "Laptop 1", description: 'Hp corei7', image: laptop1Image, amount: 550, category: "SERVICE", deliveryDate:today, seller: 'jamiuaremu579@gmail.com'},
  { id: 2, title: "Laptop 2", description: 'Hp corei5', image: laptop2Image, amount: 605, category: "SERVICE", deliveryDate:today, seller: 'jamiuaremu579@gmail.com'},
  { id: 3, title: "Laptop 3", description: 'Dell 850', image: laptop3Image, amount: 520, category: "SERVICE", deliveryDate:today, seller: 'jamiuaremu579@gmail.com'},
  { id: 4, title: "Shoe 1", description: 'Brown Office shoe', image: shoe1Image, amount: 625, category: "SERVICE", deliveryDate:today, seller:'jamiuaremu579@gmail.com'},
  { id: 5, title: "Shoe 2", description: 'white sneakers', image: shoe2Image, amount: 730, category: "SERVICE", deliveryDate:today, seller: 'jamiuaremu579@gmail.com'},
  { id: 6, title: "Shoe 3", description: 'Brown Office shoe', image: shoe1Image, amount: 535, category: "SERVICE", deliveryDate:today, seller: 'jamiuaremu579@gmail.com'},
  // { id: 7, title: "cloth 2", description: 'white sneakers', image: shoe2Image, amount: 730, category: "SERVICE", deliveryDate:today, seller: 'tosxnthedesigner@gmail.com'},
];

export default Home;