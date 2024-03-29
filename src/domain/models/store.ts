import { IBaseResponse } from "./base-response";

export interface IStore {
  id: string;
  name: string;
  location: string;
  imageBannerUrl: string;
}

export const emptyStore: IStore = {
  id: "",
  name: "",
  location: "",
  imageBannerUrl: ""
};

export interface IStoreResponse extends IBaseResponse {
  data: IStore | null | IStore[];
}
