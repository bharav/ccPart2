import * as React from 'react';
import styles from './VolunteerGaph.module.scss';
import { IVolunteerGaphProps } from './IVolunteerGaphProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { TextField,ComboBox, Checkbox,Spinner, Button,DatePicker, DefaultButton, Dropdown, IDropdownOption, SpinnerSize } from 'office-ui-fabric-react';
import {IVolunteerGraphData} from '../../../common/Model';
import {Bar} from 'react-chartjs-2';
export interface IVolunteerSignInSignOutState {
  data: {};
  options:{};
  plugins:any[];
  showSpinner: boolean;
  year: string;
  yearOption: any[];
  profession:string;
  error:string;
}

export default class VolunteerGaph extends React.Component<IVolunteerGaphProps, IVolunteerSignInSignOutState> {
  private _currentyear:number;
  constructor(props: IVolunteerGaphProps) {
    super(props);
    this._currentyear = (new Date()).getFullYear();
    this.state ={
      data:{},
      error:"",
      options:{},
      plugins:[],
      showSpinner:false,
      year: this._currentyear.toString(),
      yearOption:[{key: this._currentyear.toString(),text:this._currentyear.toString()},{key: (this._currentyear-1).toString(),text:(this._currentyear-1).toString()},{key: (this._currentyear-2).toString(),text:(this._currentyear-2).toString()}],
      profession:"both"
    };
  }

  public componentDidMount() {
    debugger;
    this.setState({showSpinner:true});
   this.props.dataService.GetVolunteersDataForReport(this.state.year, this.state.profession, this.props.Web).then(response=>{
     if(response.error===""){
      this.SetGraphData(response);
     }
      else{
        this.setState({error:response.error});
      }
      this.setState({showSpinner:false});
   });
  }

  private handleProfessionChange = (item: IDropdownOption): void => {
    this.setState({ profession: item.key.toString(), showSpinner:true});
    this.props.dataService.GetVolunteersDataForReport(this.state.year, item.key.toString(), this.props.Web).then(response=>{
      if(response.error===""){
        this.SetGraphData(response);
       }
        else{
          this.setState({error:response.error});
        }
      this.setState({showSpinner:false});
   });
  }
  private handleYearChange = (item: IDropdownOption): void => {
    this.setState({ year:item.key.toString(), showSpinner:true});
    this.props.dataService.GetVolunteersDataForReport(item.key.toString(), this.state.profession, this.props.Web).then(response=>{
      if(response.error===""){
        this.SetGraphData(response);
       }
        else{
          this.setState({error:response.error});
        }
      this.setState({showSpinner:false});
   });
  }

  private SetGraphData (response:IVolunteerGraphData):void{
    const data = {
      labels: response.months,
      datasets: [
          {
            label: "Dollar",
            type:"line",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            borderColor: 'rgba(0, 0, 0, 0.9)',
            borderCapStyle: 'butt',
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(0,0,0,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(0,0,0,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: response.dollars
          },
          {
            label: "Hours",
            type: "bar",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(170, 46, 54, 0.9)",
            borderColor: 'rgba(170, 46, 54, 0.9)',
            borderCapStyle: 'butt',
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: response.hours
          }]
        };
    this.setState({data:data, error:""});
  }

  public render(): React.ReactElement<IVolunteerGaphProps> {
    return (
      <div>
      <div className={styles.headerText}>Volunteer Sign In/Sign Out Report</div>
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg1">
            </div>
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
              <Dropdown  label="Year" selectedKey={this.state.year} defaultSelectedKey={this.state.year} options={this.state.yearOption} onChanged={this.handleYearChange} ></Dropdown>
            </div>
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
              <Dropdown label="Professional" selectedKey={this.state.profession}   defaultSelectedKey={this.state.profession} options={[{key:"both", text:"Both"},{key:"Medical", text:"Medical"},{key:"Non-medical", text:"Non-medical"}]} onChanged={this.handleProfessionChange}></Dropdown>
            </div>
        </div>
        {this.state.showSpinner? <div className={styles.Spinner}><Spinner size={SpinnerSize.large} /></div> : this.state.error!==""?<div><p>{this.state.error}</p></div>:
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg1">
            </div>
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg10">
              <Bar data={this.state.data} />
            </div>
        </div>
        }
      </div>  
    );
  }
}
