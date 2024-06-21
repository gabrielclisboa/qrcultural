import { Component, inject, signal } from '@angular/core';
import { MonumentoService } from '../../shared/services/monumento/monumento.service';
import { NotificacaoService } from '../../shared/services/notificacao/notificacao.service.service';
import { CardServiceService } from '../../shared/services/card/card.service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MonumentoDTO } from '../../shared/interaces/monumentoDTO.interface';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.scss'
})
export class EditarComponent {
  monumentoService = inject(MonumentoService);
  notificacaoService = inject(NotificacaoService);
  cardService = inject(CardServiceService);
  router = inject(Router);
  monumentForm: FormGroup;
  imagePreviews: { [key: string]: string | ArrayBuffer } = {};

  monumento = signal<MonumentoDTO>(inject(ActivatedRoute).snapshot.data['monumento'] || []);

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

  ngOnInit() {
    if (this.monumento()) {
      this.loadMonumentData();
    }
  }

  loadMonumentData() {
    this.monumentForm.patchValue({
      image: this.base64ToFile(this.monumento().imagemPrincipal,"ImagemCapa"),
      carousel1: this.base64ToFile(this.monumento().carrosel1,"Carrosel1"),
      carousel2: this.base64ToFile(this.monumento().carrosel2, "Carrosel2"),
      carousel3:this.base64ToFile( this.monumento().carrosel3, "Carrosel3"),
      history: this.monumento().contextoHistorico,
      address: this.monumento().endereco,
      entryFee: this.monumento().entrada,
      openingHours: this.monumento().horarioFuncionamento,
      titulo: this.monumento().card.titulo,
      descricao: this.monumento().card.descricao
    });

    this.imagePreviews = {
      image: this.base64ToBlobUrl('data:image/png;base64,'+ this.monumento().imagemPrincipal),
      carousel1: this.base64ToBlobUrl('data:image/png;base64,'+ this.monumento().carrosel1),
      carousel2: this.base64ToBlobUrl('data:image/png;base64,'+ this.monumento().carrosel2),
      carousel3: this.base64ToBlobUrl('data:image/png;base64,'+ this.monumento().carrosel3)
    };
  }

  base64ToFile(base64: string, filename: string): File {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: 'image/png' }); // Aqui definimos o tipo de arquivo como 'image/png', mas pode ser ajustado conforme o tipo real
  }
  
  

  base64ToBlobUrl(base64: string): string {
    const base64Prefix = 'base64,';
    const base64Index = base64.indexOf(base64Prefix) + base64Prefix.length;
    const base64Data = base64.substring(base64Index);
    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: 'image/png' });
    return URL.createObjectURL(blob);
  }


  onSubmit() {
    if (!this.monumentForm.valid) {
      return;
    }

    const monumentFormData = this.collectMonumentFormData();

    this.monumentoService.updateMonumento(monumentFormData).subscribe({
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

    formData.append('id',  this.monumento().id); 
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

    this.cardService.updateCard(cardFormData).subscribe({
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

    formData.append('id', this.monumento().card.id.toString());
    formData.append('descricao', formValues.descricao);
    formData.append('titulo', formValues.titulo);
    formData.append('imagem', formValues.image);
    formData.append('monumentoId', this.monumento().id);

    return formData;
  }

  private handleCardCreationSuccess(): void {
    this.notificacaoService.show({ text: "Edição realizada com sucesso", classname: 'bg-success text-light', delay: 2000 });
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
