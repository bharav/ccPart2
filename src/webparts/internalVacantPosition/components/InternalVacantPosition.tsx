import * as React from 'react';
import styles from './InternalVacantPosition.module.scss';
import { IInternalVacantPositionProps } from './IInternalVacantPositionProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Spinner, PrimaryButton, IconButton, SpinnerSize, Link } from "office-ui-fabric-react";
import { PagedItemCollection } from 'sp-pnp-js';
import internalVacantPositionRow from "./internalVacantPositionRow"
import InternalVacantPositionRow from './internalVacantPositionRow';
import { PopupWindowPosition } from '@microsoft/sp-webpart-base';

export interface IInternalVacantPositionState {
  items: any[];
  showSpinner: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  paginitionArray: any[];
  currentPageIndex: number;
  selectedItem: any[];
}

export default class InternalVacantPosition extends React.Component<IInternalVacantPositionProps, IInternalVacantPositionState> {

  constructor(props: IInternalVacantPositionProps) {
    super(props);
    this.state = {
      items: [],
      showSpinner: true,
      hasNext: false,
      hasPrevious: false,
      paginitionArray: [],
      currentPageIndex: -1,
      selectedItem: []
    };
  }

  public componentDidMount(): any {
    this.GetFirstPageData();
  }

  public render(): React.ReactElement<IInternalVacantPositionProps> {
    return (
    <div>
      { this.state.showSpinner ? <div className={styles.Spinner}><Spinner size={SpinnerSize.large} /></div>:
      <div className={ styles.internalVacantPosition }>
        <div className={ styles.container }>
        <div className={styles.headerRow}>
           <div className={styles.itemHeaderTitle}>Job Title</div>
           <div className={styles.itemButton}></div>
        </div>
          {this.state.items.map((item,key)=>{
            var rowClass = key % 2 === 0 ? styles.evenRow : styles.oddRow
            return (<div className={ rowClass }>
             <div className={styles.itemTitle}><Link href = {'https://christclinickaty.sharepoint.com/sites/intranet/HR/Lists/Vacant%20Position/DispForm.aspx?ID='+item.Id+"&Source="+ window.location.href}>{item.Title}</Link></div>
             <div className ={styles.itemButton}><button className={styles.button} onClick={this.handleApply}>Apply</button></div>
            </div>);
          })}
          <div className={styles.row}>
            <button className={styles.button} disabled={!this.state.hasPrevious} onClick = {this.PreviousPageDate}>Previous </button >
            <button className={styles.button} disabled={!this.state.hasNext} onClick = {this.NextPageData}>Next </button >
          </div>
        </div>
      </div>
    }
    </div>
    );
  }

  private GetFirstPageData() {
    debugger;
    this.props.Web.lists.getByTitle("Vacant Position").items.filter("Status ne 'Closed'").top(10).getPaged()
      .then(response => {
        var tempArray = this.state.paginitionArray;
        tempArray.push(response);
        this.setState({ items: response.results, showSpinner: false, paginitionArray: tempArray, hasNext: response.hasNext, hasPrevious: false, currentPageIndex: 0 });
        console.log(response);
      })
      .catch(error => {
      });
  }

  private PreviousPageDate = () => {
    this.setState({ showSpinner: true });
    var pageIndex:number= this.state.currentPageIndex - 1;
             this.setState({ items: this.state.paginitionArray[pageIndex].results,showSpinner: false,hasNext:this.state.paginitionArray[pageIndex].hasNext,hasPrevious:pageIndex===0?false:true, currentPageIndex: pageIndex });
  }

  private handleApply = () => {
    debugger;
    window.location.href = "https://christclinickaty.sharepoint.com/sites/intranet/HR/Lists/Vacant%20Position%20Application/NewForm.aspx?Source="+window.location.href;
  }

  private NextPageData = () => {
    this.setState({ showSpinner: true });
    var pageIndex:number= this.state.currentPageIndex + 1;
    if(this.state.paginitionArray.length >= pageIndex+1){
      this.setState({items:this.state.paginitionArray[pageIndex].results,showSpinner: false,hasNext:this.state.paginitionArray[pageIndex].hasNext,hasPrevious:true,currentPageIndex:pageIndex});
    }
    else{
      var previousResponse = this.state.paginitionArray[this.state.currentPageIndex];
      previousResponse.getNext().then(response => {
        var tempArray = this.state.paginitionArray;
        tempArray.push(response);
        this.setState({ items: response.results, showSpinner: false, paginitionArray: tempArray, hasNext: response.hasNext, hasPrevious: true, currentPageIndex: this.state.currentPageIndex + 1 });
        console.log(response);
      });
    }
  }


}
