import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit {
  reservationForm: FormGroup;
  hotelId: string | null = null;
  roomRate: number = 199.99; // This would come from your hotel/room data
  numberOfNights: number = 1;
  taxesAndFees: number = 25;
  totalPrice: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reservationForm = this.formBuilder.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guestCount: [1, [Validators.required, Validators.min(1)]],
      specialRequests: ['']
    });

    // Update total when form values change
    this.reservationForm.valueChanges.subscribe(() => {
      this.updatePriceCalculations();
    });
  }

  ngOnInit() {
    // Get hotel ID from route parameters
    this.route.queryParams.subscribe(params => {
      this.hotelId = params['hotelId'];
      if (!this.hotelId) {
        this.router.navigate(['/hotels']);
      }
    });

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('checkIn') as HTMLInputElement;
    if (checkInInput) {
      checkInInput.min = today;
    }
  }

  updatePriceCalculations() {
    const checkIn = new Date(this.reservationForm.get('checkInDate')?.value);
    const checkOut = new Date(this.reservationForm.get('checkOutDate')?.value);

    if (checkIn && checkOut && checkOut > checkIn) {
      this.numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      this.taxesAndFees = this.numberOfNights * 25; // Example calculation
      this.totalPrice = (this.roomRate * this.numberOfNights) + this.taxesAndFees;
    }
  }

  onSubmit() {
    if (this.reservationForm.valid) {
      const reservationData = {
        ...this.reservationForm.value,
        hotelId: this.hotelId,
        totalPrice: this.totalPrice
      };

      // TODO: Send reservation data to backend
      console.log('Reservation submitted:', reservationData);

      // Navigate to payment
      this.router.navigate(['/payment'], {
        queryParams: {
          amount: this.totalPrice,
          reservationId: 'temp-id' // This would come from your backend
        }
      });
    }
  }
}