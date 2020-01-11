import * as React from 'react';
import * as SemanticUiReact from 'semantic-ui-react';

import { ColumnsDefinition } from '../logic/query-binder';
import { arrayTableToObjectTable, ObjectTable, objectTableToArrayTable } from '../logic/table-data';
import * as UrlBinder from '../logic/url-binder';
import Editor from './Editor';
import Grid from './Grid';

function generateUrl(tables: ObjectTables): string {
    return UrlBinder.generateUrl({
        host:
            objectTableToArrayTable(UrlBinder.ColumnsDefinition.host, tables.host),
        query: {
            basic: objectTableToArrayTable(ColumnsDefinition.basic, tables.basic),
            coord: objectTableToArrayTable(ColumnsDefinition.coord, tables.coord),
            json: tables.json,
            libs: objectTableToArrayTable(ColumnsDefinition.libs, tables.libs)
        }
    });
}

function parseUrl(url: string): ObjectTables {
    const parsed = UrlBinder.parseUrl(url);
    const indent = 4;

    return {
        basic: arrayTableToObjectTable(ColumnsDefinition.basic, parsed.query.basic),
        coord: arrayTableToObjectTable(ColumnsDefinition.coord, parsed.query.coord),
        host: arrayTableToObjectTable(UrlBinder.ColumnsDefinition.host, parsed.host),
        json: JSON.stringify(JSON.parse(parsed.query.json), undefined, indent),
        libs: arrayTableToObjectTable(ColumnsDefinition.libs, parsed.query.libs)
    };
}

interface Stringified {
    url: string;
}

interface Structured {
    basic: ObjectTable;
    coord: ObjectTable;
    host: ObjectTable;
    json: string;
    libs: ObjectTable;
}

function openQuery(url: string): void {
    console.group('Open query');
    console.log(url);
    console.groupEnd();

    window.open(url, '_blank');
}

interface Props {
    query: string;
}

interface State {
    stringified: Stringified;
    structured: Structured;
}

export default class Form extends React.Component<Props, State> {
    public constructor(props: Props, context: State) {
        super(props, context);

        const url = props.query.substring('?'.length);
        const parsed = parseUrl(url);
        this.state = {
            stringified: {
                url
            },
            structured: parsed
        };
    }

    public render(): React.ReactNode {
        return (
            <SemanticUiReact.Form>
                <SemanticUiReact.TextArea
                    autoHeight={true}
                    onChange={(event): void => this.onChangeStringifiedTextArea(event)}
                    value={this.state.stringified.url}
                />
                <SemanticUiReact.Button
                    content='parse'
                    icon='arrow alternate circle down'
                    onClick={(event): void => this.onClickOperationParse(event)}
                    primary={true} />
                <SemanticUiReact.Button
                    content='generate'
                    icon='arrow alternate circle up'
                    onClick={(event): void => this.onClickOperationGenerate(event)}
                    secondary={true} />
                <SemanticUiReact.Button
                    content='open'
                    icon='external'
                    positive={true}
                    onClick={(event): void => this.onClickOperationOpen(event)} />
                <SemanticUiReact.Button
                    content='clear'
                    icon='trash'
                    negative={true}
                    onClick={(event): void => this.onClickOperationClear(event)}
                />
                <Grid
                    columns={UrlBinder.ColumnsDefinition.host}
                    data={this.state.structured.host}
                    title='Host'
                />
                <Grid
                    columns={ColumnsDefinition.basic}
                    data={this.state.structured.basic}
                    title='Basic'
                />
                <Grid
                    columns={ColumnsDefinition.coord}
                    data={this.state.structured.coord}
                    title='Coord'
                />
                <Grid
                    columns={ColumnsDefinition.libs}
                    data={this.state.structured.libs}
                    title='Libs'
                />
                <Editor
                    onChange={(value): void => this.onChangeStructuredJsonEditor(value)}
                    title='JsonValueParameters'
                    value={this.state.structured.json}
                />
            </SemanticUiReact.Form>
        );
    }

    private onChangeStringifiedTextArea(event: React.FormEvent<HTMLTextAreaElement>): void {
        this.setState({
            ...this.state,
            stringified: {
                ...this.state.stringified,
                url: event.currentTarget.value
            }
        });
    }

    private onChangeStructuredJsonEditor(value: string): void {
        this.setState({
            ...this.state,
            structured: {
                ...this.state.structured,
                json: value
            }
        });
    }

    private onClickOperationClear(_: React.MouseEvent<HTMLButtonElement>): void {
        this.setState({
            ...this.state,
            stringified: {
                ...this.state.stringified,
                url: ''
            }
        });
    }

    private onClickOperationOpen(_: React.MouseEvent<HTMLButtonElement>): void {
        openQuery(this.state.stringified.url);
    }

    private onClickOperationParse(_: React.MouseEvent<HTMLButtonElement>): void {
        const parsed = parseUrl(this.state.stringified.url);
        this.setState({
            stringified: this.state.stringified,
            structured: parsed
        });
    }

    private onClickOperationGenerate(_: React.MouseEvent<HTMLButtonElement>): void {
        const generated = generateUrl(this.state.structured);

        this.setState({
            stringified: {
                url: generated
            },
            structured: this.state.structured
        });
    }
}

interface ObjectTables {
    basic: ObjectTable;
    coord: ObjectTable;
    host: ObjectTable;
    json: string;
    libs: ObjectTable;
}
