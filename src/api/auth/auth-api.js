import { axiosInstance } from "../axiosInterceptor";

/*________________________LOGIN_____________________________________*/
export const login = async (email, password) => {

  console.log(email,"Testing email");
  try {
    const { data } = await axiosInstance.post("/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
