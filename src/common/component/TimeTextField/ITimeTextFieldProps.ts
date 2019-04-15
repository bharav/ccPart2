
export interface ITimeTextFieldProps{
    label:string;
    value:string;
    placeholder:string;
    onChange(value:string, attribute:string):void;
    required: boolean;
    attribute:string;
   }