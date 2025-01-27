import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { ModalEditComponent } from 'src/app/componen/modal-edit/modal-edit.component';
import { UserService } from '../../../services/UserService';
import Swal from 'sweetalert2'; // Importar SweetAlert2
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, TableComponent, ModalEditComponent ],
})
export class TableComponent {


  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() tableTitle: string = '';
  @Input() columnsName: string[] = [];

  @ViewChild('editModal') modal!: IonModal;
  

  constructor(
    private userService: UserService
  ) {}

  isModalOpen = false;
  selectedRow: any;

  openEditModal(row: any) {
    this.selectedRow = row;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Paginación
  currentPage: number = 1;
  pageSize: number = 5;


  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.currentPage * this.pageSize;
    return this.data.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.data.length / this.pageSize);
  }

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  async deleteRow(id: number) {
    // Mostrar modal de confirmación antes de eliminar
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      backdrop: false, // Desactiva el fondo oscuro
    });
  
    if (confirm.isConfirmed) {
      try {
        // Llamada al servicio para eliminar el usuario
        const respuesta = await this.userService.deleteUser(id);
        
        if (respuesta.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Usuario eliminado con éxito',
            backdrop: false, // Desactiva el fondo oscuro
          }).then(() => {
            // Eliminar el usuario de la lista
            this.data = this.data.filter((row) => row.id !== id);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al eliminar el usuario',
            backdrop: false, // Desactiva el fondo oscuro
          });
        }
      } catch (error: any) {
        console.error('Error al eliminar el usuario:', error);
  
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
  }
  

  saveUserChanges(updatedUser: any) {
    const index = this.data.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updatedUser };
    }
  }

}
