import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-resipe',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatStepperModule, ReactiveFormsModule],
  templateUrl: './add-resipe.component.html',
  styleUrls: ['./add-resipe.component.scss']
})
export class AddResipeComponent implements OnInit {

  Difficulty = [1, 2, 3, 4, 5];
  private recipeService = inject(RecipeService);
  private userService = inject(UserService);
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  forthFormGroup!: FormGroup;
  images: File[] = [];
  imageUrls: string[] = [];
  textareaArray: string[] = [];
  userId: any;

  constructor(private router: Router, private formBuilder: FormBuilder, private renderer: Renderer2, private http: HttpClient) { }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      recipeName: ['', Validators.required],
      category: ['', Validators.required],
      recipeDescription: [''],
      hours: [0, Validators.required],
      minutes: [30, Validators.required],
      difficulty: ['', Validators.required],
      dishes: [0, Validators.required],
      isPrivate: [false]
    });
    this.secondFormGroup = this.formBuilder.group({
      amount: [0, Validators.required],
      ingredient: ['', Validators.required]
    });
    this.thirdFormGroup = this.formBuilder.group({
      // Define controls for third form group
    });
    this.forthFormGroup = this.formBuilder.group({
      // Define controls for forth form group
    });
  }

  addImage() {
    const fileInput = this.renderer.selectRootElement('#fileInput', true);
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.images.push(input.files[0]);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrls.push(e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }



  onSubmit(): void {
    let flag = true;
    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid && this.forthFormGroup.valid) {
      const textareas = document.querySelectorAll('textarea');
      this.textareaArray = [];
      textareas.forEach((textarea: HTMLTextAreaElement) => {
        this.textareaArray.push(textarea.value);
      });
      const ingredientForms = document.querySelectorAll('.ingredientForm');
      const ingredientsArray: any[] = [];
      const firstIngredient = { ...this.secondFormGroup.value };
      ingredientForms.forEach((ingredientForm) => {
        const layerNameInput = ingredientForm.querySelector('input[placeholder^="Ingredients for"]') as HTMLInputElement;
        const layerName = layerNameInput ? layerNameInput.value : '';
        const addIngredientDivs = ingredientForm.querySelectorAll('.addIngredient');
        const ingredients: { amount: number, ingredient: string }[] = [];
        addIngredientDivs.forEach((div) => {
          const amountInput = div.querySelector('input[type="number"]') as HTMLInputElement;
          const ingredientInput = div.querySelector('input[placeholder="Ingredient"]') as HTMLInputElement;
          if (ingredientsArray.length === 0 && flag) {
            ingredients.push(firstIngredient);
            flag = false;
          }
          if (amountInput && ingredientInput) {
            ingredients.push({
              amount: parseFloat(amountInput.value),
              ingredient: ingredientInput.value
            });
          }
        });
        ingredientsArray.push({
          layerDescription: layerName,
          ingredients: ingredients
        });
      });
      //const token = localStorage.getItem('mytoken');
      //this.userId = this.userService.getUserIdFromToken(token);

      const token: string | null = localStorage.getItem('mytoken'); // Replace with actual token retrieval logic
      if (token) {
        this.userId = this.userService.getUserIdFromToken(token);
        console.log("userId",this.userId);

        console.log('User ID:', this.userId);
      } else {
        console.error('Token is null');
      }

      const formData = {
        recipeName: this.firstFormGroup.value.recipeName,
        categoryName: this.firstFormGroup.value.category,
        description: this.firstFormGroup.value.recipeDescription,
        preparationTime: (this.firstFormGroup.value.hours * 60) + this.firstFormGroup.value.minutes,
        difficultyLevel: this.firstFormGroup.value.difficulty,
        dishesAmount: this.firstFormGroup.value.dishes,
        isPrivate: this.firstFormGroup.value.isPrivate,
        addedByuser: this.userId,
        layers: ingredientsArray,
        preparationSteps: this.textareaArray,
        recipeImages: []  // Include recipeImages as an empty array
      };
      this.recipeService.addRecipe(formData).subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.error('Error adding recipe:', error);
        }
      );
      console.log("details:", formData);
    } else {
      console.log('One or more forms are invalid');
    }
  }






  createprepDiv(event: Event) {
    const previousButton = event.target as HTMLElement;
    this.renderer.setStyle(previousButton, 'display', 'none');

    const pNumber = this.renderer.createElement('p');
    const stepNumber = document.querySelectorAll('.prepStep').length + 1;
    const text = this.renderer.createText(stepNumber.toString());
    this.renderer.appendChild(pNumber, text);

    const divElement = this.renderer.createElement('div');
    this.renderer.addClass(divElement, 'prepStep');

    const textArea = this.renderer.createElement('textarea');
    this.renderer.setAttribute(textArea, 'placeholder', 'preparation description');

    const addButton = this.renderer.createElement('button');
    const addButtonText = this.renderer.createText('+');
    this.renderer.appendChild(addButton, addButtonText);
    this.renderer.listen(addButton, 'click', (event) => this.createprepDiv(event));

    this.renderer.appendChild(divElement, pNumber);
    this.renderer.appendChild(divElement, textArea);
    this.renderer.appendChild(divElement, addButton);

    const stepsForm = this.renderer.selectRootElement('#prepStepForm', true);
    this.renderer.appendChild(stepsForm, divElement);
  }

  createDiv(event: Event) {
    const previousButton = event.target as HTMLElement;
    this.renderer.setStyle(previousButton, 'display', 'none');

    const divElement = this.renderer.createElement('div');
    this.renderer.addClass(divElement, 'addIngredient');

    const numberInput = this.renderer.createElement('input');
    this.renderer.setAttribute(numberInput, 'type', 'number');
    this.renderer.setAttribute(numberInput, 'value', '0');

    const ingredientInput = this.renderer.createElement('input');
    this.renderer.setAttribute(ingredientInput, 'placeholder', 'Ingredient');

    const addButton = this.renderer.createElement('button');
    const addButtonText = this.renderer.createText('+');
    this.renderer.appendChild(addButton, addButtonText);
    this.renderer.listen(addButton, 'click', (event) => this.createDiv(event));

    this.renderer.appendChild(divElement, numberInput);
    this.renderer.appendChild(divElement, ingredientInput);
    this.renderer.appendChild(divElement, addButton);

    const ingredientForm = previousButton.closest('.ingredientForm');
    if (ingredientForm) {
      const addLayerButton = ingredientForm.querySelector('.addLayer');
      if (addLayerButton) {
        ingredientForm.insertBefore(divElement, addLayerButton);
      } else {
        this.renderer.appendChild(ingredientForm, divElement);
      }
    }
  }

  createNewLayer(event: Event) {
    console.log("hi");
    const previousButton = event.target as HTMLElement;
    this.renderer.setStyle(previousButton, 'display', 'none');

    const divElement = this.renderer.createElement('div');
    this.renderer.addClass(divElement, 'ingredientForm');

    const input = this.renderer.createElement('input');
    this.renderer.setAttribute(input, 'placeholder', 'Ingredients for ');

    const amountTitle = this.renderer.createElement('p');
    const amountText = this.renderer.createText('amount');
    this.renderer.addClass(amountTitle, 'amountTitle');
    this.renderer.appendChild(amountTitle, amountText);

    const addIngredientDiv = this.renderer.createElement('div');
    this.renderer.addClass(addIngredientDiv, 'addIngredient');
    this.renderer.setAttribute(addIngredientDiv, 'id', 'addIngredient');

    const numberInput = this.renderer.createElement('input');
    this.renderer.setAttribute(numberInput, 'type', 'number');
    this.renderer.setAttribute(numberInput, 'value', '0');

    const ingredientInput = this.renderer.createElement('input');
    this.renderer.setAttribute(ingredientInput, 'placeholder', 'Ingredient');

    const addButton = this.renderer.createElement('button');
    const addButtonText = this.renderer.createText('+');
    this.renderer.appendChild(addButton, addButtonText);
    this.renderer.listen(addButton, 'click', (event) => this.createDiv(event));

    this.renderer.appendChild(addIngredientDiv, numberInput);
    this.renderer.appendChild(addIngredientDiv, ingredientInput);
    this.renderer.appendChild(addIngredientDiv, addButton);

    this.renderer.appendChild(divElement, input);
    this.renderer.appendChild(divElement, amountTitle);
    this.renderer.appendChild(divElement, addIngredientDiv);

    const addLayerButton = this.renderer.createElement('button');
    const addLayerButtonText = this.renderer.createText('add layer');
    this.renderer.addClass(addLayerButton, 'addLayer');
    this.renderer.appendChild(addLayerButton, addLayerButtonText);
    this.renderer.listen(addLayerButton, 'click', (event) => this.createNewLayer(event));

    this.renderer.appendChild(divElement, addLayerButton);

    const parentContainer = this.renderer.selectRootElement('#allingredient', true);
    this.renderer.appendChild(parentContainer, divElement);
  }
}

