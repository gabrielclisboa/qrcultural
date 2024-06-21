import { inject } from '@angular/core';
import { CardServiceService } from '../services/card/card.service.service';

export const getCards = () => {
    const cardService = inject(CardServiceService);
    return cardService.getAllCards();
}