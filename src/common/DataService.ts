import {  IVolunteerSigninSignout , IReturnStatus, IVolunteerGraphData, IEmployeeSigninSignout } from "./Model";
import { Web, CamlQuery } from "sp-pnp-js";
import {IDataServices} from "./IDataService"  ;

export class DataServices implements IDataServices {
public AddSigninSignoutDetail(Data: IVolunteerSigninSignout,dataForOut:any[], Web: Web): Promise<IReturnStatus> {
  debugger;
    let returnObject = {} as IReturnStatus;
    if(Data.InOut === "In"){
        return Web.lists.getByTitle("VolunteerTimeRecord").items.add({
          Title: Data.Name,
          VolunteerName:Data.Name,
          SigninDate:Data.Date,
          SigninTime:Data.time,
          Professional:Data.Profession,
          Location:Data.Location,
          //hours:this.TimeDiff(Data.InTime, Data.OutTime),
          Role:Data.Role
        }).then(response => {
          returnObject.StatusCode = 204;
          returnObject.message = "item added";
          return returnObject;
        }).catch(error => {
          returnObject.StatusCode = 500;
          returnObject.message = error;
          return returnObject;
        });
    }
    else{
      return Web.lists.getByTitle("VolunteerTimeRecord").items.getById(Data.Id).update({
        SignoutTime:Data.time,
        hours:this.TimeDiff(Data.InTime, Data.time)
      }).then(response => {
        returnObject.StatusCode = 204;
        returnObject.message = "item added";
        return returnObject;
      }).catch(error => {
        returnObject.StatusCode = 500;
        returnObject.message = error;
        return returnObject;
      });
    }

  }

  public GetVolunteers(ListName:string,IsOut:boolean, Web:Web):Promise<any> {
    if(IsOut=== false){
    return Web.lists.getByTitle(ListName).items.filter("Status eq 'Active'").get()
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  }
  else{
    return this.GetVolunteersForOut(ListName,Web).then(response=>{
      return response;
    }).catch(err=>{
      return err;
    });
  }
}
  public GetVolunteersForOut(ListName: string, Web:Web):Promise<any> {
    var ViewXml = "<View><Query><Where><And><Geq><FieldRef Name='SigninDate' /><Value Type='DateTime'><Today/></Value></Geq><IsNull><FieldRef Name='SignoutTime' /></IsNull></And></Where></Query></View>";
    const query: CamlQuery = {
        ViewXml: ViewXml,
    };
    return Web.lists.getByTitle('VolunteerTimeRecord').getItemsByCAMLQuery(query)
    .then(respone =>{
         return respone;
    }).catch(err=>{
        return err;
    });
  }

  public GetEmployeesTodayData(Web:Web, UserName:string):Promise<any> {
    var ViewXml = "<View><Query><Where><And><Eq><FieldRef Name='EmployeeName' /><Value Type='Text'>"+UserName+"</Value></Eq><And><Neq><FieldRef Name='EntryType' /><Value Type='Text'>PTO</Value></Neq><Eq><FieldRef Name='Date' /><Value Type='DateTime'><Today/></Value></Eq></And></And></Where></Query></View>";
    const query: CamlQuery = {
        ViewXml: ViewXml,
    };
    return Web.lists.getByTitle('EmployeeSignInSignOut').getItemsByCAMLQuery(query)
    .then(respone =>{
         return respone;
    }).catch(err=>{
        return err;
    });
  }
  public GetEmployeesptoData(Web:Web, UserName:string, startDate:Date, endDate:Date):Promise<any> {
    var startDateString =startDate.toISOString();
    var endDateString = endDate.toISOString();
    var ViewXml = "<View><Query><Where><And><Eq><FieldRef Name='EmployeeName' /><Value Type='Text'>"+UserName+"</Value></Eq><And><Eq><FieldRef Name='EntryType' /><Value Type='Text'>PTO</Value></Eq><And><Geq><FieldRef Name='Date' /><Value Type='DateTime'>"+startDateString+"</Value></Geq><Leq><FieldRef Name='Date' /><Value Type='DateTime'>"+endDateString+"</Value></Leq></And></And></And></Where></Query></View>";
    const query: CamlQuery = {
        ViewXml: ViewXml,
    };
    return Web.lists.getByTitle('EmployeeSignInSignOut').getItemsByCAMLQuery(query)
    .then(respone =>{
         return respone;
    }).catch(err=>{
        return err;
    });
  }
  
  private TimeDiff(startTime:string, endTime:string):number{
      debugger;
    var timeStart = new Date("01/01/2007 " + startTime).getHours();
    var timeEnd = new Date("01/01/2007 " + endTime).getHours();
    var hourDiff = timeEnd - timeStart; 
    return hourDiff;
  }

