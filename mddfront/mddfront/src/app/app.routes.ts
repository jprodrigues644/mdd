import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Feed } from './pages/feed/feed';
import { Profile } from './pages/profile/profile';
import { authGuard } from './guards/auth-guard';
import { PostDetail } from './pages/post-detail/post-detail';
import { Subjects } from './pages/subjects/subjects';
import { CreatePost } from './pages/create-post/create-post';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login }, 
  { path: 'register', component: Register }, 
  { path: 'feed', component: Feed, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'subjects', component: Subjects, canActivate: [authGuard] },
  { path: 'create-post', component: CreatePost, canActivate: [authGuard] },
  { path: 'posts/:id', component: PostDetail, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
