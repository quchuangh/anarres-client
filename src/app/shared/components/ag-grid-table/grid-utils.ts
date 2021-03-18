import { GridApi } from '@ag-grid-community/core';
import { ColDef, ColGroupDef } from '@ag-grid-community/core/dist/cjs/entities/colDef';

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
 * 得到grid中被选择的节点,如果没有返回被范围选中的行,或null
 * @param gridApi 表格api
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
 * 根据grid的范围选择对象得到表格中被区域选择的行
 * @param rangeNodes 被选择的范围
 * @param gridApi 表格api
 * @return node 数组
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
 * 当前 rowIndex和columnId是否在rangeSelections中
 * @param rangeSelections 范围选择的区域
 * @param rowIndex 当前行索引
 * @param columnId 当前列名
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
 * 检查当前右键选中的内容是否在区域选择范围内,如果在不做操作
 * 不在取消区域选择,选中右键所在区域
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
 * 把数据变更为支持在grid里面使用的tree结构
 * @param data 原始数据
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
