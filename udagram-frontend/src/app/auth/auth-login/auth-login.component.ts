import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { ModalController, LoadingController } from '@ionic/angular';

import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
})
export class AuthLoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private modal: ModalController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      password: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

  async onSubmit($event) {
    $event.preventDefault();

    if (!this.loginForm.valid) { return; }

    // Show loading spinner before the login request
    const loading = await this.loadingController.create({
      message: 'Logging in...',
      spinner: 'circles',
    });

    await loading.present();  // Show the loading spinner

    try {
      await this.auth.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
      await loading.dismiss();
      this.modal.dismiss();  // Close the modal after successful login
      location.href = window.location.origin
    } catch (e) {
      await loading.dismiss();  // Dismiss the spinner in case of error
      this.error = e.statusText || 'An error occurred. Please try again.';  // Show error message
      console.error('Login failed:', e);
    }
  }
}
