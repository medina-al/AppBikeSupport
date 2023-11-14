import axios from "axios";

// Get a cookie by its name
export async function getCookie(cookieName){
  var name = cookieName + "=";
  var allCookieArray = document.cookie.split(';');
  for(var i=0; i<allCookieArray.length; i++)
  {
    var temp = allCookieArray[i].trim();
    if (temp.indexOf(name)==0)
    return temp.substring(name.length,temp.length);
   }
  return "";
}

//Login
export async function loginUser(body){
    try {
        const { data } = await axios.post(`/sessions/login`, body);
        return data;
    } catch (error) {
      return error;
    }   
}

//Get all users
export async function getUsers(){
  try {
      const { data } = await axios.get(`/users?type=BICIUSUARIO&status=ACTIVO`);
      return data;
  } catch (error) {
    return error;
  }   
}