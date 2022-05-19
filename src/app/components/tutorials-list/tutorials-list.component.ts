import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.css']
})
export class TutorialsListComponent implements OnInit {

  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  currentIndex = -1;
  title = '';

  constructor(private tutorialService: TutorialService) { }

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    this.tutorialService.getAll()
      .subscribe(
        response => {
          if(response.success == true)
          {
            this.tutorials = response.data;
            console.log(response.data);
          }
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrieveTutorials();
    this.currentTutorial = {};
    this.currentIndex = -1;
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  deleteTutorial(tutorial: Tutorial): void {
    this.tutorialService.delete(tutorial.id)
      .subscribe(
        response => {
          if(response.success == true)
          {
            this.refreshList();
          }
        },
        error => {
          console.log(error);
        });
  }

  deleteAllTutorials(): void {
    this.tutorialService.deleteAll()
      .subscribe(
        response => {
          if(response.success == true)
          {
            this.refreshList();
          }
        },
        error => {
          console.log(error);
        });
  }

  searchTitle(): void {
    this.currentTutorial = {};
    this.currentIndex = -1;
    this.tutorialService.findByTitle(this.title)
      .subscribe(
        response => {
          if(response.success == true)
          {
            this.tutorials = response.data;
            console.log(response.data);
          }
        },
        error => {
          console.log(error);
        });
  }

}
