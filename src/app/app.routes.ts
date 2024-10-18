import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Template-Driven Forms Playground',
    loadComponent:
      () => import('./playgrounds/template-forms/template-forms-page/template-forms-page.component')
        .then(m => m.TemplateFormsPageComponent)   
  },
  {
    path: 'reactive-forms',
    title: 'Reactive Forms Playground',
    loadComponent:
      () => import('./playgrounds/reactive-forms/reactive-forms-page/reactive-forms-page.component')
        .then(m => m.ReactiveFormsPageComponent)   
  }
];