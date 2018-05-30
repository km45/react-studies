import * as React from "react";
import * as ReactDataGrid from "react-data-grid";
import update from 'immutability-helper';

import {
    Columns, ObjectRow, ObjectTable
} from '../logic/data-type-interface'

export interface Props {
    columns: Columns;
}

interface State {
    table: ObjectTable;
}

export class Grid extends React.Component<Props, State> {
    private columns: ReactDataGrid.Column[];

    public constructor(props: Props, context: State) {
        super(props, context);
        this.state = ({
            table: this.createRows()
        });
        this.columns = this.createColumns(props.columns);
    }

    private createColumns(columns: Columns): ReactDataGrid.Column[] {
        return columns.map(
            (column): ReactDataGrid.Column => {
                return {
                    key: column.key,
                    name: column.name,
                    editable: true
                };
            }
        );
    }

    private createRows = (): ObjectTable => {
        let rows: ObjectTable = [];
        for (let i = 0; i < 10; i++) {
            rows.push({
                key: 'key' + i,
                value: 'value' + i
            });
        }

        return rows;
    }

    private rowGetter = (i: number) => {
        return this.state.table[i];
    }

    public getRows(): ObjectTable {
        return this.state.table;
    }

    public setRows(table: ObjectTable): void {
        this.setState({
            table: table
        });
    }

    private handleGridRowsUpdated(e: ReactDataGrid.GridRowsUpdatedEvent): void {
        let table = this.state.table.slice();

        for (let i = e.fromRow; i <= e.toRow; i++) {
            let rowToUpdate = table[i];
            let updatedRow = update(rowToUpdate, { $merge: e.updated });
            table[i] = updatedRow;
        }

        this.setState({
            table: table
        });
    }

    public render() {
        return <ReactDataGrid
            columns={this.columns}
            enableCellSelect={true}
            minHeight={500}
            onGridRowsUpdated={this.handleGridRowsUpdated}
            rowGetter={this.rowGetter}
            rowsCount={this.state.table.length}
        />;
    }
}