import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'InternalVacantPositionWebPartStrings';
import InternalVacantPosition from './components/InternalVacantPosition';
import { IInternalVacantPositionProps } from './components/IInternalVacantPositionProps';
import pnp,{ ItemAddResult, Web } from "sp-pnp-js";
import { DataServices } from "../../common/DataService";

export interface IInternalVacantPositionWebPartProps {
  description: string;
}

export default class InternalVacantPositionWebPart extends BaseClientSideWebPart<IInternalVacantPositionWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IInternalVacantPositionProps > = React.createElement(
      InternalVacantPosition,
      {
        dataService: new DataServices(),
        Web: pnp.sp.web,
        Context: this.context
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
