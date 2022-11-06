import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  readonly subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  public authForm = this.fb.group({
    login: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit(): void {
    if (this.authForm.valid) {
      // let login = this.authForm.value.login;
      // let password = this.authForm.value.password;
      console.log(this.authForm.value.login,this.authForm.value.password)

      this.subscription.add(
        this.authService.fetchToken(this.authForm.value.login??'', this.authForm.value.password??'').subscribe({
          next: x => {
            this.authService.authToken$.next(x.access_token);
            this.authService.authError$.next('');
            this.router.navigate(['']);
          },
          error: err => {
            this.authService.authToken$.next('');
            this.authService.authError$.next(err.message);
          },
        })
      );
    }
  }

  ngOnInit(): void {
  }

}
