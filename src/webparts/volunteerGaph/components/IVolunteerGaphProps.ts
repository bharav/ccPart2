import { IDataServices } from "../../../common/IDataService";
import pnp, { ItemAddResult, Web } from "sp-pnp-js";
export interface IVolunteerGaphProps {
  Web: Web;
  dataService: IDataServices;
}
