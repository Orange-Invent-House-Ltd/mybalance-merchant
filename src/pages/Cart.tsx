import React, { useState, useEffect } from "react";
import Navbar from "../component/nav";
import useStore from "../store";
import { publicApi } from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Cart: React.FC<any> = () => {
  const email = localStorage.getItem('email')
  const API_KEY = import.meta.env.VITE_API_KEY
  const [paymentLink, setPaymentLink] = useState('')
  const today  = moment().format("YYYY-MM-DD");
  const tomorrow = moment().add(1, 'days').format("YYYY-MM-DD");
  const store = useStore()

  const cart = store?.cartItems;
  const navigate = useNavigate()

  const getTotalPrice = () => {
    return cart.reduce((total:any, item:any) => total + item.amount, 0);
  };

  const handlePayNow = () => {
    // Implement pay now logic here
  };

  function groupItemsBySeller() {
    // Create the result object with buyer's email and an empty entities array
    const result:any = {
        buyer: email,
        entities: [],
        redirectUrl: 'http://localhost:5173/home',
        deliveryDate: tomorrow,
    };

    // Create a map to track the index of each seller in the entities array
    const sellerMap:any = {};

    // Loop through each item in the input array
    cart.forEach((item:any)=> {
      const seller = item.seller;
      // Check if the seller is already in the sellerMap
      if (!sellerMap[seller]) {
          // If seller is not in the map, get the new index for this seller
          const sellerIndex = result.entities.length;

          // Add the seller to the sellerMap with the current index
          sellerMap[seller] = sellerIndex;

          // Add a new object to the entities array with the seller's email and a new items array
          result.entities.push({
              seller: seller,
              items: [item]
          });
      } else {
          // If the seller is already in the map, get the existing index
          const sellerIndex = sellerMap[seller];

          // Push the current item to the existing items array for this seller
          result.entities[sellerIndex].items.push(item);
      }
    });

    // Return the result object with the grouped items
    return result;
}

  const handlePayWithBalance  = async () => {
   const transactions = groupItemsBySeller()
    try {
      const res = await publicApi.post("/merchants/initiate-escrow", 
        transactions, 
        {
          headers: {
            'Authorization': API_KEY,
          }
        },
      );
      store.setPaymentBreakdown(res.data.data.paymentBreakdown)
      store.setPayModal(true)
      setPaymentLink(res.data.data.link)
      toast.success(res.data.message,{
        toastId: 'success1'
      });
      
    } catch (error: any) {
        let resMessage;
        error.response.data.errors === null ? resMessage = error.response.data.message : 
        resMessage = error.response.data.errors.error
        toast.error(resMessage);
    }
  };

  // const handlePayWithBalance = () => {
  //   mutate({
  //     purpose: 'Test',
  //     itemType: 'Cart Items',
  //     itemQuantity: cart?.length,
  //     deliveryDate: today,
  //     amount: getTotalPrice(),
  //     buyer: 'devtosxn@gmail.com',
  //     seller: 'tosxnthedesigner@gmail.com',
  //   })
  // };

  return (
    <div>
      <Navbar />
      <div className="max-w-[70%] mx-auto mt-8">
        <h1 className="text-2xl font-semibold mb-4">Cart</h1>
        {cart.map((item:any) => (
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
                <div className="text-gray-600">amount: ₦{item.amount/item?.itemQuantity}</div>
              </div>
            </div>
            <div>
              <div>Quantity: {item?.itemQuantity}</div>{" "}
              {/* You can replace '1' with dynamic quantity */}
              <div>Total: ₦{item.amount * 1}</div>{" "}
              {/* You can replace '1' with dynamic quantity */}
            </div>
          </div>
        ))}
        <div className="mt-5 bg-slate-300 w-50 p-5 rounded-2xl mb-[5rem]">
          <div className="text-xl font-semibold mt-4">
            Total amount: ₦{getTotalPrice()}
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
      {/* Payment breakdown */}
      {store.payModal && (
        <div className="animate-jump fixed top-0 bottom-0 left-0 right-0 z-50 w-full h-full bg-[#3a3a3a]/30 backdrop-blur-[8px] py-8">
        <div className="w-[350px] md:w-[400px] py-6 px-6 min-h-[246px] rounded absolute bg-white backdrop-blur-xl top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 no-scrollbar">
          <h2 className="text-lg font-medium mb-2">
            Pay with MyBalance
          </h2>
          <p className="mt-1">Please confirm your payment detail below</p>

          <p className="mt-6">Cost of items: ₦{store.paymentBreakdown?.baseAmount}</p>
          <p>Escrow Fees: ₦{parseFloat(Number(store.paymentBreakdown?.buyerEscrowFees).toFixed(3))}</p>
          <p>Mercant Fees: ₦{store.paymentBreakdown?.buyerMerchantFees}</p>
          <p className="font-semibold">Total Payable: ₦{store.paymentBreakdown?.totalPayable}</p>
          <div className="flex items-center gap-x-4 mt-6">
            <button className="border border-orange-500 px-4 py-2 rounded hover:text-white  hover:bg-orange-600"
              onClick={()=> store.setPayModal(false)}
            >
              Cancel
            </button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 "
              onClick={()=>{
                window.open(paymentLink)
                store.setPayModal(false)
              }}
            >
              Continue
            </button>
          </div>
        </div>
        </div>
      )}
      <div className="px-[5%]">
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
    </div>
  );
};

export default Cart;
