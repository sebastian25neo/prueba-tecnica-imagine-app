import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { ModalEditComponent } from 'src/app/modal-edit/modal-edit.component';
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

  deleteRow(id: number) {
    this.data = this.data.filter((row) => row.id !== id);
  }

  saveUserChanges(updatedUser: any) {
    const index = this.data.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updatedUser };
    }
  }

}
