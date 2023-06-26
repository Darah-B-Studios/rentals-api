import { IBaseResponse } from "./base-response";

export interface IUser {
  id: string;
  firstname: string;
  authStrategy: string;
  lastname: string;
  username: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  whatsappNumber: string;
  city: string; //town
  country: string;
  address: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
}

export const emptyUser: IUser = {
  id: "",
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  phoneNumber: "",
  whatsappNumber: "",
  city: "",
  country: "",
  address: "",
  password: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  avatar: "",
  authStrategy: "",
  verified: false
};

export interface IUserResponse extends IBaseResponse {
  data: IUser | null | IUser[];
}
