import {Inject, Injectable, Injector} from '@angular/core';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {_HttpClient} from '@delon/theme';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class  AuthService {

    constructor(private httpClient: _HttpClient,
                private injector: Injector,
                @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {

    }

    setToken(token: string): void {
        this.tokenService.set({
            token,
            expired: 3600000
        });
    }

    requestToken(username: string, password: string): Observable<any> {

        return this.httpClient.post(
            '/api/auth/login?_allow_anonymous=true',
            `username=${username}&password=${password}`,
            {},
            {headers: {'content-type': 'application/x-www-form-urlencoded'}}
        )
            .pipe(tap((res: any) => {
                this.setToken(res);
            }));
    }

}
