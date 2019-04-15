import { IDataServices } from "../../../common/IDataService";
import pnp, { ItemAddResult, Web } from "sp-pnp-js";

export interface IVolunteerSignInSignOutProps {
  Web: Web;
  dataService: IDataServices;
}
