import axios from "axios";
import { REACT_APP_API } from '@env';
const apiBaseUrl = REACT_APP_API;

//LOGIN
export async function login(body) {
  console.log("Login services", apiBaseUrl);
  try {
    const { data } = await axios.post(`${apiBaseUrl}sessions/login`,body);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
