import * as React from 'react';
import styles from './InternalVacantPosition.module.scss';
import { IInternalVacantPositionProps } from './IInternalVacantPositionProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Spinner, PrimaryButton, IconButton } from "office-ui-fabric-react";
import { PagedItemCollection } from 'sp-pnp-js';

export interface IInternalVacantPositionRowProps {
 title:string
}

export default class InternalVacantPositionRow extends React.Component<IInternalVacantPositionRowProps> {
    public render(): React.ReactElement<IInternalVacantPositionRowProps> {
        return (
            <div>
                {this.props.title}
            </div>
        );
    }
}