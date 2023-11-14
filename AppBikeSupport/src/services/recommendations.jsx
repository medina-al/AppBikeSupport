import axios from "axios";
import { REACT_APP_API } from "@env";
const apiBaseUrl = REACT_APP_API;

//GET RECOMMENDATIONS
export async function getRecommendations(recId,status) {
    console.log("Get recommendations service: "+apiBaseUrl);
    try {
      let query="";
      if (status != null) query=query+"status="+status;
  
      let url=(recId==null)?`${apiBaseUrl}recommendations/?${query}`:`${apiBaseUrl}users/${recId}?${query}`;
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  