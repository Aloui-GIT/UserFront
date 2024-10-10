import { Comments } from "../Comment/comments";
import { Step } from "../Step/step";

export class Form {
  idForm: number;
  title: string;
  description: string;
  createDate: Date;
  lastModificationDate: Date;
  maxSubmissionsPerUser!: number ;
  steps: Step[];
  acceptingResponses: boolean; // Changed from 'acceptingResponses!' to 'acceptingResponses'
  comments?: Comments[]; // Optional, for displaying comments
  likesCount?: number; // Add likes count
  dislikesCount?: number; // Add dislikes count

  constructor(
    idForm: number,
    title: string,
    description: string,
    createDate: Date,
    lastModificationDate: Date,
    acceptingResponses: boolean = true,
    steps: Step[] = [],
    likesCount: number = 0,
    dislikesCount: number = 0
  ) {
    this.idForm = idForm;
    this.title = title;
    this.description = description;
    this.createDate = createDate;
    this.lastModificationDate = lastModificationDate;
    this.acceptingResponses = acceptingResponses;
    this.steps = steps;
    this.likesCount = likesCount;
    this.dislikesCount = dislikesCount;
  }
}