// import { Component, OnInit, Renderer2, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatStepperModule } from '@angular/material/stepper';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
// import { RecipeService } from '../../services/recipe.service';
// import { HttpClient } from '@angular/common/http';
// import { UserService } from '../../services/user.service';
// import { Router } from '@angular/router';
// import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
// import { MatDialog } from '@angular/material/dialog';

// @Component({
//   selector: 'app-add-resipe',
//   standalone: true,
//   imports: [CommonModule, MatSlideToggleModule, MatStepperModule, ReactiveFormsModule],
//   templateUrl: './add-resipe.component.html',
//   styleUrls: ['./add-resipe.component.scss']
// })
// export class AddResipeComponent implements OnInit {

//   Difficulty = [1, 2, 3, 4, 5];
//   private recipeService = inject(RecipeService);
//   private userService = inject(UserService);
//   firstFormGroup!: FormGroup;
//   secondFormGroup!: FormGroup;
//   thirdFormGroup!: FormGroup;
//   forthFormGroup!: FormGroup;
//   images: File[] = [];
//   imageUrls: string[] = [];
//   textareaArray: string[] = [];
//   userId: any;

//   constructor(private router: Router, private formBuilder: FormBuilder, private renderer: Renderer2, private http: HttpClient, private dialog: MatDialog) { }

