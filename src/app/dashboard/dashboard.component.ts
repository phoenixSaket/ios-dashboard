import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @Input() reviews: any[] = [];
  public showDash: boolean = false;

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.data.openDash.subscribe(data => {
      this.showDash = data;
      if (data) {
        this.getData()
      }
    })
  }

  getData() {
    if (this.reviews[0]) {
      let keys = Object.entries(this.reviews[0]);
      keys.forEach((app: any) => {
        let count1 = 0;
        let count2 = 0;
        let count3 = 0;
        let count4 = 0;
        let count5 = 0;
        if (app[1].length > 0) {
          app[1].forEach((el: any) => {
            let rating = el["im:rating"].label;
            switch (rating) {
              case '1': count1++; break;
              case '2': count2++; break;
              case '3': count3++; break;
              case '4': count4++; break;
              case '5': count5++; break;
            }
          })
          app.push({
            count: [
              { star: count1, percent: (count1 * 100 / app[1].length).toFixed(2) },
              { star: count2, percent: (count2 * 100 / app[1].length).toFixed(2) },
              { star: count3, percent: (count3 * 100 / app[1].length).toFixed(2) },
              { star: count4, percent: (count4 * 100 / app[1].length).toFixed(2) },
              { star: count5, percent: (count5 * 100 / app[1].length).toFixed(2) },
            ]
          });

        }
      })
      console.log(keys);
      this.reviews = keys;
    }
  }

  closeDash() {
    this.data.openDash.next(false);
  }

}
