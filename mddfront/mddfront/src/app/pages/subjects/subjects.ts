import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectService } from '../../core/services/subject';
import { SubjectResponse } from '../../shared/models/subject.model';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css',
})
export class Subjects implements OnInit {
  private subjectService = inject(SubjectService);
  private cdr = inject(ChangeDetectorRef);

  subjects: SubjectResponse[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.subjectService.getAll().subscribe({
      next: (data) => {
        this.subjects = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load subjects', err);
        this.errorMessage = 'Impossible de charger les thèmes';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleSubscription(subject: SubjectResponse): void {
    const action$ = subject.subscribed
      ? this.subjectService.unsubscribe(subject.id)
      : this.subjectService.subscribe(subject.id);

    action$.subscribe({
      next: (updated) => {
        subject.subscribed = !subject.subscribed; // ou updated.subscribed si le back le renvoie
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Subscription action failed', err)
    });
}
}