import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {
  ReactiveFormsModule,
} from '@angular/forms';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true, 
  imports: [CommonModule, IonicModule, ReactiveFormsModule, TableComponent],
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() tableTitle: string = '';
  @Input() columnsName: string[] = [];

  // Paginación
  currentPage: number = 1;
  pageSize: number = 5;

  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.currentPage * this.pageSize;
    return this.data.slice(startIndex, endIndex);
  }

  // Método para cambiar de página
  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get totalPages() {
    return Math.ceil(this.data.length / this.pageSize);
  }

  // Método para eliminar una fila
  deleteRow(id: number) {
    this.data = this.data.filter(row => row.id !== id);
  }

  // Método para editar una fila (esto es solo un ejemplo, puedes personalizarlo)
  editRow(id: number) {
    console.log('Editando fila con ID:', id);
  }
}
