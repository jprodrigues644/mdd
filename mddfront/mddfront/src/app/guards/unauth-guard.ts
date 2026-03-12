import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const unauthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Vérifie si l'utilisateur est authentifié en cherchant un token dans localStorage
  const token = localStorage.getItem('token');

  if (token) {
    // Si un token existe → Utilisateur déjà connecté, rediriger vers /feed et refuser l'accès
    console.log('Déjà authentifié - Redirection vers /feed...');
    router.navigate(['/feed']);
    return true;
  }

  // Pas de token → Autoriser l'accès aux pages de login/register
  return true;
};

