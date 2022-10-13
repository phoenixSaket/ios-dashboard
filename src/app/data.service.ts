import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public apps: any[] = [];
  public shouldUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public years: number[] = [];
  public versions: number[] = [];
  public yearSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public versionSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public resetAllFilters: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public openDash: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  public initialize() {
  }

  public getDetails(id: string): Observable<any> {
    const url = "https://itunes.apple.com/lookup?id=" + id;
    return this.http.get(url);
  }

  public getAppReviews(id: string): Observable<any> {
    const url = "https://itunes.apple.com/rss/customerreviews/id=" + id + "/json";
    return this.http.get(url);
  }

  public getMoreReviews(id: string, page: number): Observable<any> {
    const url = "https://itunes.apple.com/us/rss/customerreviews/page=" + page + "/id=" + id + "/sortby=mostrecent/json?urlDesc=/customerreviews/id=" + id + "/json";
    return this.http.get(url);
  }

  public setYears(years: any[]) {
    this.years = years;
  }

  public getYears() {
    return this.years;
  }

  public setVersions(versions: number[]) {
    this.versions = versions;
  }

  public getVersions() {
    return this.versions;
  }

  public addYears(years: any[]) {
    years.forEach(year => {
      this.years.forEach(yr => {
        this.years = this.addIfNotPresent(year, this.years);
      })
    })
    this.years = this.sortArray(this.years);
  }

  public addVersions(versions: number[]) {
    versions.forEach(version => {
      this.versions.forEach(yr => {
        this.versions = this.addIfNotPresent(version, this.versions);
      })
    })
    this.versions = this.sortArray(this.versions);
  }

  sortArray(array: any[]) {
    return array.sort((a, b) => { return b - a })
  }

  addIfNotPresent(entry: any, array: any[]) {
    let isPresent: boolean = false;
    array.forEach(el => {
      if (el == entry) {
        isPresent = true;
      }
    })
    if (!isPresent) {
      array.push(entry);
    }
    return array;
  }

  addReviewIfNotPresent(entry: any, array: any[]) {
    let isPresent: boolean = false;
    array.forEach(el => {
      if (el.title == entry.title && el.content == entry.content && el.brand == entry.brand && el.author == entry.author) {
        isPresent = true;
      }
    })
    if (!isPresent) {
      array.push(entry);
    }
    return array;
  }

  openDashboard() {
    this.openDash.next(true);
  }

  closeDashboard() {
    this.openDash.next(false);
  }

}
