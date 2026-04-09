import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { PostService } from '../../core/services/post';
import { PostListResponse } from '../../shared/models/post.model';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, Navbar, DatePipe],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed implements OnInit {
  private postService = inject(PostService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); 

  posts: PostListResponse[] = [];
  loading = true;
  errorMessage = '';
  sortAsc = false;

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(): void {
    this.postService.getFeed().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Failed to load feed', err);
        this.errorMessage = 'Impossible de charger les articles';
        this.loading = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  toggleSort(): void {
    this.sortAsc = !this.sortAsc;
    this.posts = [...this.posts].sort((a, b) => {
      const diff = new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
      return this.sortAsc ? diff : -diff;
    });
  }

  goToPost(id: number): void {
    this.router.navigate(['/posts', id]);
  }

  goToCreatePost(): void {
    this.router.navigate(['/create-post']);
  }
}