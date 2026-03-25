import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../core/services/post';
import { SubjectResponse } from '../../shared/models/subject.model';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Navbar],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
})
export class CreatePost implements OnInit {
  private postService = inject(PostService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  subjects: SubjectResponse[] = [];
  loading = false;
  errorMessage = '';

  postForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    subjectId: ['', Validators.required],
    content: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.postService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load subjects', err)
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.postService.createPost({
      title: this.postForm.value.title,
      content: this.postForm.value.content,
      subjectId: Number(this.postForm.value.subjectId),
    }).subscribe({
      next: (post) => {
        this.loading = false;
        this.router.navigate(['/posts', post.id]);
      },
      error: (err) => {
        console.error('Failed to create post', err);
        this.loading = false;
        this.errorMessage = "Erreur lors de la création de l'article";
        this.cdr.detectChanges();
      }
    });
  }

  hasError(field: string, error: string): boolean {
    const f = this.postForm.get(field);
    return !!(f?.hasError(error) && f.touched);
  }

  goBack(): void {
    this.router.navigate(['/feed']);
  }
}