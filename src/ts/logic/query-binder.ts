import {
    ArrayRow, ArrayTable, Columns
} from './table-data';

export class ColumnsDefinition {
    public static readonly basic: Columns = [
        { key: 'key', name: 'Key' },
        { key: 'value', name: 'Value' }];
    public static readonly coord: Columns = [
        { key: 'key', name: 'Key' },
        { key: 'x', name: 'x' },
        { key: 'y', name: 'y' },
        { key: 'z', name: 'z' }];
    public static readonly libs: Columns = [
        { key: 'key', name: 'Key' },
        { key: 'lib1', name: 'lib1' },
        { key: 'lib2', name: 'lib2' }
    ];
}

export interface QueryBinder {
    basic: ArrayTable;
    coord: ArrayTable;
    libs: ArrayTable;
}

export function parseQuery(query: string): QueryBinder {
    const table = query.split('&').map((keyValuePair: string) => {
        return keyValuePair.split('=');
    });

    const basic: ArrayTable = [];
    const coord: ArrayTable = [];
    const libs: ArrayTable = [];

    for (const param of table) {
      const key = param[0];
      const value = param[1];

      if (key.match(/^coord[0-9]+$/)) {
        coord.push([key].concat(value.split(',')));
      } else if (key === 'libs') {
        libs.push([key].concat(value.split('.').map((value: string) => {
          return decodeURIComponent(value);
        })));
      } else if (key) {  // ignore empty key
        basic.push([key, decodeURIComponent(value)]);
      }
    }

    return {
        basic,
        coord,
        libs
    };
}

function fixedEncodeURIComponent(str: string) {
    return encodeURIComponent(str).replace(/[-_.!~*'()]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
}

export function generateQuery(binder: QueryBinder): string {
    const basic = binder.basic.map((v: ArrayRow): [string, string] => {
        const key = v[0];
        const value = v[1];
        return [key, encodeURIComponent(value)];
    });

    const coord = binder.coord.map((v: ArrayRow): [string,string] => {
        const key = v[0];

        const values = v.slice(1);
        const value = encodeURIComponent(values.join(','));
        return [key, value];
    });

    const libs = binder.libs.map((v: ArrayRow): [string, string] => {
        const key = v[0];

        const values = v.slice(1);
        const value = values
            .map((s: string) => {
                return fixedEncodeURIComponent(s);
            })
            .join('.');

        return [key, value];
    });

    return Array.prototype.concat(basic, coord, libs)
        .map((v: [string, string]) => {
            return v.join('=');
        })
        .join('&');
}
