import { Component, OnInit } from '@angular/core';
import { SubmissionService } from '../Services/Submission/submission.service';
import { FormService } from '../Services/Form/form.service';
import { AnswerService } from '../Services/Answer/answer.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  submissionHistory: any[] = [];
  paginatedHistory: any[] = [];
  userId: number | null = null;
  sortDirection: boolean = true; // true for ascending, false for descending
  sortField: string = 'submissionDate'; // Default sort by submission date
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private submissionService: SubmissionService, private formService: FormService , private Answerservice : AnswerService ) {}

  ngOnInit(): void {
    const userIdString = sessionStorage.getItem('userId');
    this.userId = userIdString ? +userIdString : null;
    console.log('User ID retrieved from session storage:', this.userId);

    if (this.userId !== null) {
      this.fetchSubmissionHistory();
    } else {
      console.error('User ID not found in session storage');
      // Handle case when user ID is missing, redirect, or show a message
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedHistory();
  }

  updatePaginatedHistory(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedHistory = this.submissionHistory.slice(startIndex, startIndex + this.itemsPerPage);
  }

  fetchSubmissionHistory(): void {
    if (this.userId !== null) {
      this.submissionService.getSubmissionHistoryByUserId(this.userId).subscribe(
        history => {
          this.submissionHistory = history;
          console.log('Fetched submission history:', this.submissionHistory);

          // Fetch forms for each submission
          const formFetchPromises = this.submissionHistory.map(submission =>
            this.submissionService.getFormsBySubmissionId(submission.idSubmission).toPromise().then(forms => {
              submission.forms = forms;  // Attach forms to submission
              console.log(`Fetched forms for submission ${submission.idSubmission}:`, forms);
            }).catch(error => {
              console.error(`Error fetching forms for submission ${submission.idSubmission}:`, error);
            })
          );

          // Wait for all form fetch promises to resolve before updating paginated history
          Promise.all(formFetchPromises).then(() => {
            this.updatePaginatedHistory(); // Update paginated history after forms are fetched
          });
        },
        error => {
          console.error('Error fetching submission history:', error);
        }
      );
    }
  }

  sortSubmissionHistory(field: string): void {
    this.sortField = field;
    this.sortDirection = !this.sortDirection; // Toggle sort direction

    this.submissionHistory.sort((a, b) => {
      const aValue = this.getSortValue(a, field);
      const bValue = this.getSortValue(b, field);

      return this.sortDirection ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    this.updatePaginatedHistory(); // Update paginated history after sorting
  }

  private getSortValue(submission: any, field: string): any {
    switch (field) {
      case 'formTitle':
        return submission.forms?.[0]?.title || ''; // Sort by form title
      case 'submissionDate':
        return new Date(submission.dateSubmission).getTime(); // Sort by submission date
      case 'timeSpent':
        return submission.timeSpent || 0; // Sort by time spent
      default:
        return submission.dateSubmission;
    }
  }

 


}
