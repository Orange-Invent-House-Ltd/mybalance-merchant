import { privateApi, publicApi } from "./axios";
const API_KEY = import.meta.env.VITE_API_KEY

export const login = async (data: any) => {
  const res = await publicApi.post("/auth/login", data);
  return res.data;
};
export const initiateEscrow = async (data: any) => {
  const res = await publicApi.post("/merchants/initiate-escrow", data,
  {
    headers: {
      'Authorization': API_KEY,
    }
  }
  );
  return res.data;
};
export const generateWidget = async (data: any) => {
  const res = await publicApi.post("/merchants/generate-widget-session", data, 
    {
      headers: {
        'Authorization': API_KEY,
      }
    }
  );
  return res.data;
};
