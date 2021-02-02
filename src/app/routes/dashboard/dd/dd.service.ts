import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DDWidget } from './dd.types';
import { DDWidgetData } from './widgets/widget.data';

@Injectable({ providedIn: 'root' })
export class DashboardDDService {
  private _widgets!: DDWidget[];

  get widgets(): Observable<DDWidget[]> {
    return this._widgets ? of(this._widgets) : this.getByHttp();
  }

  get save(): Observable<any> {
    return this.http.post('/dd', this._widgets);
  }

  constructor(private http: _HttpClient) {}

  private getByHttp(): Observable<DDWidget[]> {
    return this.http.get('/dd').pipe(
      map((list: DDWidget[]) => {
        this._widgets = list.map((item) => ({
          ...DDWidgetData[item.name!],
          ...item,
        }));
        return this._widgets.filter((w) => w.enabled);
      }),
    );
  }
}
