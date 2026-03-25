import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../core/services/post';
import { PostResponse, CommentResponse } from '../../shared/models/post.model';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Navbar, DatePipe],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.css',
})
export class PostDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  post: PostResponse | null = null;
  loading = true;
  submitting = false;
  errorMessage = '';

  commentForm: FormGroup = this.fb.group({
    content: ['', Validators.required]
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPost(id);
  }

  loadPost(id: number): void {
    this.postService.getById(id).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load post', err);
        this.errorMessage = "Impossible de charger l'article";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  submitComment(): void {
    if (this.commentForm.invalid || !this.post) return;
    this.submitting = true;

    this.postService.createComment(this.post.id, this.commentForm.value).subscribe({
      next: (comment) => {
        this.post!.comments = [...(this.post!.comments || []), comment];
        this.commentForm.reset();
        this.submitting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to post comment', err);
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/feed']);
  }
}