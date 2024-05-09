import React, { useState, useEffect } from "react";
import Navbar from "../component/nav";
import { useInitialEscrow } from "../hooks/mutate";
import moment from 'moment'
import useStore from "../store";
import { publicApi } from "../api/axios";
import { toast } from "react-toastify";

const Cart: React.FC<any> = () => {
  const {mutate, isPending} = useInitialEscrow()
  const email = localStorage.getItem('email')
  const [modal, setModal] = useState(false)
  const API_KEY = import.meta.env.VITE_API_KEY
  const [paymentLink, setPaymentLink] = useState('')
  const [cart, setCart] = useState<
    { id: number; name: string; image: string; price: number }[]
  >([]);
  const today = moment().format("YYYY-MM-DD")
  const store = useStore()

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

  const handlePayWithBalance  = async () => {
    try {
      const res = await publicApi.post("/merchants/initiate-escrow", 
        {
          purpose: 'Test',
          itemType: 'Cart Items',
          itemQuantity: cart?.length,
          deliveryDate: today,
          amount: getTotalPrice(),
          buyer: 'devtosxn@gmail.com',
          seller: 'tosxnthedesigner@gmail.com',
        }, 
        {
          headers: {
            'Authorization': API_KEY,
          }
        }
      );
      store.setPaymentBreakdown(res.data.data.paymentBreakdown)
      store.setPayModal(true)
      setPaymentLink(res.data.data.link)
      window.open(res.data.data.link);
      toast.success(res.data.message);
      
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
                <div className="text-gray-600">Price: ₦{item.price}</div>
              </div>
            </div>
            <div>
              <div>Quantity: 1</div>{" "}
              {/* You can replace '1' with dynamic quantity */}
              <div>Total: ₦{item.price * 1}</div>{" "}
              {/* You can replace '1' with dynamic quantity */}
            </div>
          </div>
        ))}
        <div className="mt-5 bg-slate-300 w-50 p-5 rounded-2xl mb-[5rem]">
          <div className="text-xl font-semibold mt-4">
            Total Price: ₦{getTotalPrice()}
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
          <p>Escrow Fees: ₦{store.paymentBreakdown?.buyerEscrowFees}</p>
          <p>Mercant Fees: ₦{store.paymentBreakdown?.buyerMerchantFees}</p>
          <p className="font-semibold">Total Payable: ₦{store.paymentBreakdown?.totalPayable}</p>
          <div className="flex items-center gap-x-4 mt-6">
            <button className="border border-orange-500 px-4 py-2 rounded hover:text-white  hover:bg-orange-600"
              onClick={()=> store.setPayModal(false)}
            >
              Cancle
            </button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 "
              onClick={()=>window.open(paymentLink)}
            >
              Continue
            </button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
