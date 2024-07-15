import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
 selector: 'app-login',
 standalone: true,
 imports: [FormsModule],
 templateUrl: './login.component.html',
 styleUrl: './login.component.scss'
})
export class LoginComponent {
 formData = {
   userName: '',
   email: '',
   password: '',
   address: ''
 };

 flipCard = false;
 errorMessage: string | null = null;
 private userService = inject(UserService);

 constructor() { }

 submitSignUp() {
   console.log("hi", this.formData);
   // Add your validation logic here
   //console.log("hhh",this.formData); // You can access form data here and perform any checks
   this.userService
     .signup(this.formData)
     .subscribe((data) => {
       console.log(data);
       this.userService.token = data.token;
     });
 }

 submitLogin() {
   console.log("hi", this.formData.email, this.formData.password);
   // Add your validation logic here
   //console.log("hhh",this.formData); // You can access form data here and perform any checks
   this.userService
     .login({ email: this.formData.email, password: this.formData.password })
     .subscribe((data) => {
       console.log(data);
       this.userService.token = data.token;
       this.flipCard = false;
       this.errorMessage = null;
     },
       (error: HttpErrorResponse) => {
         // Assuming the error response indicates the user was not found
         if (error.status === 401) {
           this.errorMessage = error.error.message; // Display the server's error message
           this.flipCard = true; // Set flip flag on error
         } else {
           console.error("Login failed:", error);
           this.errorMessage = 'An unexpected error occurred. Please try again.'; // Generic error message
         }
       }
     );
 }

 register() {
   this.flipCard = true;
 }
}

// import { Component, OnInit, inject } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
// import { UserService } from '../../services/user.service';
// import { HttpErrorResponse } from '@angular/common/http';
// import { NgIf } from '@angular/common';
// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule,ReactiveFormsModule,NgIf],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss'
// })
// export class LoginComponent implements OnInit{
//   formData = {
//     userName: '',
//     email: '',
//     password: '',
//     address: ''
//   };

//   flipCard = false;
//   errorMessage: string | null = null;
//   private userService = inject(UserService);

//   //constructor() { }
//   ////

//   loginForm!: FormGroup;
//   signupForm!: FormGroup;

//   constructor(private fb: FormBuilder) { }

//   ngOnInit(): void {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [
//         Validators.required,
//         Validators.minLength(8),
//         Validators.maxLength(12),
//         Validators.pattern(/^[a-zA-Z0-9]+$/)
//       ]]
//     });
//     this.signupForm = this.fb.group({
//       userName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [
//         Validators.required,
//         Validators.minLength(8),
//         Validators.maxLength(12),
//         Validators.pattern(/^[a-zA-Z0-9]+$/)
//       ]],
//       address: ['', Validators.required]
//     });
//   }

//   /////
//   submitSignUp() {
//     //if (this.signupForm.invalid) {
//     //  this.signupForm.markAllAsTouched(); // Mark all fields as touched to trigger validation
//     //  return;
//     //}
//     console.log("hi", this.formData);
//     // Add your validation logic here
//     //console.log("hhh",this.formData); // You can access form data here and perform any checks
//     this.userService
//       .signup(this.formData)
//       .subscribe((data) => {
//         console.log(data);
//         this.userService.token = data.token;
//       });
//   }

//   submitLogin() {
//     //if (this.loginForm.invalid) {
//     //  this.loginForm.markAllAsTouched(); // Mark all fields as touched to trigger validation
//     //  return;
//     //}
//     console.log("hi", this.formData.email, this.formData.password);
//     // Add your validation logic here
//     //console.log("hhh",this.formData); // You can access form data here and perform any checks
//     this.userService
//       .login({ email: this.formData.email, password: this.formData.password })
//       .subscribe((data) => {
//         console.log(data);
//         this.userService.token = data.token;
//         this.flipCard = false;
//         this.errorMessage = null;
//       },
//         (error: HttpErrorResponse) => {
//           // Assuming the error response indicates the user was not found
//           if (error.status === 401) {
//             this.errorMessage = error.error.message; // Display the server's error message
//             this.flipCard = true; // Set flip flag on error
//           } else {
//             console.error("Login failed:", error);
//             this.errorMessage = 'An unexpected error occurred. Please try again.'; // Generic error message
//           }
//         }
//       );
//   }

//   register() {
//     this.flipCard = true;
//   }
//   get email() {
//     return this.loginForm.get('email');
//   }

//   get password() {
//     return this.loginForm.get('password');
//   }

//   get userName() {
//     return this.signupForm.get('userName');
//   }

//   get address() {
//     return this.signupForm.get('address');
//   }
  
// }

