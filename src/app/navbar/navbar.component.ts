import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css', '../bgcolors.css']
})
export class NavbarComponent implements OnInit {

  @Input() reviews: number[] = [];
  @Input() app: string = "";

  @Output() search: EventEmitter<string> = new EventEmitter<string>(undefined);
  @Output() version: EventEmitter<string> = new EventEmitter<string>(undefined);
  @Output() year: EventEmitter<number> = new EventEmitter<number>(undefined);
  @Output() sortByDate: EventEmitter<string> = new EventEmitter<string>(undefined);
  @Output() sortByRating: EventEmitter<string> = new EventEmitter<string>(undefined);
  @Output() rating: EventEmitter<number[]> = new EventEmitter<number[]>(undefined);

  public ratings: any[] = []
  public years: number[] = [];
  public versions: string[] = [];
  public selectYearIndex: number = 0;
  public selectVersionIndex: number = 0;
  public selectedRatings: number[] = [];

  constructor(private data: DataService) { }

  ngOnInit(): void {
    for (let i = 1; i <= 5; i++) {
      this.ratings.push({ rating: i, selected: false });
    }

    this.getVersions();
    this.getYears();

    this.data.resetAllFilters.subscribe((reset: boolean) => {
      if (reset) {
        this.selectYearIndex = 0;
        this.selectVersionIndex = 0;
        this.resetAllRatings();
      }
    })
  }

  searchInput(event: any) {
    const value = event.target.value;
    this.search.emit(value);
  }

  selectYear(year: any) {
    this.year.emit(year.target.value);
  }

  selectVersion(version: any) {
    this.version.emit(version.target.value)
  }

  getVersions() {
    this.versions = [];
    this.reviews.forEach((el: any) => {
      if (el[0] == this.app) {
        // this.versions.push(el[1].)
        el[1].forEach((element: any) => {
          this.data.addIfNotPresent(element["im:version"].label, this.versions)
        });
      }
    })
  }

  getYears() {
    this.years = [];
    this.reviews.forEach((el: any) => {
      if (el[0] == this.app) {
        // this.versions.push(el[1].)
        el[1].forEach((element: any) => {
          let year = new Date(element.updated.label).getFullYear();
          this.data.addIfNotPresent(year, this.years)
        });
      }
    })
  }

  selectedRating(rating: number) {
    this.ratings.forEach(el => {
      if (el.rating == rating) {
        el.selected = !el.selected;
      }
    });

    let addedRating: any = this.selectedRatings.find(el => { return (el == rating) });

    if (!!addedRating) {
      this.selectedRatings.splice(this.selectedRatings.indexOf(addedRating), 1)
    } else {
      this.selectedRatings = this.data.addIfNotPresent(rating, this.selectedRatings);
    }

    this.rating.emit(this.selectedRatings);
  }

  resetAllRatings() {
    this.ratings.forEach(el => {
      el.selected = false;
    });
  }
}
