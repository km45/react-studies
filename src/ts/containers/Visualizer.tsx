import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';

import * as GridComponent from '../components/Grid';
import { ColumnsDefinition } from '../logic/query-binder';
import { ObjectTable } from '../logic/table-data';
import * as UrlBinder from '../logic/url-binder';
import { setTable, TablesIndex } from '../modules/StructuredQuery';
import { RootState } from '../store';

class Actions implements GridComponent.Actions {
    private dispatch: Redux.Dispatch<any>;
    private index: TablesIndex;

    constructor(dispatch: Redux.Dispatch<any>, index: TablesIndex) {
        this.dispatch = dispatch;
        this.index = index;
    }

    public setTable(table: ObjectTable): void {
        this.dispatch(setTable({ index: this.index, table }));
    }
}

interface State { }

interface Props {
    children: {
        basicGrid: GridComponent.Props,
        coordGrid: GridComponent.Props,
        hostGrid: GridComponent.Props,
        libsGrid: GridComponent.Props
    };
}

class Visualizer extends React.Component<Props, State> {
    public render() {
        return (
            <div>
                <GridComponent.default
                    actions={this.props.children.hostGrid.actions}
                    values={this.props.children.hostGrid.values} />
                <GridComponent.default
                    actions={this.props.children.basicGrid.actions}
                    values={this.props.children.basicGrid.values} />
                <GridComponent.default
                    actions={this.props.children.coordGrid.actions}
                    values={this.props.children.coordGrid.values} />
                <GridComponent.default
                    actions={this.props.children.libsGrid.actions}
                    values={this.props.children.libsGrid.values} />
            </div>);
    }
}

interface StateProps {
    basicGridValues: GridComponent.Values;
    coordGridValues: GridComponent.Values;
    hostGridValues: GridComponent.Values;
    libsGridValues: GridComponent.Values;
}

interface DispatchProps {
    basicGridActions: GridComponent.Actions;
    coordGridActions: GridComponent.Actions;
    hostGridActions: GridComponent.Actions;
    libsGridActions: GridComponent.Actions;
}

interface OwnProps { }

function mapStateToProps(state: RootState): StateProps {
    return {
        basicGridValues: {
            columns: ColumnsDefinition.basic,
            table: state.structuredQuery.tables[TablesIndex.Basic],
            title: 'Basic'
        },
        coordGridValues: {
            columns: ColumnsDefinition.coord,
            table: state.structuredQuery.tables[TablesIndex.Coord],
            title: 'Coord'
        },
        hostGridValues: {
            columns: UrlBinder.ColumnsDefinition.host,
            table: state.structuredQuery.tables[TablesIndex.Host],
            title: 'Host'
        },
        libsGridValues: {
            columns: ColumnsDefinition.libs,
            table: state.structuredQuery.tables[TablesIndex.Libs],
            title: 'Libs'
        }
    };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
    return {
        basicGridActions: new Actions(dispatch, TablesIndex.Basic),
        coordGridActions: new Actions(dispatch, TablesIndex.Coord),
        hostGridActions: new Actions(dispatch, TablesIndex.Host),
        libsGridActions: new Actions(dispatch, TablesIndex.Libs)
    };
}

function mergeProps(
    stateProps: StateProps, dispatchProps: DispatchProps,
    _/*ownProps*/: OwnProps): Props {
    return {
        children: {
            basicGrid: {
                actions: dispatchProps.basicGridActions,
                values: stateProps.basicGridValues
            },
            coordGrid: {
                actions: dispatchProps.coordGridActions,
                values: stateProps.coordGridValues
            },
            hostGrid: {
                actions: dispatchProps.hostGridActions,
                values: stateProps.hostGridValues
            },
            libsGrid: {
                actions: dispatchProps.libsGridActions,
                values: stateProps.libsGridValues
            }
        }
    };
}

export default ReactRedux.connect(
    mapStateToProps, mapDispatchToProps, mergeProps)(Visualizer);
