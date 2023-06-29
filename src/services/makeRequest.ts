import axios, { AxiosRequestConfig } from "axios";

type MakeRequestArgs = {
  url: string;
  method: "get" | "post";
  options?: AxiosRequestConfig;
};

const makeRequest = async <AxiosResponseDataType>({
  url,
  method,
  options,
}: MakeRequestArgs): Promise<AxiosResponseDataType | any> => {
  try {
    const response = await axios({
      method,
      url,
      data: options?.params,
      headers: options?.headers,
    });

    return response.data as AxiosResponseDataType;
  } catch (e: any) {
    return { error: e };
  }
};

export default makeRequest;
