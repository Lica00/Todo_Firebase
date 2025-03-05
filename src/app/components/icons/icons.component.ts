import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-icons',
  imports: [],
  templateUrl: './icons.component.html',
  styleUrl: './icons.component.css'
})
export class IconsComponent {

  icon : InputSignal<string | undefined> = input<string>();
  
}
