import { Option } from '../Option/option';

export class Answer {
  idAnswer?: number; // Optional because it may not be present when creating a new answer
  answerText!: string; // Changed from `Answer` to `answerText` for clarity
  submission?: {
    idSubmission?: number;
    // Include other properties of Submission if needed
  };
  question?: {
    idQuestion?: number;
    // Include other properties of Question if needed
  };
  option?: Option;

}
