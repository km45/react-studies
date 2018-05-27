import * as React from "react";
import * as ReactDataGrid from "react-data-grid";
import update from 'immutability-helper';

export interface GridProps { compiler: string; framework: string; }

class Row {
    key: string;
    value: string;
}

class GridState {
    rows: Row[];
}

export class Grid extends React.Component<GridProps, GridState> {
    _columns: ReactDataGrid.Column[];

    constructor(props: GridProps, context: GridState) {
        super(props, context);
        this.state = ({
            rows: this.createRows()
        });
        this._columns = [
            { key: 'key', name: 'Key', editable: true },
            { key: 'value', name: 'Value', editable: true },];
    }

    createRows = () => {
        let rows = [];
        for (let i = 0; i < 10; i++) {
            rows.push({
                key: 'Sample Key ' + i,
                value: 'Sample Value ' + i
            });
        }

        return rows;
    }

    rowGetter = (i: number) => {
        return this.state.rows[i];
    }

    handleGridRowsUpdated = (
        { fromRow, toRow, updated }: { fromRow: number, toRow: number, updated: any }
    ) => {
        let rows = this.state.rows.slice();

        for (let i = fromRow; i <= toRow; i++) {
            let rowToUpdate = rows[i];
            let updatedRow = update(rowToUpdate, { $merge: updated });
            rows[i] = updatedRow;
        }

        this.setState({ rows });
    };

    render() {
        return <ReactDataGrid
            columns={this._columns}
            enableCellSelect={true}
            minHeight={500}
            onGridRowsUpdated={this.handleGridRowsUpdated}
            rowGetter={this.rowGetter}
            rowsCount={this.state.rows.length}
        />;
    }
}