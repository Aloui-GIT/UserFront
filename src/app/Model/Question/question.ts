import { Answer } from "../Answer/answer";
import { Input } from "../Input/input";
import { Option } from "../Option/option";
import { Step } from "../Step/step";

export class Question {
  idQuestion?: number; // Optional, if not always provided
  question?: string; // Changed from 'question' to 'questionText' for clarity
  checked?: boolean;
  required?: boolean;
  multiple?: boolean;
  input?: Input; // Reference to the Input model
  options?: Option[]; // Reference to the Option model
  step?: Step; // Reference to the Step model
  answers?: Answer[] ;
  constructor(
    idQuestion?: number,
    question?: string,
    checked?: boolean,
    required?: boolean,
    multiple?: boolean,
    input?: Input,
    options?: Option[],
    step?: Step
  ) {
    this.idQuestion = idQuestion;
    this.question = question;
    this.checked = checked;
    this.required = required;
    this.multiple = multiple;
    this.input = input;
    this.options = options;
    this.step = step;
  }
}
