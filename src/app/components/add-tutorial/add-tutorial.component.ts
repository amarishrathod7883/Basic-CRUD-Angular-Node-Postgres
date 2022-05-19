import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css']
})
export class AddTutorialComponent implements OnInit {

  rForm: FormGroup;
  tutorial: Tutorial;
  humanError: any;
  submitted = false;
  currentTutorial: any = {};
  id: any;

  constructor(private tutorialService: TutorialService, 
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { 
    this.rForm = fb.group(
      {
        'title': [null, Validators.required],
        'description': [null],
        'published': [false],
      });
      this.tutorial = this.rForm.value;
  }

  ngOnInit(): void 
  {
    console.log("this.route.snapshot.params.id", this.route.snapshot.params.id);
    this.id = this.route.snapshot.params.id;
    if(this.id != 'new' && this.id != undefined)
    {
      this.getTutorial(this.id);
    }
    
  }

  getTutorial(id: string): void {
    this.tutorialService.get(id)
      .subscribe(
        response => {
          if(response.success == true)
          {
            this
            this.currentTutorial = response.data;
            console.log("tutorial", response.data);
            if(this.currentTutorial != null)
            {
              this.rForm.patchValue({
                title: this.currentTutorial.title,
                description: this.currentTutorial.description,
                published: this.currentTutorial.published,
              });
            }
          }
        },
        error => {
          console.log(error);
        });
  }

  saveTutorial(formdata): void {
    if (this.rForm.valid) {
      if(this.id != 'new' && !!this.id)
      {
        this.tutorialService.update(this.currentTutorial.id, formdata)
          .subscribe(
            response => {
              if(response.success == true)
              {
                console.log(response.data);
                //this.submitted = true;
                this.router.navigate(['/tutorials']);
              }
              else
              {
                this.humanError = response.message;
                const control = this.rForm.get('title');
                control.setErrors({ titleTaken: true })
              }
              
            },
            error => {
              console.log(error);
            });
      }
      else
      {
        this.tutorialService.create(formdata)
          .subscribe(
            response => {
              console.log("response", response);
              if(response.success == true)
              {
                console.log(response.data);
                //this.submitted = true;
                this.router.navigate(['/tutorials']);
              }
              else
              {
                this.humanError = response.message;
                const control = this.rForm.get('title');
                control.setErrors({ titleTaken: true })
              }
              //this.submitted = true;
            },
            error => {
              console.log(error);
            })
      }
    }
    else {
      Object.keys(this.rForm.controls).forEach(field => {
        const control = this.rForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  };

  newTutorial(): void {
    //this.submitted = false;
    this.tutorial = {
      title: '',
      description: '',
      published: false,
    };
  };

}
