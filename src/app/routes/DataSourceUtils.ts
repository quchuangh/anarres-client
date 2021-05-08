import { _HttpClient } from '@delon/theme';
import { _HttpHeaders } from '@delon/theme/src/services/http/http.client';
import { IGridDataSource, IPage, IRowQuery } from '@shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class DataSourceUtils {
  static rowQuery<T, R>(http: _HttpClient, queryUrl: string, queryMap: (t: T) => R): IGridDataSource<R> {
    return ((rowQuery: IRowQuery) => DataSourceUtils.asObs(http, queryUrl, rowQuery, queryMap)) as IGridDataSource<R>;
  }

  private static asObs<T, R>(http: _HttpClient, queryUrl: string, rowQuery: IRowQuery, queryMap: (t: T) => R): Observable<IPage<R>> {
    const headers: _HttpHeaders = { 'Content-Type': 'application/row-query' };
    return http
      .post(`${queryUrl}`, JSON.stringify(rowQuery), {}, { headers })
      .pipe(map((value) => value as IPage<T>))

      .pipe(
        map((page) => {
          return {
            records: page.records.map(queryMap),
            total: page.total,
            size: page.size,
            current: page.current,
            statistics: page.statistics,
          } as IPage<R>;
        }),
      );
  }

  static of<T>(query: (rowQuery: IRowQuery) => Observable<T[]>): IGridDataSource<T> {
    return ((rq) =>
      query(rq).pipe(
        map((records: T[]) => {
          return {
            records: records,
            total: records.length,
            size: records.length,
            current: 1,
          };
        }),
      )) as IGridDataSource<T>;
  }
}
