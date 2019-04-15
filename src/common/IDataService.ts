import {  IVolunteerSigninSignout , IReturnStatus, IVolunteerGraphData, IEmployeeSigninSignout } from "./Model";
import { Web } from "sp-pnp-js";
  
  
  export interface IDataServices {
     AddSigninSignoutDetail(Data: IVolunteerSigninSignout,dataForOut:any[], Web: Web): Promise<IReturnStatus>;
     GetVolunteers(ListName:string,IsOut:boolean, Web:Web):Promise<any>;
     GetVolunteersDataForReport(year:string, profession,Web:Web):Promise<IVolunteerGraphData>;
     OldCheckOutLeft(volunteerName:string, Web:Web):Promise<any>;
     GetEmployeesTodayData(Web:Web, UserName:string):Promise<any> 
     UpdateEmployeeSignInSignOutData(data:IEmployeeSigninSignout, Web:Web):Promise<any>
     AddEmployeeSignInSignOutData(data:IEmployeeSigninSignout, Web:Web):Promise<any>
     GetEmployeesptoData(Web:Web, UserName:string, startDate:Date, endDate:Date):Promise<any>
  }
  