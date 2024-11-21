import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  treeType: any = "forceDirected";

  constructor() {
    this.treeType = "forceDirected";
  }

  changeTreeType(type: any) {
    this.treeType = type
  }
}
