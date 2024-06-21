import { MonumentoDTO } from './../../shared/interaces/monumentoDTO.interface';
import { Component, inject, input, signal } from '@angular/core';;
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-monumento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monumento.component.html',
  styleUrl: './monumento.component.scss'
})
export class MonumentoComponent {
    monumento = signal<MonumentoDTO>(inject(ActivatedRoute).snapshot.data['monumento'] || []);
}
