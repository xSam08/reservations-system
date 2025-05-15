import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  amount: number = 0;
  reservationId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.formBuilder.group({
      paymentMethod: ['card', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      cardholderName: ['', Validators.required]
    });

    // Update validation requirements based on payment method
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      if (method === 'paypal') {
        ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'].forEach(control => {
          this.paymentForm.get(control)?.clearValidators();
          this.paymentForm.get(control)?.updateValueAndValidity();
        });
      } else {
        this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern('^[0-9]{16}$')]);
        this.paymentForm.get('expiryDate')?.setValidators([Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]);
        this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.pattern('^[0-9]{3,4}$')]);
        this.paymentForm.get('cardholderName')?.setValidators(Validators.required);
        
        Object.keys(this.paymentForm.controls).forEach(key => {
          this.paymentForm.get(key)?.updateValueAndValidity();
        });
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.amount = parseFloat(params['amount']) || 0;
      this.reservationId = params['reservationId'];
      
      if (!this.amount || !this.reservationId) {
        this.router.navigate(['/hotels']);
      }
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      const paymentData = {
        ...this.paymentForm.value,
        amount: this.amount,
        reservationId: this.reservationId
      };

      // TODO: Send payment data to backend
      console.log('Payment submitted:', paymentData);

      // Simulate successful payment
      setTimeout(() => {
        // Navigate to confirmation page or back to home
        this.router.navigate(['/']);
      }, 1500);
    }
  }
}