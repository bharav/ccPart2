import * as React from 'react';
import styles from './VolunteerSignInSignOut.module.scss';
import { IVolunteerSignInSignOutProps } from './IVolunteerSignInSignOutProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { TextField,ComboBox, Checkbox,Spinner, Button,DatePicker, DefaultButton, Dropdown, IDropdownOption, SpinnerSize } from 'office-ui-fabric-react';
import {IVolunteerSigninSignout} from '../../../common/Model';
import {TimeTextField} from '../../../common/component/TimeTextField';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from "react-notifications";

export interface IVolunteerSignInSignOutState {
  volunteer: IVolunteerSigninSignout;
  volunteerOptions: any[];
  showSpinner: boolean;
  pendingOut: boolean;
  pendingForDate: string;
  showError: boolean;
  dataForOut:any[];
  NameKey:number;
  submitDisable: boolean;
}

export default class VolunteerSignInSignOut extends React.Component<IVolunteerSignInSignOutProps, IVolunteerSignInSignOutState> {
  constructor(props: IVolunteerSignInSignOutProps) {
    super(props);
    this.state = {
      volunteer: {
        Id:null,
        Name:"",
        Date: new Date(),
        time: "",
        InOut: "",
        Location: "",
        Profession: "",
        Role:"",
        InTime:""
      },
      volunteerOptions:[],
      showSpinner:false,
      pendingOut:false,
      pendingForDate: "",
      showError:false,
      dataForOut:[],
      NameKey:null, 
      submitDisable:false
    };
    this.handleDataChange = this.handleDataChange.bind(this);
  }

  private handleNameChange = (item: IDropdownOption): void => {
      if(this.state.volunteer.InOut === "In"){
        this.props.dataService.OldCheckOutLeft(item.text, this.props.Web).then(response=>{
          if(response.length>0){
            this.setState({dataForOut:response, pendingOut:true, submitDisable:true });
          }
          else{
            this.setState({ volunteer: { ...this.state.volunteer, Name: item.text.toString(),
              Id:this.state.volunteer.InOut === 'Out'?this.state.dataForOut[item.key]["Id"]:null,
              Profession:this.state.volunteer.InOut === 'Out'?this.state.dataForOut[item.key]["Professional"]:null,
              Role:this.state.volunteer.InOut === 'Out'?this.state.dataForOut[item.key]["Role"]:null,
              InTime:this.state.volunteer.InOut === 'Out'?this.state.dataForOut[item.key]["SigninTime"]:null }, NameKey:parseInt(item.key.toString()) });
          }
        });
      }
      else{
        this.setState({ volunteer: { ...this.state.volunteer, Name: item.text.toString(),
        Id:this.state.volunteer.InOut === 'Out'?this.state.dataForOut[item.key]["Id"]:null,
        Profession:this.state.volunteer.InOut === 'Out'?this.state.dataForOut[item.key]["Professional"]:null,
        Role:this.state.volunteer.InOut === 'Out'?this.state.dataForOut[item.key]["Role"]:null,
        InTime:this.state.volunteer.InOut === 'Out'?this.state.dataForOut[item.key]["SigninTime"]:null }, NameKey:parseInt(item.key.toString()) });
       }
  }
  
  private handleProfessionChange = (item: IDropdownOption): void => {
    this.setState({ volunteer: { ...this.state.volunteer, Profession: item.key.toString() } });
  }
  private handleRoleChange = (item: IDropdownOption): void => {
    this.setState({ volunteer: { ...this.state.volunteer, Role: item.key.toString() } });
  }
  
  private handleSignInSignOut =(item:IDropdownOption):void =>{
    this.setState({ volunteer: { ...this.state.volunteer, InOut: item.key.toString() }, showSpinner:true });
    
    this.props.dataService.GetVolunteers("Volunteer", item.key.toString() === "Out" ? true : false, this.props.Web).then(response =>{
      var volunteerOptions = [];
      response.map((item,key)=>{
        volunteerOptions.push({key:key, text:item[this.state.volunteer.InOut === "Out"?"VolunteerName":"Title"]});
      });
      this.setState({volunteerOptions:volunteerOptions, showSpinner: false, dataForOut:this.state.volunteer.InOut === "Out"?response:null});
    });
  }

  private _onFormatDate = (date: Date): string => {
    return  (date.getMonth() + 1) + '/' + date.getDate() + '/' + (date.getFullYear() % 100);
  }

  public handleSubmit = () => {
    debugger;
    this.setState({showSpinner:true});
    if( this.state.volunteer.Name!="" && this.state.volunteer.Profession!="" &&
           this.state.volunteer.time!="" && this.state.volunteer.InOut!==""){
        this.props.dataService.AddSigninSignoutDetail(this.state.volunteer, this.state.dataForOut, this.props.Web).then((response)=>{
          NotificationManager.success('Successfully Updated data');
          this.setState({showSpinner:false});
          this.setState({volunteer:{
            Id:null,
            Name:"",
            Date: new Date(),
            time:"",
            InOut:"",
            Profession:"",
            Location:"",
            Role:"",
            InTime:null
          }, 
          volunteerOptions:[],
          showSpinner:false,
          pendingOut:false,
          pendingForDate: "",
          showError:false,
          dataForOut:[],
          NameKey:null, 
          submitDisable:false});
        });     
    
      }
      else{
        this.setState({showSpinner:false});
        NotificationManager.console.error('error while updating data');
      }
  
  }

