import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SubmissionService } from '../Services/Submission/submission.service';
import { FormService } from '../Services/Form/form.service'; // Import your Form service
import { Form } from '../Model/Form/form';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent {
  formId: number | null = null;
  form: Form | null = null; // Define a variable to hold the form details

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private submissionService: SubmissionService,
    private toastr: ToastrService,
    private formService: FormService // Inject the form service
  ) {}

  ngOnInit(): void {
    const storedFormId = localStorage.getItem('lastSubmittedFormId');
    if (storedFormId) {
      this.formId = +storedFormId;
      this.getFormDetails(); // Fetch the form details
    }
  }

  getFormDetails(): void {
    if (this.formId) {
      this.formService.getFormById(this.formId).subscribe(
        (form: Form) => {
          this.form = form; // Store the fetched form details
        },
        error => {
          this.toastr.error('Error fetching form details', 'Error');
        }
      );
    }
  }

  submitAnother(): void {
    if (this.formId && this.form) {
      const userIdString = sessionStorage.getItem('userId');
      const userId = userIdString ? +userIdString : null;

      if (userId !== null) {
        this.submissionService.getSubmissionCount(userId, this.formId).subscribe(
          (submissionCount: number) => {
            if (this.form) { // Check if form is defined
              const maxSubmissions = this.form.maxSubmissionsPerUser; // Access max submissions from the fetched form

              if (submissionCount < maxSubmissions) {
                this.router.navigate(['/form', this.formId]);
              } else {
                this.toastr.warning('You have reached the submission limit for this form.', 'Limit Reached you will be redirected now');
                setTimeout(() => {
                  this.router.navigate(['/forms']);
                }, 3000); // 3000 milliseconds = 3 seconds
              }
            } else {
              this.toastr.error('Form details not available', 'Error'); // Handle the case where the form is null
            }
          },
          error => {
            this.toastr.error('Error fetching submission count', 'Error');
          }
        );
      } else {
        this.toastr.error('User not logged in', 'Error');
      }
    }
  }


}
