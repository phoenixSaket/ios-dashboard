import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  @Input() appDetails: any[] = [];
  @Input() appReviews: any = {};
  @Input() selectedApp: string = "IBX";
  public versions: string[] = [];
  public years: number[] = [];
  private backup: any[] = [];
  public showSearch: boolean = false;
  private isFilterApplied: boolean = false;
  public dateSort: string = "DESC";

  @Output() appSelect: EventEmitter<any> = new EventEmitter<any>(undefined);
  public reviews: any[] = [];

  constructor(private cdr: ChangeDetectorRef, private data: DataService) { }

  ngOnInit(): void {
    this.data.shouldUpdate.subscribe(data => {
      if (data && !!this.appReviews[0]) {
        this.reviews = Object.entries(this.appReviews[0]);
        this.getVersions();
        this.getYears();
        this.cdr.detectChanges();
        this.backup = JSON.parse(JSON.stringify(this.reviews));
      }
    })
  }

  getTwoDigitRating(rating: number): string {
    return rating.toFixed(2);
  }

  getVersions() {
    const reviews = this.reviews;
    let versions: any[] = [];

    reviews.forEach((entry: any[]) => {
      entry[1].forEach((el: any) => {
        versions = this.data.addIfNotPresent(el['im:version'].label, versions);
      })
    })

    versions = this.data.sortArray(versions);
    this.versions = versions;
  }

  getYears() {
    const reviews = this.reviews;
    let years: any[] = [];

    reviews.forEach((entry: any[]) => {
      entry[1].forEach((el: any) => {
        const year = new Date(el['updated'].label).getFullYear()
        years = this.data.addIfNotPresent(year, years);
      })
    })

    years = this.data.sortArray(years);
    this.years = years;
  }

  filterByKeyword(input: any) {
    input = input.target.value;
    this.reviews[0][1] = this.backup[0][1].filter((data: any) => {
      if (data.title.label.includes(input) || data.content.label.includes(input))
        return data
    });
    this.isFilterApplied = true;
  }

  searchToggle() {
    this.showSearch = !this.showSearch;
    if (this.showSearch == false) {
      let event: any = { target: { value: '' } };
      this.filterByKeyword(event);
    }
  }

  sortByDate() {
    if (this.dateSort == "ASC") { this.dateSort = "DESC" }
    else if (this.dateSort == "DESC") { this.dateSort = "ASC" }

    if (this.isFilterApplied) {
      this.reviews[0][1] = this.reviews[0][1].sort((a: any, b: any) => {
        let aDate = new Date(a.updated.label).getTime();
        let bDate = new Date(b.updated.label).getTime();

        if(this.dateSort == "ASC") return aDate - bDate;
        else if(this.dateSort == "DESC") return bDate - aDate;

        return null;
      });
    } else {
      this.reviews[0][1] = this.backup[0][1].sort((a: any, b: any) => {
        let aDate = new Date(a.updated.label).getTime();
        let bDate = new Date(b.updated.label).getTime();
        this.isFilterApplied = true;

        if(this.dateSort == "ASC") return aDate - bDate;
        else if(this.dateSort == "DESC") return bDate - aDate;

        return null;
      });
    }
  }
}
