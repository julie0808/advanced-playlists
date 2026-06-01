import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService } from './error-service';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  template: `<p *ngIf="errorMessage">{{errorMessage}}</p>`
})
export class ErrorComponent implements OnInit {
  public errorMessage: string = '';

  constructor(private errorService: ErrorService) { }

  ngOnInit(): void {
    this.errorService.notification.subscribe(
      notification => {
        this.errorMessage = notification;
      }
    );
  }

}
