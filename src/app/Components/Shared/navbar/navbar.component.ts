import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Model/User/user';
import { UserService } from 'src/app/Services/UserServ/user.service';
import { SearchService } from 'src/app/Services/Search/search.service';  // Import the SearchService

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user!: User;
  profilePictureUrl: string | ArrayBuffer | null = '';
  searchQuery: string = '';  // For binding search input
  searchResults: any[] = [];  // To store the search results

  constructor(
    private userService: UserService,
    private router: Router,
    private searchService: SearchService  // Inject the SearchService
  ) { }

  ngOnInit(): void {
    this.loadUser();
    this.loadProfilePicture();
  }

  loadUser(): void {
    const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    if (userId) {
      this.userService.getUser(userId).subscribe(
        data => {
          this.user = data;
        },
        error => {
          console.error('Error fetching user', error);
        }
      );
    }
  }

  loadProfilePicture(): void {
    const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    if (userId) {
      this.userService.getProfilePicture(userId).subscribe(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.profilePictureUrl = reader.result;
        };
        reader.readAsDataURL(blob);
      }, error => {
        console.error('Error loading profile picture', error);
      });
    }
  }

  search(): void {
    if (this.searchQuery.trim()) {
      this.searchService.searchAll(this.searchQuery).subscribe(
        data => {
          this.searchResults = data;
          console.log('Search results:', this.searchResults);
        },
        error => {
          console.error('Error fetching search results', error);
        }
      );
    }
  }

  logout(): void {
    sessionStorage.clear();
    localStorage.clear();

    this.router.navigate(['/login']);
  }
}