//   ngOnInit(): void {
//     this.firstFormGroup = this.formBuilder.group({
//       recipeName: ['', [Validators.required, Validators.maxLength(20)]],
//       category: ['', Validators.required],
//       recipeDescription: ['', [Validators.required]],//Validators.maxLength(25),,  this.descriptionPatternValidator()
//       hours: [0, Validators.required],
//       minutes: [30, Validators.required],
//       difficulty: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
//       dishes: [0, Validators.required],
//       isPrivate: [false, Validators.required]
//     });
//     this.secondFormGroup = this.formBuilder.group({
//       amount: [0, Validators.required],
//       ingredient: ['', Validators.required]
//     });
//     this.thirdFormGroup = this.formBuilder.group({
//       prepStep: ['', Validators.required]
//     });
//     this.forthFormGroup = this.formBuilder.group({
//       // Define controls for forth form group
//     });
//   }

//   descriptionPatternValidator() {
//     return (control: AbstractControl): { [key: string]: any } | null => {
//       const pattern = /^[a-zA-Zא-ת]+$/;
//       const valid = pattern.test(control.value);
//       return valid ? null : { 'pattern': { value: control.value } };
//     };
//   }

//   addImage() {
//     const fileInput = this.renderer.selectRootElement('#fileInput', true);
//     fileInput.click();
//   }

