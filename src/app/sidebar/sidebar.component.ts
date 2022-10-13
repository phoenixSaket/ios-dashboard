import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() apps: any[] = [];
  @Output() appSelected: EventEmitter<any> = new EventEmitter<any>();

  constructor(private data: DataService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.data.shouldUpdate.subscribe(data => {
      if (data) {
        this.apps[0].isSelected = true;
        this.appSelected.emit(this.apps[0].altName);
      }
    })
  }

  appSelection(app: any) {
    this.appSelected.emit(app);
    this.apps.forEach(data => {
      data.isSelected = false;
    });
    this.apps.find(data => data.altName == app).isSelected = true;
  }

  openDashboard() {
    this.data.openDashboard();
  }

  download1() {
    window.open("assets/review-dashboard-win32-x64.part01.exe");
  }
  
  download2() {
    window.open("assets/review-dashboard-win32-x64.part02.rar");
  }
}
