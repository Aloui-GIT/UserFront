export class Comments {
  idComment!: number;
  commentText!: string;
  user!: { username: string }; // Add other user details if needed
  formId!: number;
  timestamp!: Date;
}
