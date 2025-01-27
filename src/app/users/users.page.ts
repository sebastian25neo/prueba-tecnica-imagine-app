import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/UserService';
import { TableComponent } from 'src/app/componen/table/table.component';
import Swal from 'sweetalert2'; // Importar SweetAlert2

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, TableComponent],
})
export class UsersPage implements OnInit {
  userForm!: FormGroup;
  userData: any[] = [];

  tableColumnsName: string[]  = ['Nombre', 'Correo electrónico'];
  tableColumns = ['name', 'email'];
 
  

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
    await this.fetchUser();
  }

  async fetchUser(): Promise<void> {
    try {
      const response = await this.userService.getUsers();
      this.userData = Array.isArray(response) ? response : []; 

    } catch (error) {
      console.error("Error al obtener las reservaciones:", error);
    }
  }

  async onSubmit() {
    if (this.userForm.valid) {
      console.log('Usuario creado:', this.userForm.value);

      const dataForm = {
        name: this.userForm.value.name,
        email: this.userForm.value.email,
      };

      try {
        const respuesta = await this.userService.sendFormData(dataForm);
        // Verificar la respuesta y mostrar el swal
        if (respuesta.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Usuario creado con éxito',
            backdrop: false, // Desactiva el fondo oscuro
          }).then(() => {
            // Limpiar los datos del formulario
            this.userForm.reset(); // Usa reset en lugar de asignar vacío
            this.fetchUser();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al crear el usuario',
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
      console.log('Formulario inválido');

      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Métodos para validación en el template
  isNameInvalid() {
    const nameControl = this.userForm.get('name');
    return nameControl && nameControl.invalid && nameControl.touched;
  }

  isEmailInvalid() {
    const emailControl = this.userForm.get('email');
    return emailControl && emailControl.invalid && emailControl.touched;
  }

}