//   onFileSelected(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files[0]) {
//       this.images.push(input.files[0]);

//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         this.imageUrls.push(e.target.result);
//       };
//       reader.readAsDataURL(input.files[0]);
//     }
//   }



//   onSubmit(): void {
//     const errors: string[] = [];
//     this.dialog.open(ErrorDialogComponent, {
//       data: { errors: errors }
//     });
//     let flag = true;
//     if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid && this.forthFormGroup.valid) {
//       const textareas = document.querySelectorAll('textarea');
//       this.textareaArray = [];
//       textareas.forEach((textarea: HTMLTextAreaElement) => {
//         this.textareaArray.push(textarea.value);
//       });
//       const ingredientForms = document.querySelectorAll('.ingredientForm');
//       const ingredientsArray: any[] = [];
//       const firstIngredient = { ...this.secondFormGroup.value };
//       ingredientForms.forEach((ingredientForm) => {
//         const layerNameInput = ingredientForm.querySelector('input[placeholder^="Ingredients for"]') as HTMLInputElement;
//         const layerName = layerNameInput ? layerNameInput.value : '';
//         const addIngredientDivs = ingredientForm.querySelectorAll('.addIngredient');
//         const ingredients: { amount: number, ingredient: string }[] = [];
//         addIngredientDivs.forEach((div) => {
//           const amountInput = div.querySelector('input[type="number"]') as HTMLInputElement;
//           const ingredientInput = div.querySelector('input[placeholder="Ingredient"]') as HTMLInputElement;
//           if (ingredientsArray.length === 0 && flag) {
//             ingredients.push(firstIngredient);
//             flag = false;
//           }
//           if (amountInput && ingredientInput) {
//             ingredients.push({
//               amount: parseFloat(amountInput.value),
//               ingredient: ingredientInput.value
//             });
//           }
//         });
//         ingredientsArray.push({
//           layerDescription: layerName,
//           ingredients: ingredients
//         });
//       });
//       //const token = localStorage.getItem('mytoken');
//       //this.userId = this.userService.getUserIdFromToken(token);

//       const token: string | null = localStorage.getItem('mytoken'); // Replace with actual token retrieval logic
//       if (token) {
//         this.userId = this.userService.getUserIdFromToken(token);
//         console.log("userId", this.userId);

//         console.log('User ID:', this.userId);
//       } else {
//         console.error('Token is null');
//       }

//       const formData = {
//         recipeName: this.firstFormGroup.value.recipeName,
//         categoryName: this.firstFormGroup.value.category,
//         description: this.firstFormGroup.value.recipeDescription,
//         preparationTime: (this.firstFormGroup.value.hours * 60) + this.firstFormGroup.value.minutes,
//         difficultyLevel: this.firstFormGroup.value.difficulty,
//         dishesAmount: this.firstFormGroup.value.dishes,
//         isPrivate: this.firstFormGroup.value.isPrivate,
//         addedByuser: this.userId,
//         layers: ingredientsArray,
//         preparationSteps: this.textareaArray,
//         recipeImages: []  // Include recipeImages as an empty array
//       };
//       this.recipeService.addRecipe(formData).subscribe(
//         (data) => {
//           console.log(data);
//         },
//         (error) => {
//           console.error('Error adding recipe:', error);
//         }
//       );
//       console.log("details:", formData);
//     } else {
//       console.log('One or more forms are invalid');
//     }
//   }


//   // onSubmit(): void {
//   //   let flag = true;
//   //   if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid && this.forthFormGroup.valid) {
//   //     // Existing submission logic...
//   //   } else {
//   //     // Collect error messages
//   //     const errors: string[] = [];

