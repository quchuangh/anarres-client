import { _HttpClient } from '@delon/theme';
import { _HttpHeaders } from '@delon/theme/src/services/http/http.client';
import { IGridDataSource, IRowQuery } from '@shared';
import { map } from 'rxjs/operators';

export class DataSourceUtils {
  static create(http: _HttpClient, baseUrl: string, queryMap: (r: any) => any): IGridDataSource {
    const headers: _HttpHeaders = { 'Content-Type': 'application/row-query' };
    return {
      query: (rowQuery: IRowQuery) => {
        return http.post(`${baseUrl}/query`, JSON.stringify(rowQuery), {}, { headers }).pipe(map(queryMap));
      },
      map: queryMap,
    };
  }
}
