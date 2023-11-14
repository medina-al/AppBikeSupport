import axios from "axios";
import { getCookie } from "./user";

//Get Maps
export async function getMaps(mapId) {
  try {
    const url = mapId ? `maps/${mapId}` : `maps/`;

    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    return error;
  }
}

//Create map
export async function createMap(body) {
    try {
      const { data } = await axios.post(`maps`, body);
      return data;
    } catch (error) {
      return error;
    }
  }

//Handle map
export async function editMap(mapId,body) {
  try {
    const { data } = await axios.put(`maps/${mapId}`, body);
    return data;
  } catch (error) {
    return error;
  }
}

//Create map point
export async function createPoint(body) {
    try {
      const { data } = await axios.post(`maps/points`, body);
      return data;
    } catch (error) {
      return error;
    }
  }

//Handle map points
export async function editPoints(mapId,body) {
  try {
    const { data } = await axios.put(`maps/points/${mapId}`, body);
    return data;
  } catch (error) {
    return error;
  }
}
