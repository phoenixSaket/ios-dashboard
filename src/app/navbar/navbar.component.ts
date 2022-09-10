import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css', '../bgcolors.css']
})
export class NavbarComponent implements OnInit {

  @Input() versions: string[] = [];
  @Input() years: number[] = [];

  @Output() search: EventEmitter<string> = new EventEmitter<string>(undefined);
  @Output() version: EventEmitter<string> = new EventEmitter<string>(undefined);
  @Output() year: EventEmitter<number> = new EventEmitter<number>(undefined);
  @Output() sortByDate: EventEmitter<string> = new EventEmitter<string>(undefined);
  @Output() sortByRating: EventEmitter<string> = new EventEmitter<string>(undefined);
  @Output() rating: EventEmitter<string> = new EventEmitter<string>(undefined);

  public ratings: any[] = []

  constructor() { }

  ngOnInit(): void {
    for (let i = 1; i <= 5; i++) {
      this.ratings.push({ rating: i, selected: false });
    }
  }

  searchInput(event: any) {
    const value = event.target.value;
    this.search.emit(value);
  }

}
