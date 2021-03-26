import { RowDragEvent, RowNode } from '@ag-grid-community/core';
import { GridApi } from '@ag-grid-community/core/dist/cjs/gridApi';
import { Observable } from 'rxjs';
import { NgxGridTableComponent } from './table/ngx-grid-table.component';

export abstract class ServerTreeGrid {
  gridTable!: NgxGridTableComponent;

  potentialParent!: RowNode | undefined;

  static refreshRows(api: GridApi, rowsToRefresh: RowNode[]): void {
    api.refreshCells({
      rowNodes: rowsToRefresh,
      force: true,
    });
  }

  onDelete(nodes: RowNode[] | boolean): void {
    if (nodes && Array.isArray(nodes)) {
      const paths = nodes.map((node) => {
        return this.getPath(node).filter((id) => node.data.id !== id);
      });
      const cachePath = this.getParentPath(paths);
      this.gridTable?.api.clearFocusedCell();
      this.gridTable?.api.clearRangeSelection();
      cachePath.forEach((path) => {
        this.gridTable?.api.purgeServerSideCache(path);
      });
    }
  }

  /**
   * 找到最短路径列表
   */
  getParentPath(paths: string[][]): string[][] {
    let cachePath = [] as string[][];
    for (const path of paths) {
      /**
       * 如果包含顶级节点,直接返回[]
       */
      if (!path || !path.length) {
        return [[]];
      }
      const pathStr = path.join('/');
      const children = cachePath.some((cache) => pathStr.startsWith(cache.join('/')));
      if (!children) {
        cachePath = cachePath.filter((cache) => !cache.join('/').startsWith(pathStr));
        cachePath.push(path);
      }
    }
    return cachePath;
  }

  setPotentialParentForNode(api: GridApi, overNode?: RowNode): void {
    let newPotentialParent: RowNode | undefined;
    if (overNode) {
      newPotentialParent = overNode;
    }

    if (this.potentialParent === newPotentialParent) {
      return;
    }
    const rowsToRefresh = [] as RowNode[];
    if (this.potentialParent) {
      rowsToRefresh.push(this.potentialParent);
    }
    if (newPotentialParent) {
      rowsToRefresh.push(newPotentialParent);
    }
    this.potentialParent = newPotentialParent;
    ServerTreeGrid.refreshRows(api, rowsToRefresh);
  }

  onRowDragEnd = (event: RowDragEvent) => {
    const moveInfo = this.moveInfo(event.overNode, event.node, event);
    if (moveInfo === null) {
      this.setPotentialParentForNode(event.api);
      return;
    }
    const { ancestor, originalAncestor, movingNode, movePath, overPath } = moveInfo;
    this.move({
      ancestor,
      changeMode: 1,
      descendant: movingNode.data.id,
      originalAncestor,
    }).subscribe(
      () => {},
      (e) => {
        this.gridTable?.refresh();
      },
    );
    event.api.clearFocusedCell();
    if (!originalAncestor || !ancestor) {
      event.api.purgeServerSideCache();
    } else {
      const cachePath = this.getParentPath([movePath, overPath]);
      cachePath.forEach((path) => {
        event.api.purgeServerSideCache(path);
      });
    }
    this.setPotentialParentForNode(event.api);
  };

  /***
   * 移动节点到顶部
   */
  moveToRoot(node: RowNode): void {
    this.move({
      ancestor: 0,
      changeMode: 1,
      descendant: node.data.id,
      originalAncestor: node.parent && node.parent.data ? node.parent.data.id : 0,
    }).subscribe(
      () => {},
      (e) => {},
      () => {
        this.gridTable?.refresh();
      },
    );
  }

  /**
   *
   * @param overNode 目标节点
   * @param movingNode 当前移动的节点
   * @param event 事件
   */
  abstract moveInfo(
    overNode: RowNode,
    movingNode: RowNode,
    event: RowDragEvent,
  ): null | {
    overNode: RowNode;
    movingNode: RowNode;
    movePath: any[];
    overPath: any[];
    ancestor: any;
    originalAncestor: any;
  };

  onGridReady(event: any, gridTable: NgxGridTableComponent): void {
    this.gridTable = gridTable;
  }

  abstract move(value: any): Observable<any>;

  getPath(movingNode: RowNode, ids: string[] = []): string[] {
    if (movingNode.parent && movingNode.parent.data) {
      this.getPath(movingNode.parent, ids);
    }
    ids.push(movingNode.data.id);
    return ids;
  }
}
