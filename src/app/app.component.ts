import { Component } from '@angular/core';
import { MeteodataService } from './shared/meteodata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // providers: [MeteodataService]
})
export class AppComponent {
  title = 'meteoapp';

  constructor(private meteodataService: MeteodataService){

  }
}
