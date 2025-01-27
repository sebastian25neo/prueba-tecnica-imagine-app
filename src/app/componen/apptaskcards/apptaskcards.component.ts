import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-apptaskcards',
  templateUrl: './apptaskcards.component.html',
  styleUrls: ['./apptaskcards.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class ApptaskcardsComponent {
  @Input() tasks: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();
  taskList: any[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 2;
  totalPages!: number;

  get paginatedTasks() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tasks.slice(startIndex, endIndex);
  }

  ngOnChanges() {
    this.totalPages = Math.ceil(this.tasks.length / this.itemsPerPage);
  }

  editTask(task: any) {
    this.edit.emit(task);
  }

  deleteTask(id: number) {
    this.delete.emit(id);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getStatusClass(status: string) {
    switch (status.toLowerCase()) {
      case 'completado':
        return 'completed';
      case 'pendiente':
        return 'pending';
      case 'en progreso':
        return 'inProgress';
      case 'atrasada':
        return 'overdue';
      default:
        return '';
    }
  }
}