  public handleReset = () =>{
    this.setState({volunteer:{
      Id:null,
      Name:"",
      Date: new Date(),
      time:"",
      InOut:"",
      Profession:"",
      Location:"",
      Role:"",
      InTime:null
    },  
    volunteerOptions:[],
    showSpinner:false,
    pendingOut:false,
    pendingForDate: "",
    showError:false,
    dataForOut:[],
    NameKey:null, 
    submitDisable:false});

  }
  
  public handlePendingCheckout =() =>{
    this.setState({volunteer:{
      Id:this.state.dataForOut[0]["Id"],
      Name:this.state.dataForOut[0]["VolunteerName"],
      Date: new Date(this.state.dataForOut[0]["SigninDate"]),
      time:"",
      InOut:"Out",
      Profession:this.state.dataForOut[0]["Professional"],
      Location:this.state.dataForOut[0]["Location"],
      Role:this.state.dataForOut[0]["Role"],
      InTime:this.state.dataForOut[0]["SigninTime"],
    }, NameKey:0,
     volunteerOptions:[{key:0,text:this.state.dataForOut[0]["VolunteerName"]}], submitDisable:false });
  }

  public componentDidMount() {
    debugger;
    var volunteerOption: any[] = [];
    var stateOption: any[] = [];
    this.props.dataService.GetVolunteers("Volunteer", false, this.props.Web).then(response => {
      response.map(item => {
        volunteerOption.push({ key: item.Title, text: item.Title });

      });
      this.setState({ volunteerOptions: volunteerOption });
    });
  }

  public handleDataChange(value: any, attribute: any): void {
    this.setState({ volunteer: { ...this.state.volunteer, [attribute]: value } });
  }

  public render(): React.ReactElement<IVolunteerSignInSignOutProps> {
    return (
      <div>
     { this.state.showSpinner?<div className={styles.Spinner}><Spinner size={SpinnerSize.large} /></div>:
      <div>
        <div className={styles.headerText}>Volunteer Sign In/Sign Out</div>
          <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg1">
              </div>
               <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                  <DatePicker placeholder="Select date" disabled={this.state.pendingOut} minDate={new Date()}  formatDate={this._onFormatDate} allowTextInput={true} label="Date" value={this.state.volunteer.Date} onSelectDate={e => this.handleDataChange(e, "Date")}></DatePicker>
               </div>
               <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                  <Dropdown  label="Sign In/Out" disabled={this.state.pendingOut} selectedKey={this.state.volunteer.InOut} options={[{key:"In",text:"In"},{key:"Out",text:"Out"}]} onChanged={this.handleSignInSignOut}></Dropdown>
               </div> 
               <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                  <Dropdown  label="Name" disabled={this.state.pendingOut} selectedKey={this.state.NameKey} defaultSelectedKey={this.state.volunteer.Name} options={this.state.volunteerOptions} onChanged={this.handleNameChange}></Dropdown>
               </div>   
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg1">
            </div>
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                <Dropdown label="Professional" disabled={this.state.pendingOut} selectedKey={this.state.volunteer.Profession}  defaultSelectedKey={this.state.volunteer.Profession} options={[{key:"Medical", text:"Medical"},{key:"Non-medical", text:"Non-medical"}]} onChanged={this.handleProfessionChange}></Dropdown>
            </div>
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                <Dropdown label="Role" disabled={this.state.volunteer.Profession!=="Medical" || this.state.pendingOut} selectedKey={this.state.volunteer.Role}   defaultSelectedKey={this.state.volunteer.Role} options={[{key:"Nurse", text:"Nurse"},{key:"Physical Therapist", text:"Physical Therapist"},{key:"NP", text:"NP"},{key:"MD", text:"MD"},{key:"Podiatrist", text:"Podiatrist"},{key:"Medical Director", text:"Pharmascist"},{key:"Medical Drector", text:"Medical Drector"}]} onChanged={this.handleRoleChange}></Dropdown>
            </div>
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
                <TimeTextField required={false} attribute="time" placeholder="Time" label="Time" value={this.state.volunteer.time} onChange={this.handleDataChange} ></TimeTextField>
            </div>
           </div>
          <div className={styles.rowpadding}>
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg1"></div>
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg2">
              <DefaultButton text="Submit" disabled={this.state.submitDisable} primary={true} onClick={this.handleSubmit}></DefaultButton>
            </div>
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg2">
              <DefaultButton text="Reset" primary={true} onClick={this.handleReset}></DefaultButton>
            </div>
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg4">
              <DefaultButton text="Clear Pending Checkout" disabled={!this.state.pendingOut} primary={true} onClick={this.handlePendingCheckout}></DefaultButton>
            </div>
          </div>
      </div>}
      <div><NotificationContainer/></div>
      </div>
    );
  }
}
