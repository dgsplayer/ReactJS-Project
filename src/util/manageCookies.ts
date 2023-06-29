import Cookie from "js-cookie";

type Key = "token";

export const setCookie = (key: Key, value: any, expires: number | Date) => {
  Cookie.set(key, value, { expires });
};

export const removeCookie = (key: Key) => {
  Cookie.remove(key);
};

export const getCookie = (key: Key) => {
  return Cookie.get(key);
};

export const getAllCookies = () => {
  return Cookie.get();
};
