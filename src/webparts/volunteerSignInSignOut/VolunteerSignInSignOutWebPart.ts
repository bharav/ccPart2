import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'VolunteerSignInSignOutWebPartStrings';
import VolunteerSignInSignOut from './components/VolunteerSignInSignOut';
import { IVolunteerSignInSignOutProps } from './components/IVolunteerSignInSignOutProps';
import { DataServices } from "../../common/DataService";
import pnp,{ ItemAddResult, Web } from "sp-pnp-js";

export interface IVolunteerSignInSignOutWebPartProps {
  description: string;
}

export default class VolunteerSignInSignOutWebPart extends BaseClientSideWebPart<IVolunteerSignInSignOutWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IVolunteerSignInSignOutProps > = React.createElement(
      VolunteerSignInSignOut,
      {
        dataService: new DataServices(),
        Web: pnp.sp.web
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
