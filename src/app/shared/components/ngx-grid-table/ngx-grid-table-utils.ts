import { GridApi } from '@ag-grid-community/core';
import { ColDef, ColGroupDef } from '@ag-grid-community/core/dist/cjs/entities/colDef';
import { SFSchema } from '@delon/form';
import { DATE_FILTERS, NUMBER_FILTERS, SET_FILTERS, TEXT_FILTERS } from '../filter-input';

export function asFilterInputPropertiesUI(schema: SFSchema, ...ignores: string[]): SFSchema {
  if (!schema.properties) {
    return schema;
  }

  Object.keys(schema.properties).forEach((key: string) => {
    if (-1 !== ignores.indexOf(key)) {
      return;
    }
    // @ts-ignore
    const value = schema.properties[key] as SFSchema;

    const oldUI = value.ui ? value.ui : {};

    let newUI;
    switch (value.type) {
      case 'integer':
      case 'number':
        newUI = { filterType: 'number', options: NUMBER_FILTERS };
        break;
      case 'string':
        if (value.format && value.format.startsWith('date')) {
          newUI = { filterType: 'date', options: DATE_FILTERS };
          break;
        } else {
          newUI = { filterType: 'text', options: TEXT_FILTERS };
          break;
        }
      case 'array':
      case 'boolean':
        newUI = { filterType: 'set', options: SET_FILTERS };
        value.type = 'string';
        break;
      default:
        newUI = { filterType: 'text', options: TEXT_FILTERS };
        break;
    }

    if (schema.ui && typeof schema.ui !== 'string') {
      const ui = schema.ui;
      if (ui.optionShowType) {
        // @ts-ignore
        value.ui = { widget: 'filter-input', optionShowType: ui.optionShowType, ...newUI, ...oldUI };
      }
      if (ui.aclTmpl) {
        // @ts-ignore
        value.ui = { acl: { ability: [ui.aclTmpl.replace('{}', key)] }, ...value.ui };
      }
    } else {
      // @ts-ignore
      value.ui = { widget: 'filter-input', optionShowType: 'symbol', ...newUI, ...oldUI };
    }
  });
  return schema;
}

export function deepEach(columnDefs: (ColDef | ColGroupDef)[], each: (col: ColDef) => void): void {
  columnDefs.forEach((value) => {
    if (isGroup(value)) {
      deepEach((value as ColGroupDef).children, each);
    } else {
      each(value as ColDef);
    }
  });
}

export function isGroup(col: ColDef | ColGroupDef): boolean {
  const tmp: any = col;
  return !(typeof tmp.children === 'undefined');
}

/**
 * ??????grid?????????????????????,???????????????????????????????????????,???null
 * @param gridApi ??????api
 */
export function getSelectOrRangeSelectNode(gridApi: GridApi): Array<any> {
  let nodes = gridApi.getSelectedNodes();
  if (!nodes || !nodes.length) {
    const rangeNodes = gridApi.getCellRanges();
    if (!rangeNodes) {
      return [];
    }
    nodes = getRangeSelectNodes(rangeNodes, gridApi);
  }
  if (!nodes || !nodes.length) {
    return [];
  }
  return nodes;
}

/**
 * ??????grid?????????????????????????????????????????????????????????
 * @param rangeNodes ??????????????????
 * @param gridApi ??????api
 * @return node ??????
 */
export function getRangeSelectNodes(rangeNodes: any[], gridApi: GridApi): Array<any> {
  return rangeNodes
    .map((range) => {
      let start = range.startRow.rowIndex;
      let end = range.endRow.rowIndex;
      const _rows = [];
      [start, end] = start > end ? [end, start] : [start, end];
      for (start; start <= end; start++) {
        _rows.push(gridApi.getDisplayedRowAtIndex(start));
      }
      return _rows;
    })
    .reduce((c1, c2) => c1.concat(c2.filter((row2) => !c1.some((row1) => row1.rowIndex === row2.rowIndex))), []);
}

/**
 *
 * ?????? rowIndex???columnId?????????rangeSelections???
 * @param rangeSelections ?????????????????????
 * @param rowIndex ???????????????
 * @param columnId ????????????
 */
function isContain(rangeSelections: any[], rowIndex: number, columnId: any): boolean {
  return rangeSelections.some((node) => {
    let start = node.start.rowIndex;
    let end = node.end.rowIndex;
    [start, end] = start > end ? [end, start] : [start, end];

    // @ts-ignore
    return node.columns.some((column) => column.colId === columnId) && rowIndex >= start && rowIndex <= end;
  });
}

/**
 * ???????????????????????????????????????????????????????????????,?????????????????????
 * ????????????????????????,????????????????????????
 * @param params grid ContextMenu params
 */
export function checkAndChangeGridContextMenuRange(params: any): void {
  if (!params) {
    return;
  }
  if (!params.node) {
    params.api.clearRangeSelection();
    return;
  }
  const curRowIndex = params.node.rowIndex;
  if (!params.column) {
    params.api.clearRangeSelection();
    return;
  }
  const curColumnId = params.column.colId;
  const nodes = params.api.getRangeSelections();
  if (!nodes || !isContain(nodes, curRowIndex, curColumnId)) {
    params.api.clearRangeSelection();
    params.api.addRangeSelection({
      rowStart: curRowIndex, // the start row index
      floatingStart: null, // the starting floating ('top', 'bottom' or null/undefined)
      rowEnd: curRowIndex, // the end row index
      floatingEnd: null, // the end floating ('top', 'bottom' or null/undefined)
      columnStart: curColumnId, // colId of the starting column
      columnEnd: curColumnId, // colId of the ending column
    });
  }
}

/**
 * ???????????????????????????grid???????????????tree??????
 * @param data ????????????
 */
export function changeDataToGridTree(data: Array<any>): Array<any> {
  function getPid(pid: string, parents: string[]): any[] {
    const parent = data.filter((item) => item.id === pid);
    if (parent.length) {
      const p = parent[0];
      parents = [p.id].concat(parents);
      if (p.parentId) {
        parents = getPid(p.parentId, parents);
      }
    }
    return parents;
  }

  const newData = data.map((item) => ({ ...item }));

  newData.forEach((item) => {
    const path = [item.id];
    if (item.parentId && item.id !== item.parentId) {
      item.path = getPid(item.parentId, path);
    } else {
      item.path = path;
    }
  });
  return newData;
}
