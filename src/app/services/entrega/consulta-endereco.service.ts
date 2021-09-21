import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { API_URL, ENV } from 'src/app/config/app.config.service';
import { BaseService } from '../http/base.service';

@Injectable({
  providedIn: 'root',
})
export class ConsultaEnderecoService {
  constructor(private readonly http: BaseService) {}

  getEnderecoByCep(cep: string): Observable<any> {
    const link = `${ENV.WS_PUBLIC}${API_URL}consultaCEP/${cep}`;
    return this.http.get<any>(link).pipe(take(1));
  }
}
