import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'IOS Review Dashboard';
  public apps: any[] = [];
  public appNames: any[] = [];
  public tempReviews: any = {};
  public reviews: any[] = [];
  private updateReviews: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public selectedApp: string = "";

  constructor(private data: DataService) { }

  ngOnInit() {
    let appIds = ["584785907", "1112137390", "1337168006", "1337166340"];
    appIds.forEach(id => {
      this.getData(id);
    });

    appIds.forEach(id => {
      this.getReviews(id);
    });

    this.updateReviews.subscribe(data => {
      if (Object.keys(data).length > 0) {
        if (!this.reviews.includes(data)) {
          this.reviews.push(data);
        }
      }
    })
  }

  getData(appId: string) {
    this.data.getDetails(appId).subscribe(data => {
      // console.log(data);
      let app: any = {};
      app.name = data.results[0].trackName;
      app.rating = data.results[0].averageUserRating;
      app.description = data.results[0].description;
      app.version = data.results[0].version;
      app.releaseNotes = data.results[0].releaseNotes;
      app.releaseDate = data.results[0].releaseDate;
      app.currentVersionReleaseDate = data.results[0].currentVersionReleaseDate;
      app.isSelected = false;
      app.altName = this.getNameFromID(appId);
      this.apps.push(app);
      this.appNames.push({ name: app.name, isSelected: false, id: appId, altName: app.altName, rating: app.rating });
    })
  }

  getReviews(appId: string) {
    const name = this.getNameFromID(appId);
    this.data.getAppReviews(appId).subscribe(data => {
      this.addDataToObject(name, data.feed.entry, this.tempReviews);
      const pages = this.getTotalPages(data.feed.link);
      if (pages > 1) {
        for (let i = 2; i <= pages; i++) {
          this.getMoreReviews(appId, i);
        }
      }
    })
  }

  addDataToObject(name: string, data: any[], object: any) {
    let array: any[] = [];
    if (object[name]?.length > 0) {
      array = object[name];
    }

    data.forEach(entry => {
      array.push(entry);
    })

    object[name] = array;
    this.updateReviews.next(object);
    this.data.shouldUpdate.next(true);

  }

  getTotalPages(links: any[]): number {
    let pages: number = -1;
    links.forEach(link => {
      if (link?.attributes?.rel == "last") {
        let lk = link?.attributes?.href;
        if (!!lk) {
          pages = parseInt(lk.substring(lk.indexOf("page=") + 5, lk.indexOf("/", lk.indexOf("page=") + 5)));
        }
      }
    });
    return pages;
  }

  getMoreReviews(id: string, page: number) {
    const name = this.getNameFromID(id);
    this.data.getMoreReviews(id, page).subscribe(data => {
      this.addDataToObject(name, data.feed.entry, this.tempReviews);
    })
  }

  getNameFromID(id: string): string {
    let name: string = "";
    switch (id) {
      case "584785907": name = "IBX"; break;
      case "1112137390": name = "AHNJ"; break;
      case "1337168006": name = "AHA"; break;
      case "1337166340": name = "IA"; break;
      default: break;
    }
    return name;
  }

  

  appSelected(app: string) {
    this.selectedApp = app;
  }
}
