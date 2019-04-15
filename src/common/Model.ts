import { ItemAddResult, Web } from "sp-pnp-js";

export interface IVolunteerSigninSignout {
  Id:number;
  Name: string;
  Date: Date;
  InOut: string;
  Location: string;
  Profession: string;
  Role: string;
  time: string;
  InTime:string;
}

export interface IEmployeeSigninSignout {
  Id:number;
  Name: string;
  Date: Date;
  InOut: string;
  time: number;
  InTime:string;
}

export interface IReturnStatus {
    StatusCode: number;
    message: string;
    item?:ItemAddResult;
  }

export interface IVolunteerGraphData {
  hours:number[];
  dollars: number[];
  months: number[];
  error: string;
}  