import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UniqueNicknameValidator implements AsyncValidator {

  private httpClient: HttpClient = inject(HttpClient);

  validate(control: AbstractControl<string | null>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.httpClient.get<unknown[]>(`https://jsonplaceholder.typicode.com/users?username=${control.value}`)
      .pipe(
        map(users => {
          return users.length === 0
            ? null
            : { uniqueName: { isTaken: true } }
        }),
        catchError(() => of({ uniqueName: { unknown: true } }))
      )
  }
}
