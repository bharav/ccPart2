import * as React from 'react';
import {TextField, MaskedTextField} from "office-ui-fabric-react";
import {ITimeTextFieldProps} from "./ITimeTextFieldProps";
import InputMask from 'react-input-mask';
import styles from "./TimeTextField.module.scss";

export interface ITimeTextFieldState {
    mask: string;
    value:string;
    label: string;
    formatChars: any;
}
export class TimeTextField extends React.Component<ITimeTextFieldProps, ITimeTextFieldState>{
    constructor(props: ITimeTextFieldProps) {
      super(props);
        this.state = {
          value: this.props.value,
          mask: '87:69 sa',
          label: this.props.label,
          formatChars: {
            '8': '[0-1]',
            '7': '[0-9]',
            '9': '[0-9]',
            '6': '[0-6]',
            's':'[aApP]',
            'a': '[mM]'
          }
        };
        this.onChange=this.onChange.bind(this);
    }
   public componentWillReceiveProps(nextProps) {
      // You don't have to do this check first, but it can help prevent an unneeded render
      if ((nextProps.value !== this.state.value)) {
        this.setState({ value: nextProps.value });
      }
    }
    
    public onChange = (event) => {
      debugger;
      var value = event.target.value;
      var newState = {
        mask: '87:69 sa',
        label: this.props.label,
        formatChars: {
          '8': '[0-1]',
          '7': '[0-9]',
          '9': '[0-9]',
          '6': '[0-6]',
          's':'[aApP]',
          'a': '[mM]'
        }
      };
      this.setState(newState);
      this.props.onChange(value,this.props.attribute);
    }

    public render(): React.ReactElement<ITimeTextFieldProps> {
      return (
        <div className={styles.maskedTextBoxRoot}>
          <div className={styles.maskedContainer}>
          <label className={styles.maskedTextLabel}>{this.state.label}</label> 
          <div className={styles.maskedFieldGroup}>
           <InputMask {...this.state} className={styles.maskedTextBox} onChange={this.onChange} >
            </InputMask>
            </div>
          </div>
        </div>
      );
    }

}

