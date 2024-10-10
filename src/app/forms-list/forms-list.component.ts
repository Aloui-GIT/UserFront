import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Form } from '../Model/Form/form';
import { FormService } from '../Services/Form/form.service';
import { SearchService } from '../Services/Search/search.service';
import { SubmissionService } from '../Services/Submission/submission.service';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.css']
})
export class FormsListComponent implements OnInit {
  forms: Form[] = [];
  newCommentText: string = '';
  showCommentsMap: { [key: number]: boolean } = {};
  selectedForm: any;
  filteredForms: Form[] = [];

  constructor(
    private formService: FormService,
    private router: Router,
    private toastr: ToastrService,
    public searchService: SearchService ,
    private submissionService :SubmissionService
  ) {}

  ngOnInit(): void {
    // Fetch all forms initially
    this.formService.getAllForms().subscribe(forms => {
      this.forms = forms.filter(form => form.acceptingResponses === true);
      this.filteredForms = this.forms; // Initialize with all forms
    });

    // Subscribe to the search term changes and call searchAll
    this.searchService.searchTerm$.subscribe(term => {
      if (term) {
        this.searchService.searchAll(term).subscribe(results => {
          if (Array.isArray(results.forms)) {  // Access the forms property
            this.filteredForms = results.forms; // Set to the forms array
          } else {
            console.error('Expected an array from search results:', results);
            this.filteredForms = []; // Reset or handle appropriately
          }
        });
      } else {
        this.filteredForms = this.forms; // Reset to all forms if search term is empty
      }
    });
  }


  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchService.setSearchTerm(input.value);
  }


  filterForms(searchTerm: string): void {
    if (searchTerm) {
      this.filteredForms = this.forms.filter(form =>
        form.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.filteredForms = this.forms; // Reset to all forms if search term is empty
    }
  }

  openCommentsModal(form: any) {
    this.selectedForm = form;
    const modal = document.getElementById('commentsModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeCommentsModal() {
    this.selectedForm = null;
    const modal = document.getElementById('commentsModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  viewForm(idForm: number): void {
    const form = this.forms.find(f => f.idForm === idForm);
    if (form) {
      // Check if submissions are still being accepted
      if (!form.acceptingResponses) {
        this.toastr.warning('Submission for this form is closed', 'Form Closed');
        return;
      }

      // Retrieve userId from session storage
      const userIdString = sessionStorage.getItem('userId');
      const userId = userIdString ? +userIdString : null; // Convert to number if it exists

      // Log the retrieved userId for debugging
      console.log('Current User ID:', userId);

      if (userId !== null) {
        this.submissionService.getSubmissionCount(userId, idForm).subscribe(
          (submissionCount: number) => {
            // Check if the user has reached the submission limit
            if (submissionCount >= form.maxSubmissionsPerUser) {
              this.toastr.warning('You have reached the submission limit for this form.', 'Limit Reached');
            } else {
              // Navigate to the form if the limit is not reached
              this.router.navigate([`/form/${idForm}`]);
            }
          },
          error => {
            console.error('Error fetching submission count:', error); // Log the error for debugging
            this.toastr.error('Error fetching submission count', 'Error');
          }
        );
      } else {
        console.warn('User ID is null, user not logged in'); // Log a warning
        this.toastr.error('User not logged in', 'Error');
      }
    } else {
      this.toastr.error('Form not found', 'Error');
    }
  }


  likeForm(formId: number): void {
    const userIdString = sessionStorage.getItem('userId');
    const userId = userIdString ? +userIdString : null;
    if (userId) {
      this.formService.likeForm(formId, userId).subscribe({
        next: () => {
          this.toastr.success('Liked!');
          this.ngOnInit();
        },
        error: () => this.toastr.error('Error processing like')
      });
    } else {
      this.toastr.error('User not logged in');
    }
  }

  dislikeForm(formId: number): void {
    const userIdString = sessionStorage.getItem('userId');
    const userId = userIdString ? +userIdString : null;
    if (userId) {
      this.formService.dislikeForm(formId, userId).subscribe({
        next: () => {
          this.toastr.success('Disliked!');
          this.ngOnInit();
        },
        error: () => this.toastr.error('Error processing dislike')
      });
    } else {
      this.toastr.error('User not logged in');
    }
  }

  addComment(formId: number, commentText: string): void {
    if (commentText.trim()) {
      const userId = sessionStorage.getItem('userId');
      if (userId) {
        const commentDto = { commentText };
        this.formService.addComment(formId, commentDto, +userId).subscribe({
          next: () => {
            this.newCommentText = '';
            this.toastr.success('Comment added!');
            this.loadComments(formId);
          },
          error: () => this.toastr.error('Error adding comment')
        });
      } else {
        this.toastr.error('User not logged in');
      }
    } else {
      this.toastr.warning('Comment cannot be empty');
    }
  }

  loadComments(formId: number): void {
    this.formService.getComments(formId).subscribe(comments => {
      const form = this.forms.find(f => f.idForm === formId);
      if (form) {
        form.comments = comments;
      }
    });
  }

  toggleComments(formId: number): void {
    this.showCommentsMap[formId] = !this.showCommentsMap[formId];
    if (this.showCommentsMap[formId]) {
      this.loadComments(formId);
    }
  }
}
