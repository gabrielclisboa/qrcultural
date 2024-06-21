import { CardServiceService } from './../../shared/services/card/card.service.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Monumento } from '../../shared/interaces/monumento.interface';
import { MonumentoService } from '../../shared/services/monumento/monumento.service';
import { Router, RouterModule } from '@angular/router';
import { NotificacaoService } from '../../shared/services/notificacao/notificacao.service.service';

@Component({
  selector: 'app-cadastrar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.scss'
})
export class CadastrarComponent {
  monumentoService = inject(MonumentoService);
  notificacaoService = inject(NotificacaoService);
  cardService = inject(CardServiceService);
  router = inject(Router);
  monumentForm: FormGroup;
  imagePreviews: { [key: string]: string | ArrayBuffer } = {};

  constructor(private fb: FormBuilder) {
    this.monumentForm = this.fb.group({
      image: [null, Validators.required],
      carousel1: [null, Validators.required],
      carousel2: [null, Validators.required],
      carousel3: [null, Validators.required],
      history: ['', Validators.required],
      address: ['', Validators.required],
      entryFee: ['', Validators.required],
      openingHours: ['', Validators.required],
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
    });
  }
  onSubmit() {
    if (!this.monumentForm.valid) {
      return; // Se o formulário não for válido, sai da função
    }

    const monumentFormData = this.collectMonumentFormData();

    this.monumentoService.createMonumento(monumentFormData).subscribe({
      next: (response) => {
        this.handleMonumentCreationSuccess(response);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  private collectMonumentFormData(): FormData {
    const formValues = this.monumentForm.value;
    const formData = new FormData();

    formData.append('id',  "0"); 
    formData.append('history', formValues.history);
    formData.append('address', formValues.address);
    formData.append('openingHours', formValues.openingHours);
    formData.append('entryFee', formValues.entryFee);
    formData.append('carousel1', formValues.carousel1);
    formData.append('carousel2', formValues.carousel2);
    formData.append('carousel3', formValues.carousel3);
    formData.append('image', formValues.image);

    return formData;
  }

  private handleMonumentCreationSuccess(response: any): void {
    const cardFormData = this.prepareCardFormData(response);

    this.cardService.createCard(cardFormData).subscribe({
      next: (response) => {
        this.handleCardCreationSuccess();
      },
      error: (error) => {
        console.error('Error creating card:', error);
      }
    });
  }

  private prepareCardFormData(response: any): FormData {
    const formValues = this.monumentForm.value;
    const formData = new FormData();

    formData.append('descricao', formValues.descricao);
    formData.append('titulo', formValues.titulo);
    formData.append('imagem', formValues.image);
    formData.append('monumentoId', response.id);

    return formData;
  }

  private handleCardCreationSuccess(): void {
    this.notificacaoService.show({ text: "Cadastro Realizado com sucesso", classname: 'bg-success text-light', delay: 2000 });
    this.router.navigate(['/']);
  }

  onFileChange(event: any, field: string) {
    const file = event.target.files?.[0];
    if (file) {
      this.monumentForm.patchValue({
        [field]: file
      });
      this.monumentForm.get(field)?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.imagePreviews[field] = reader.result;
        }
      };
      reader.readAsDataURL(file);
      console.log(this.monumentForm);
    }
  }
  removeImage(field: string) {
    this.monumentForm.patchValue({
      [field]: null
    });
    this.monumentForm.get(field)?.updateValueAndValidity();
    delete this.imagePreviews[field];

    const inputElement = document.getElementById(field) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }
}
