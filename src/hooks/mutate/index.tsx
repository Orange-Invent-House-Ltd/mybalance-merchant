import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
import { generateWidget, initiateEscrow, login } from "../../api";
import useStore from "../../store";

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore()
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("session_token", data.data.token);
      localStorage.setItem("merchantId", data.data.merchant);
      store.setUser(data.data.user);
      toast.success(data.message);
      if (data.data.user.isBuyer) {
        localStorage.setItem("userType", "buyer");
      }
      if (data.data.user.isSeller) {
        localStorage.setItem("userType", "seller");
      }
      if (location.state?.from) {
        navigate(location.state.from);
        return;
      }
      if(data?.data?.phoneNumberFlagged){
        navigate("/change-phone-number");
      }else{
        navigate("/home");
      }
    },
    onError: (error: any) => {
      let resMessage;
      error.response.data.errors === null ? resMessage = error.response.data.message : 
      resMessage = error.response.data.errors.email[0]
      toast.error(resMessage);
    },
  });
};

export const useGenerateWidget = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore()
  return useMutation({
    mutationFn: generateWidget,
    onSuccess: (data) => {
      const url = data.data.url
      const startString = "unlock-fund/";
      // Find the index of the starting string
      const startIndex = url.indexOf(startString);
      // Calculate the start of the substring (position after "unlock-fund/")
      const extractStartIndex = startIndex + startString.length;
      // Extract the substring from the calculated start index to the end of the URL
      const extractedValue = url.substring(extractStartIndex);
      localStorage.setItem("key", extractedValue);
      localStorage.setItem("url", data.data.url);
      toast.success(data.message);
    },
    onError: (error: any) => {
      let resMessage;
      error.response.data.errors === null ? resMessage = error.response.data.message : 
      resMessage = error.response.data.errors.error
      toast.error(resMessage);
    },
  });
};

export const useInitialEscrow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore()
  return useMutation({
    mutationFn: initiateEscrow,
    onSuccess: (data) => {
      store.setPaymentBreakdown(data.data.paymentBreakdown)
      store.setPayModal(true)
      store.setPaymentLink(data.data.link);
      toast.success(data.message);
    },
    onError: (error: any) => {
      let resMessage;
      error.response.data.errors === null ? resMessage = error.response.data.message : 
      resMessage = error.response.data.errors.error || error.response.data.errors.buyer[0]
      toast.error(resMessage);
    },
  });
};