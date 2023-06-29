type Params = "listId" | "login" | "cleanstore";

const getURLSearchParam = (param: Params) => {
  return new URLSearchParams(window.location.search).get(param);
};

export default getURLSearchParam;
