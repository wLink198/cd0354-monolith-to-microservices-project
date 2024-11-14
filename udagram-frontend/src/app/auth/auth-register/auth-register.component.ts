import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { ModalController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss'],
})
export class AuthRegisterComponent implements OnInit {

  registerForm: FormGroup;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private modal: ModalController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      password_confirm: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+$')
      ]))
    }, { validators: this.passwordsMatch });
  }

  async onSubmit($event) {
    $event.preventDefault();

    if (!this.registerForm.valid) { return; }

    const newuser: User = {
      email: this.registerForm.controls.email.value,
      name: this.registerForm.controls.name.value
    };

    // Show loading spinner before the registration request
    const loading = await this.loadingController.create({
      message: 'Registering...',
      spinner: 'circles',
    });

    await loading.present();  // Show the loading spinner

    try {
      await this.auth.register(newuser, this.registerForm.controls.password.value);
      await loading.dismiss();
      this.modal.dismiss();  // Close the modal after successful registration
      location.href = window.location.origin
    } catch (e) {
      await loading.dismiss();  // Dismiss the spinner in case of error
      this.error = e.statusText || 'An error occurred. Please try again.';  // Show error message
      console.error('Registration failed:', e);
    }
  }

  passwordsMatch(group: FormGroup) {
    return group.controls.password.value === group.controls.password_confirm.value ? null : { passwordsMisMatch: true };
  }
}
