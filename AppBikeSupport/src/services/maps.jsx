import axios from "axios";
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;

//GET MAPS OR MARKERS
export async function getMaps(id) {
    console.log("Get Masps services: ",apiBaseUrl);
  try {
    const url = (id)?`${apiBaseUrl}maps/${id}`:`${apiBaseUrl}maps?status=ACTIVO`;
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
