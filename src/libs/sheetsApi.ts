import axios from "axios";
import { getGoogleAuthToken } from "./auth";

const sheetsApi = axios.create({
  baseURL: "https://sheets.googleapis.com/v4/spreadsheets",
  headers: {
    "Content-Type": "application/json"
  }
});

export default sheetsApi;

export const sheetsApiGet = async (url: string, params?: any) => {
  const response = await sheetsApi.get(url, {
    params,
    headers: {
      Authorization: `Bearer ${await getGoogleAuthToken()}`
    }
  });
  return response.data;
};

export const sheetsApiPut = async (url: string, data: any) => {
  const response = await sheetsApi.put(url, data, {
    headers: {
      Authorization: `Bearer ${await getGoogleAuthToken()}`
    }
  });
  return response.data;
};

export const sheetsApiPost = async (url: string, data: any) => {
  const response = await sheetsApi.post(url, data, {
    headers: {
      Authorization: `Bearer ${await getGoogleAuthToken()}`
    }
  });
  return response.data;
};
