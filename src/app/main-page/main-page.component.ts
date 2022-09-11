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
  public versionSort: string = "DESC";
  public ratingSort: string = "DESC";

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

        this.appDetails.forEach(el => {
          el.count = this.getCount(el.altName);
        })
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

  filterByKeyword(input: any, app: string) {
    input = input.target.value;

    for (let i = 0; i < this.reviews.length; i++) {
      if (this.reviews[i][0] == app) {
        this.reviews[i][1] = this.backup[i][1].filter((data: any) => {
          if (data.title.label.includes(input) || data.content.label.includes(input))
            return data
        });
        break;
      }
    }
    this.isFilterApplied = true;
  }

  searchToggle(selectedApp: string) {
    this.showSearch = !this.showSearch;
    if (this.showSearch == false) {
      let event: any = { target: { value: '' } };
      this.filterByKeyword(event, selectedApp);
    }
  }

  sortByDate(app: string) {
    this.dateSort = this.setASCorDESC(this.dateSort);

    this.reviews.forEach((el, index) => {

      if (el[0] == app) {
        if (this.isFilterApplied) {
          el[1] = el[1].sort((a: any, b: any) => {
            let aDate = new Date(a.updated.label).getTime();
            let bDate = new Date(b.updated.label).getTime();

            if (this.dateSort == "ASC") return aDate - bDate;
            else if (this.dateSort == "DESC") return bDate - aDate;

            return null;
          });
        } else {
          el[1] = this.backup[index][1].sort((a: any, b: any) => {
            let aDate = new Date(a.updated.label).getTime();
            let bDate = new Date(b.updated.label).getTime();

            if (this.dateSort == "ASC") return aDate - bDate;
            else if (this.dateSort == "DESC") return bDate - aDate;

            return null;
          });
        }
      }
    })

  }

  sortByVersion(app: string) {
    this.versionSort = this.setASCorDESC(this.versionSort);
    this.reviews.forEach((el, index) => {

      if (el[0] == app) {
        if (this.isFilterApplied) {
          el[1] = el[1].sort((a: any, b: any) => {
            let aVersion = (a["im:version"].label).replaceAll('.', '');
            let bVersion = (b["im:version"].label).replaceAll('.', '');

            if (this.versionSort == "ASC") return aVersion - bVersion;
            else if (this.versionSort == "DESC") return bVersion - aVersion;

            return null;
          });
        } else {
          el[1] = this.backup[index][1].sort((a: any, b: any) => {
            let aVersion = (a["im:version"].label).replaceAll('.', '');
            let bVersion = (b["im:version"].label).replaceAll('.', '');

            if (this.versionSort == "ASC") return aVersion - bVersion;
            else if (this.versionSort == "DESC") return bVersion - aVersion;

            return null;
          });
        }
      }
    })
  }

  sortByRating(app: string) {
    this.ratingSort = this.setASCorDESC(this.ratingSort);
    this.reviews.forEach((el, index) => {

      if (el[0] == app) {
        if (this.isFilterApplied) {
          el[1] = el[1].sort((a: any, b: any) => {
            let aRating = (a["im:rating"].label);
            let bRating = (b["im:rating"].label);

            if (this.ratingSort == "ASC") return aRating - bRating;
            else if (this.ratingSort == "DESC") return bRating - aRating;

            return null;
          });
        } else {
          el[1] = this.backup[index][1].sort((a: any, b: any) => {
            let aRating = (a["im:rating"].label);
            let bRating = (b["im:rating"].label);

            if (this.ratingSort == "ASC") return aRating - bRating;
            else if (this.ratingSort == "DESC") return bRating - aRating;

            return null;
          });
        }
      }
    })
  }

  setASCorDESC(variable: string) {
    if (variable == "ASC") {
      variable = "DESC";
    } else if (variable == "DESC") {
      variable = "ASC";
    }

    return variable;
  }

  getCount(name: string) {
    let count = 0;
    this.reviews.forEach(el => {
      if (el[0] == name) {
        count = el[1].length;
      }
    })
    return count;
  }
}
