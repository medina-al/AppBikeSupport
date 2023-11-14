import axios from "axios";

//Get Lists
export async function getLists() {
  try {
    const { data } = await axios.get("listsMaster");
    return data;
  } catch (error) {
    return error;
  }
}

//Create list value
export async function createList(body) {
  try {
    const { data } = await axios.post(`listsMaster`, body);
    return data;
  } catch (error) {
    return error;
  }
}

//Edit list value
export async function editList(listId, body) {
  try {
    const { data } = await axios.put(`listsMaster/${listId}`, body);
    return data;
  } catch (error) {
    return error;
  }
}
