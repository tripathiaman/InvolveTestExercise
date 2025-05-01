import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { spfi, SPFx, SPFI } from "@pnp/sp";
import * as strings from 'HelpdeskTicketsWebPartStrings';
import { HelpdeskTickets, IHelpdeskTicketsProps } from './components/HelpdeskTickets';


export interface IHelpdeskTicketsWebPartProps {
  rowLimit: string;
}

export default class HelpdeskTicketsWebPart extends BaseClientSideWebPart<IHelpdeskTicketsWebPartProps> {

    private sp: SPFI;

  public render(): void {
    const element: React.ReactElement<IHelpdeskTicketsProps> = React.createElement(
      HelpdeskTickets,
      {
          sp: this.sp,
          context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
      this.sp = spfi().using(SPFx(this.context));
      return super.onInit();
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
                  PropertyPaneTextField('rowLimit', {
                  label: strings.RowLimitFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
