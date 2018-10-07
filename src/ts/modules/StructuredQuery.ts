import * as TypescriptFsa from 'typescript-fsa';
import * as TypescriptFsaReducers from 'typescript-fsa-reducers';

import {ObjectTable} from '../logic/table-data';

export interface State {
  basicTable: ObjectTable;
  coordTable: ObjectTable;
}

const initialReduceState: State = {
  basicTable: [],
  coordTable: []
};

function basicTableHandler(state: State, table: ObjectTable): any {
  return {...state, basicTable: table};
}

function coordTableHandler(state: State, table: ObjectTable): any {
  return {...state, coordTable: table};
}

// ----------------------------------------------------------------------------
// action types
// ----------------------------------------------------------------------------
const SET_BASIC_TABLE = 'react-studies/StructuredQuery/SET_BASIC_TABLE';
const SET_COORD_TABLE = 'react-studies/StructuredQuery/SET_COORD_TABLE';

// ----------------------------------------------------------------------------
// action creators
// ----------------------------------------------------------------------------
const actionCreator = TypescriptFsa.actionCreatorFactory();

export const setBasicTable = actionCreator<ObjectTable>(SET_BASIC_TABLE);
export const setCoordTable = actionCreator<ObjectTable>(SET_COORD_TABLE);

// ----------------------------------------------------------------------------
// reducer
// ----------------------------------------------------------------------------
export default TypescriptFsaReducers.reducerWithInitialState(initialReduceState)
    .case(setBasicTable, basicTableHandler)
    .case(setCoordTable, coordTableHandler)
    .build();
