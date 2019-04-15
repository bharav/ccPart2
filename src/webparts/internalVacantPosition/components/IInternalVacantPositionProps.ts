import { IDataServices } from "../../../common/IDataService";
import pnp, { ItemAddResult, Web } from "sp-pnp-js";
import {
 IWebPartContext
} from '@microsoft/sp-webpart-base';

export interface IInternalVacantPositionProps {
  Context: IWebPartContext;
  Web: Web;
  dataService: IDataServices;
}
