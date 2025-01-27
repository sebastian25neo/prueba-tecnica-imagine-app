import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActionSheetController } from '@ionic/angular';
import { UserService } from '../../../services/UserService';
import Swal from 'sweetalert2'; // Importar SweetAlert2

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class ModalEditComponent {
  @Input() rowData: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveUser = new EventEmitter<any>();

  userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private actionSheetCtrl: ActionSheetController,
    private userService: UserService
  ) {
    this.userForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    // Populate form with existing data
    if (this.rowData) {
      this.userForm.patchValue({
        name: this.rowData.name,
        email: this.rowData.email,
      });
    }
  }

  isNameInvalid(): boolean {
    const nameControl = this.userForm.get('name');
    return nameControl
      ? nameControl.invalid && (nameControl.dirty || nameControl.touched)
      : false;
  }

  isEmailInvalid(): boolean {
    const emailControl = this.userForm.get('email');
    return emailControl
      ? emailControl.invalid && (emailControl.dirty || emailControl.touched)
      : false;
  }

  async onSubmit() {
    if (this.userForm.valid) {

      const id = this.rowData.id;

      const dataForm = {
        name: this.userForm.value.name,
        email: this.userForm.value.email,
      };

      // Mostrar modal de confirmación antes de enviar los datos
      const confirm = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas editar el usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, editar',
        cancelButtonText: 'Cancelar',
        backdrop: false
      });

      if (confirm.isConfirmed) {
        try {
          const respuesta = await this.userService.editUser(id, dataForm);
          
          if (respuesta.status === 'success') {
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'Usuario editado con éxito',
              backdrop: false, // Desactiva el fondo oscuro
            }).then(() => {
              // Limpiar los datos del formulario
              this.closeModal.emit();
              this.saveUser.emit({ ...this.rowData, ...dataForm });
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al editar el usuario',
              backdrop: false, // Desactiva el fondo oscuro
            });
          }
        } catch (error: any) {
          console.error('Error al enviar los datos:', error);

          // Verificación de la estructura del error
          if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response.data.message,
              backdrop: false, // Desactiva el fondo oscuro
            });
          } else {
            // Manejo de errores desconocidos o sin la estructura esperada
            Swal.fire({
              icon: 'error',
              title: 'Error desconocido',
              text: 'Hubo un problema al procesar la solicitud. Intente de nuevo más tarde.',
              backdrop: false, // Desactiva el fondo oscuro
            });
          }
        }
      } else {
        console.log('Acción cancelada por el usuario');
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores de validación
      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  canDismiss = async () => {
    if (this.userForm.dirty) {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Descartar cambios?',
        buttons: [
          {
            text: 'Descartar',
            role: 'confirm',
          },
          {
            text: 'Cancelar',
            role: 'cancel',
          },
        ],
      });

      actionSheet.present();

      const { role } = await actionSheet.onWillDismiss();

      return role === 'confirm';
    }
    return true;
  };
}