//   //     if (this.firstFormGroup.invalid) {
//   //       Object.keys(this.firstFormGroup.controls).forEach(key => {
//   //         const controlErrors = this.firstFormGroup.get(key)?.errors;
//   //         if (controlErrors) {
//   //           Object.keys(controlErrors).forEach(errorKey => {
//   //             errors.push(`First Form - ${key}: ${errorKey}`);
//   //           });
//   //         }
//   //       });
//   //     }
//   //     if (this.secondFormGroup.invalid) {
//   //       Object.keys(this.secondFormGroup.controls).forEach(key => {
//   //         const controlErrors = this.secondFormGroup.get(key)?.errors;
//   //         if (controlErrors) {
//   //           Object.keys(controlErrors).forEach(errorKey => {
//   //             errors.push(`Second Form - ${key}: ${errorKey}`);
//   //           });
//   //         }
//   //       });
//   //     }
//   //     if (this.thirdFormGroup.invalid) {
//   //       Object.keys(this.thirdFormGroup.controls).forEach(key => {
//   //         const controlErrors = this.thirdFormGroup.get(key)?.errors;
//   //         if (controlErrors) {
//   //           Object.keys(controlErrors).forEach(errorKey => {
//   //             errors.push(`Third Form - ${key}: ${errorKey}`);
//   //           });
//   //         }
//   //       });
//   //     }
//   //     if (this.forthFormGroup.invalid) {
//   //       Object.keys(this.forthFormGroup.controls).forEach(key => {
//   //         const controlErrors = this.forthFormGroup.get(key)?.errors;
//   //         if (controlErrors) {
//   //           Object.keys(controlErrors).forEach(errorKey => {
//   //             errors.push(`Forth Form - ${key}: ${errorKey}`);
//   //           });
//   //         }
//   //       });
//   //     }

//   //     // Open error dialog
//   //     this.dialog.open(ErrorDialogComponent, {
//   //       data: { errors: errors }
//   //     });
//   //   }
//   // }

//   // openDialog(): void {
//   //     const dialogRef = this.dialog.open(ValidationErrorsDialog, {
//   //       width: '250px',
//   //       data: { 
//   //         errors: this.getFormValidationErrors()
//   //       }
//   //     });
//   //   }

//   //   getFormValidationErrors() {
//   //     const errors = [];
//   //     Object.keys(this.firstFormGroup.controls).forEach(key => {
//   //       const controlErrors = this.firstFormGroup.get(key)?.errors;
//   //       if (controlErrors) {
//   //         Object.keys(controlErrors).forEach(keyError => {
//   //           errors.push({
//   //             controlName: key,
//   //             errorName: keyError,
//   //             errorValue: controlErrors[keyError]
//   //           });
//   //         });
//   //       }
//   //     });
//   //     return errors;
//   //   }





//   createprepDiv(event: Event) {
//     const previousButton = event.target as HTMLElement;
//     this.renderer.setStyle(previousButton, 'display', 'none');

//     const pNumber = this.renderer.createElement('p');
//     const stepNumber = document.querySelectorAll('.prepStep').length + 1;
//     const text = this.renderer.createText(stepNumber.toString());
//     this.renderer.appendChild(pNumber, text);

//     const divElement = this.renderer.createElement('div');
//     this.renderer.addClass(divElement, 'prepStep');

//     const textArea = this.renderer.createElement('textarea');
//     this.renderer.setAttribute(textArea, 'placeholder', 'preparation description');

//     const addButton = this.renderer.createElement('button');
//     const addButtonText = this.renderer.createText('+');
//     this.renderer.appendChild(addButton, addButtonText);
//     this.renderer.listen(addButton, 'click', (event) => this.createprepDiv(event));

//     this.renderer.appendChild(divElement, pNumber);
//     this.renderer.appendChild(divElement, textArea);
//     this.renderer.appendChild(divElement, addButton);

//     const stepsForm = this.renderer.selectRootElement('#prepStepForm', true);
//     this.renderer.appendChild(stepsForm, divElement);
//   }

