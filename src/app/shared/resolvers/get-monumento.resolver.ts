import { inject } from '@angular/core';
import { MonumentoService } from '../services/monumento/monumento.service';
import { ActivatedRouteSnapshot } from '@angular/router';

export const getMonumento = (route: ActivatedRouteSnapshot) => {
    const monumentoService = inject(MonumentoService);;
    return monumentoService.getMonumento(route.paramMap.get('id') as unknown as number);
};