  public GetVolunteersDataForReport(year:string, profession, Web:Web): Promise<IVolunteerGraphData>
  {
    let returnObject = {} as IVolunteerGraphData;
    var startDate = (new Date('01/01/'+year)).toISOString();
    var endDate = (new Date('12/31/'+year)).toISOString();

    var ViewXmlwithoutProfession = "<View><Query><Where><And><Geq><FieldRef Name='SigninDate' /><Value IncludeTimeValue='TRUE' Type='DateTime'>"+startDate+"</Value></Geq><Leq><FieldRef Name='SigninDate' /><Value IncludeTimeValue='TRUE' Type='DateTime'>"+endDate+"</Value></Leq></And></Where></Query></View>";
    var ViewXmlwithProfession = "<View><Query><Where><And><Geq><FieldRef Name='SigninDate' /><Value IncludeTimeValue='TRUE' Type='DateTime'>"+startDate+"</Value></Geq><And><Leq><FieldRef Name='SigninDate' /><Value IncludeTimeValue='TRUE' Type='DateTime'>"+endDate+"</Value></Leq><Eq><FieldRef Name='Professional' /><Value Type='Choice'>"+profession+"</Value></Eq></And></And></Where></Query></View>";
    const query: CamlQuery = {
        ViewXml: profession === "both" ? ViewXmlwithoutProfession: ViewXmlwithProfession,
    };
    return Web.lists.getByTitle('VolunteerTimeRecord').getItemsByCAMLQuery(query)
    .then(respone =>{
        if(respone.length>0){
          returnObject = this.TransformData(respone);
        }
        else{
          returnObject.error = "No Data Found for the selected choice";
        }
       
         return returnObject;
    }).catch(err=>{
        returnObject.error= err.message;
        return returnObject;
    });
  }
 
  private TransformData(data:any[]):IVolunteerGraphData{
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var volunteerGraphData:IVolunteerGraphData = {
        hours:[0,0,0,0,0,0,0,0,0,0,0,0],
        dollars:[0,0,0,0,0,0,0,0,0,0,0,0],
        months:month,
        error:""
    };

    data.map(item=>{
        var currentItemDate = new Date(item["SigninDate"]);
        var month:number = currentItemDate.getMonth();
        volunteerGraphData.hours[month] = volunteerGraphData.hours[month] + item["hours"];
        volunteerGraphData.dollars[month] = volunteerGraphData.dollars[month] + item["hours"]*5; 
    });

    return volunteerGraphData;
  }

  public OldCheckOutLeft(volunteerName:string, Web:Web):Promise<any>{
    var ViewXml = "<View><Query><Where><And><Eq><FieldRef Name='VolunteerName' /><Value Type='Text'>"+volunteerName+"</Value></Eq><IsNull><FieldRef Name='SignoutTime' /></IsNull></And></Where></Query></View>";
    const query: CamlQuery = {
          ViewXml: ViewXml,
      };
      return Web.lists.getByTitle('VolunteerTimeRecord').getItemsByCAMLQuery(query)
      .then(respone =>{
          return respone;
      }).catch(err=>{
          return err;
      });
  }

  public AddEmployeeSignInSignOutData(data:IEmployeeSigninSignout, Web:Web):Promise<any>{
      debugger;
    let returnObject = {} as IReturnStatus;
      return Web.lists.getByTitle("EmployeeSignInSignOut").items.add({
        Title: data.Name,
        EmployeeName:data.Name,
        Date:data.Date,
        EntryTime:data.InTime,
        EntryType:"Present",
        ExitTime:"",
        TimeInOffice:0
      }).then(response => {
        returnObject.StatusCode = 204;
        returnObject.message = "item added";
        return returnObject;
      }).catch(error => {
        returnObject.StatusCode = 500;
        returnObject.message = error;
        return returnObject;
      });
  }

  public UpdateEmployeeSignInSignOutData(data:IEmployeeSigninSignout, Web:Web):Promise<any>{
      debugger;
    let returnObject = {} as IReturnStatus;
      return Web.lists.getByTitle("EmployeeSignInSignOut").items.getById(data.Id).update({
        Title: data.Name,
        EmployeeName:data.Name,
        Date:data.Date,
        EntryTime:data.InTime,
        EntryType:"Present",
        ExitTime:data.InOut,
        TimeInOffice:data.time
      }).then(response => {
        returnObject.StatusCode = 204;
        returnObject.message = "item update";
        return returnObject;
      }).catch(error => {
        returnObject.StatusCode = 500;
        returnObject.message = error;
        return returnObject;
      });
  }

  public GetInternalVacantPosition(Web:Web):Promise<any>{
    var ViewXml = "<View><Query><Where><Eq><FieldRef Name='Status' /><Value Type='Choice'>Open</Value></Eq></Where></Query></View>";
    const query: CamlQuery = {
        ViewXml: ViewXml
    };
    return Web.lists.getByTitle('Vacant Position').getItemsByCAMLQuery(query)
    .then(response =>{
         return response;
    }).catch(err=>{
        return err;
    });

  }

}