//   createDiv(event: Event) {
//     const previousButton = event.target as HTMLElement;
//     this.renderer.setStyle(previousButton, 'display', 'none');

//     const divElement = this.renderer.createElement('div');
//     this.renderer.addClass(divElement, 'addIngredient');

//     const numberInput = this.renderer.createElement('input');
//     this.renderer.setAttribute(numberInput, 'type', 'number');
//     this.renderer.setAttribute(numberInput, 'value', '0');

//     const ingredientInput = this.renderer.createElement('input');
//     this.renderer.setAttribute(ingredientInput, 'placeholder', 'Ingredient');

//     const addButton = this.renderer.createElement('button');
//     const addButtonText = this.renderer.createText('+');
//     this.renderer.appendChild(addButton, addButtonText);
//     this.renderer.listen(addButton, 'click', (event) => this.createDiv(event));

//     this.renderer.appendChild(divElement, numberInput);
//     this.renderer.appendChild(divElement, ingredientInput);
//     this.renderer.appendChild(divElement, addButton);

//     const ingredientForm = previousButton.closest('.ingredientForm');
//     if (ingredientForm) {
//       const addLayerButton = ingredientForm.querySelector('.addLayer');
//       if (addLayerButton) {
//         ingredientForm.insertBefore(divElement, addLayerButton);
//       } else {
//         this.renderer.appendChild(ingredientForm, divElement);
//       }
//     }
//   }

//   createNewLayer(event: Event) {
//     console.log("hi");
//     const previousButton = event.target as HTMLElement;
//     this.renderer.setStyle(previousButton, 'display', 'none');

//     const divElement = this.renderer.createElement('div');
//     this.renderer.addClass(divElement, 'ingredientForm');

//     const input = this.renderer.createElement('input');
//     this.renderer.setAttribute(input, 'placeholder', 'Ingredients for ');

//     const amountTitle = this.renderer.createElement('p');
//     const amountText = this.renderer.createText('amount');
//     this.renderer.addClass(amountTitle, 'amountTitle');
//     this.renderer.appendChild(amountTitle, amountText);

//     const addIngredientDiv = this.renderer.createElement('div');
//     this.renderer.addClass(addIngredientDiv, 'addIngredient');
//     this.renderer.setAttribute(addIngredientDiv, 'id', 'addIngredient');

//     const numberInput = this.renderer.createElement('input');
//     this.renderer.setAttribute(numberInput, 'type', 'number');
//     this.renderer.setAttribute(numberInput, 'value', '0');

//     const ingredientInput = this.renderer.createElement('input');
//     this.renderer.setAttribute(ingredientInput, 'placeholder', 'Ingredient');

//     const addButton = this.renderer.createElement('button');
//     const addButtonText = this.renderer.createText('+');
//     this.renderer.appendChild(addButton, addButtonText);
//     this.renderer.listen(addButton, 'click', (event) => this.createDiv(event));

//     this.renderer.appendChild(addIngredientDiv, numberInput);
//     this.renderer.appendChild(addIngredientDiv, ingredientInput);
//     this.renderer.appendChild(addIngredientDiv, addButton);

//     this.renderer.appendChild(divElement, input);
//     this.renderer.appendChild(divElement, amountTitle);
//     this.renderer.appendChild(divElement, addIngredientDiv);

//     const addLayerButton = this.renderer.createElement('button');
//     const addLayerButtonText = this.renderer.createText('add layer');
//     this.renderer.addClass(addLayerButton, 'addLayer');
//     this.renderer.appendChild(addLayerButton, addLayerButtonText);
//     this.renderer.listen(addLayerButton, 'click', (event) => this.createNewLayer(event));

//     this.renderer.appendChild(divElement, addLayerButton);

//     const parentContainer = this.renderer.selectRootElement('#allingredient', true);
//     this.renderer.appendChild(parentContainer, divElement);
//   }
// }