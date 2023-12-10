import { Component } from '@angular/core';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  showLoader: boolean = false;

  constructor(private loaderService: LoaderService) {
    this.loaderService.loaderState.subscribe({
      next: (state) => {
        if (state) {
          // Show the loader
          this.showLoader = true;
        } else {
          // Hide the loader
          this.showLoader = false;
        }
      },
    });
  }
}
