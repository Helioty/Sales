import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/HTTP/base-service.service';
import { API_URL } from 'src/app/config/app.config.service';
import { ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultaEnderecoService {

  constructor(
    private baseService: BaseService
  ) { }

  getEnderecoByCep(cep: string): Promise<any> {
    const link = ENV.WS_PUBLIC + API_URL + 'consultaCEP/' + cep;

    return new Promise((resolve, reject) => {
      this.baseService.get(link).then((result: any) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }

}
