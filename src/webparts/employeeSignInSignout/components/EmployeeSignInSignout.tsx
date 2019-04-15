import * as React from 'react';
import styles from './EmployeeSignInSignout.module.scss';
import { IEmployeeSignInSignoutProps } from './IEmployeeSignInSignoutProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {IEmployeeSigninSignout} from '../../../common/Model';
import * as moment from 'moment';
import { TextField,ComboBox, Checkbox,Spinner, Button,DatePicker, DefaultButton, Dropdown, IDropdownOption, SpinnerSize } from 'office-ui-fabric-react';

export interface IEmployeeSignInSignOutState {
  SignInSignOutData:IEmployeeSigninSignout;
  showSignIn:boolean;
  showSignOut:boolean;
  ShowWeeklyData:boolean
  showSpinner:boolean;
  ptoHours:number;
}

export default class EmployeeSignInSignout extends React.Component<IEmployeeSignInSignoutProps, IEmployeeSignInSignOutState> {
  constructor(props: IEmployeeSignInSignoutProps) {
    super(props);
    this.state = {
      SignInSignOutData: {
        Id:null,
        Name:"",
        Date: new Date(),
        time: 0,
        InOut: "",
        InTime:"",
      },
      ptoHours:0,
      showSpinner:false,
      showSignIn:false,
      showSignOut:false,
      ShowWeeklyData:false
    };
  }

  public componentDidMount() {
    debugger;
    this.setState({showSpinner:true});
   var isDataExist:Boolean = false; 
   this.props.dataService.GetEmployeesTodayData(this.props.Web,this.props.Context.pageContext.user.displayName).then(data=>{
    var alreadySignInData:IEmployeeSigninSignout = null;
          data.map((item,key)=>{
            if(item.ExitTime === null){
            isDataExist=true;
            alreadySignInData = {
              Id: item.Id,
              Name:item.EmployeeName,
              Date: item.Date,
              time: 0,
              InOut:"",
              InTime:item.EntryTime
            }
          }
          var now = moment();
          var monday = now.clone().weekday(1);
          var friday = now.clone().weekday(5);
          this.props.dataService.GetEmployeesptoData(this.props.Web, this.props.Context.pageContext.user.displayName,monday.toDate(),friday.toDate()).then(response=>{
            var ptoHours:number = 0;
            response.map((item,key)=>{
            ptoHours += item.PTOHours
            });
            this.setState({ptoHours:ptoHours});
          });
        });
        isDataExist?this.setState({SignInSignOutData:alreadySignInData, showSpinner:false,showSignOut:true }):this.setState({showSpinner:false,showSignIn:true })
      
   })
  }

  private CurrentTime():string{
    var now = moment();
    var time = now.hour() + ':' + now.minutes();
    time = time + ((now.hour()) >= 12 ? ' PM' : ' AM');
    return time;
  }
  private TimeDifference(startTime,endTime):number{
    var hours  = moment.duration(moment(endTime,"hh:mm A").diff(moment(startTime,"hh:mm A"))).asHours()   
    return parseFloat(hours.toFixed(2)); 
  }

  public handleSignIn = () => {
    debugger;
    this.setState({showSpinner:true});
    var alreadySignInData:IEmployeeSigninSignout={
      Id: null,
      Name:this.props.Context.pageContext.user.displayName,
      Date: new Date(),
      time: 0,
      InOut:"",
      InTime:this.CurrentTime()
    }
    this.props.dataService.AddEmployeeSignInSignOutData(alreadySignInData,this.props.Web).then(response=>{
      this.setState({SignInSignOutData:alreadySignInData, showSpinner:false,showSignOut:true,showSignIn:false });
    })
   
  }
  public handleSignOut = () => {
    debugger;
    this.setState({showSpinner:true});
    var alreadySignInData:IEmployeeSigninSignout={
      Id: this.state.SignInSignOutData.Id,
      Name:this.state.SignInSignOutData.Name,
      Date:this.state.SignInSignOutData.Date,
      time: this.TimeDifference(this.state.SignInSignOutData.InTime,this.CurrentTime()),
      InOut:this.CurrentTime(),
      InTime:this.state.SignInSignOutData.InTime
    }
    this.props.dataService.UpdateEmployeeSignInSignOutData(alreadySignInData,this.props.Web).then(response=>{
      this.setState({SignInSignOutData:alreadySignInData, showSpinner:false,showSignIn:true,showSignOut:false });
    })
  }
  public render(): React.ReactElement<IEmployeeSignInSignoutProps> {
    return (
      <div>
      {this.state.showSpinner?<div className={styles.Spinner}><Spinner size={SpinnerSize.large} /></div>:
      <div className={ styles.employeeSignInSignout }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <p className={ styles.subTitle }>Click on the below button to enroll your day's entry.</p>
              {this.state.showSignIn?<button className={styles.button} onClick={this.handleSignIn}>Sign In</button>:null}
              {this.state.showSignOut?<button className={styles.button} onClick={this.handleSignOut}>Sign Out</button>:null}
              <br/>
              <br/>
              <span className={styles.subText} >This Week PTO hours is {this.state.ptoHours} hours</span>
            </div>
          </div>
        </div>
      </div>
    }
    </div>
    );
  }
}
