import axios from "axios";
import history from "../History";

export function authHeader() {
  // return authorization header with basic auth credentials
  let user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    return { Authorization: user.token };
  } else {
    return {};
  }
}

axios.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    if (
      error &&
      error.response &&
      error.response.status === 401 &&
      error.response.data &&
      error.response.data.type === "UNAUTHORIZED"
    ) {
      localStorage.removeItem("user");
      history.push("/login");
    } else throw error;
  }
);
