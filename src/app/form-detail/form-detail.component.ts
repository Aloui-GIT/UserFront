import {ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../Services/Form/form.service';
import { StepService } from '../Services/Step/step.service';
import { QuestionService } from '../Services/Question/question.service';
import { InputService } from '../Services/Input/input.service';
import { OptionService } from '../Services/Option/option.service';
import { SubmissionService } from '../Services/Submission/submission.service';
import { AnswerService } from '../Services/Answer/answer.service';

import { Form } from '../Model/Form/form';
import { Step } from '../Model/Step/step';
import { Question } from '../Model/Question/question';
import { Input } from '../Model/Input/input';
import { Option } from '../Model/Option/option';
import { AnswerDto } from '../Model/DTO/AnswerDto';
import { SubmissionDto } from '../Model/DTO/SubmissionDto';
import { ToastrService } from 'ngx-toastr';
import { OpenAIService } from '../Services/OpenAI/open-ai.service';
import {AbstractControl, FormArray , FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-detail',
  templateUrl: './form-detail.component.html',
  styleUrls: ['./form-detail.component.css']
})
export class FormDetailComponent implements OnInit {
  form: any; // Replace `any` with the actual type of your form object
  steps!: any[]; // Replace `any` with the actual type of steps
  answers: { [key: number]: any } = {}; // Assuming `answers` is an object with question IDs as keys
  formErrors: string | null = null;
  selectedOption: string | null = null; // No option selected by default
  startTime!: Date; // Start time of the form
  currentPage: number = 1;
  totalPages: number = 0;
  userInput!: string;  // or appropriate type
  suggestions: string[] = [];
  currentQuestion: Question | null = null; // Store the selected question
  suggestionsMap: { [questionId: number]: string[] } = {}; // Keyed by questionId

  idfoorm = +this.route.snapshot.paramMap.get('id')!;

  // Added indexes
  currentStepIndex: number = 0; // Tracks the current step
  currentQuestionIndex: number = 0; // Tracks the current question


  availableVoices: SpeechSynthesisVoice[] = [];
  selectedVoiceName: string = ''; // Stores selected voice name
  formGroup!: FormGroup;


  private readonly TIME_LIMIT = 30000; // 30 seconds
  private attempts: number = 0; // To track the number of attempts
  private answerTimeoutId: any; // To store the timeout ID
  isListening: boolean = false; // Track whether the app is currently listening
   recognition: any; // Store recognition instance


  isSuggestionsVisible: { [key: number]: boolean } = {};

  constructor(
    private formService: FormService,
    private stepService: StepService,
    private questionService: QuestionService,
    private inputService: InputService,
    private optionService: OptionService,
    private submissionService: SubmissionService,
    private answerService: AnswerService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private aiService: OpenAIService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.startTime = new Date();
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;

    this.loadVoices();

    this.initializeSpeechRecognition();

    this.stepService.getStepCount(id).subscribe(
      count => {
        this.totalPages = count;
        this.formService.getFormById(id).subscribe(
          form => {
            if (form) {
              this.form = form;
              this.loadStepsAndQuestions(id);
            } else {
              this.handleFormNotAvailable();
            }
          },
          error => {
            console.error('Error fetching form:', error);
            this.handleFormNotAvailable();
          }
        );
      },
      error => {
        console.error('Error fetching step count:', error);
      }
    );
  }


  // Method to toggle the visibility of suggestions for a question
  toggleSuggestions(questionId: number): void {
    // Toggle the visibility status for the specific question ID
    this.isSuggestionsVisible[questionId] = !this.isSuggestionsVisible[questionId];
  }


  initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false; // Stops after one result
      this.recognition.interimResults = false; // Only final results
      this.recognition.lang = 'en-US'; // Language setting

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognition result:', transcript);

        // Check if currentQuestion is not null before assigning the answer
        if (this.currentQuestion && this.currentQuestion.idQuestion !== undefined) {
          this.answers[this.currentQuestion.idQuestion] = transcript; // Set the answer
          this.cd.detectChanges(); // Manually trigger change detection
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech Recognition Error', event);
      };
    } else {
      console.error('Speech Recognition is not supported in this browser.');
    }
  }



  startVoiceRecording(questionId: number) {
    // Find the selected question by ID
    this.currentQuestion = this.steps.flatMap(step => step.questions).find(q => q.idQuestion === questionId) || null;
    console.log('Starting voice recording for question:', questionId, 'Current question:', this.currentQuestion);

    if (this.recognition && this.currentQuestion) {
      try {
        this.recognition.start(); // Start recording
      } catch (err) {
        console.error('Error starting voice recognition:', err);
      }
    } else {
      console.warn('No valid question selected or recognition not available');
    }
  }



  loadVoices() {
    const synth = window.speechSynthesis;
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = () => {
        this.availableVoices = synth.getVoices();
        console.log(this.availableVoices); // Log all available voices
      };
    } else {
      this.availableVoices = synth.getVoices();
      console.log(this.availableVoices); // Log all available voices
    }
  }


  readFormContent() {
    const synth = window.speechSynthesis;
    let textToRead = `Welcome to the form titled "${this.form.title}". ${this.form.description}.`;

    let questionCounter = 1; // Initialize a separate counter for questions

    this.steps.forEach((step, index) => {
      textToRead += ` Step ${index + 1}: ${step.title}. `;
      step.questions.forEach((question: any) => {
        textToRead += `Question ${questionCounter}: ${question.question}. `;
        questionCounter++; // Increment the question counter for each question
      });
    });

    // Create a new speech utterance with the text to read
    const utterance = new SpeechSynthesisUtterance(textToRead);

    // Automatically pick a voice that is different and possibly better than the default one
    const defaultVoice = this.availableVoices.find(voice => voice.name === "Google UK English Female"); // This is your current voice (you can change this as needed)
    const betterVoice = this.availableVoices.find(voice => voice.name !== defaultVoice?.name && voice.lang.startsWith('en')); // Finds a different English voice

    // If a better voice is found, use it
    if (betterVoice) {
      utterance.voice = betterVoice;
    } else {
      // If no better voice is found, fallback to any available voice
      utterance.voice = this.availableVoices[0] || null;
    }

    // Speak the utterance
    synth.speak(utterance);
  }

















  handleFormNotAvailable() {
    // Show the toastr message
    this.toastr.error('The form you are trying to access is no longer available you will be redirected to available forms.', 'Form Not Available', {
      timeOut: 5000, // Duration in milliseconds
    });

    // Attempt to fetch another available form
    this.formService.getAllForms().subscribe(
      forms => {
        if (forms && forms.length > 0) {
          // Redirect to the first available form or handle the list as needed
          this.router.navigate(['/form', forms[0].idForm]);
        } else {
          // If no other forms are available, redirect to a general forms page
          setTimeout(() => {
            this.router.navigate(['/forms']);
          }, 2000);
        }
      },
      error => {
        console.error('Error fetching available forms:', error);
        // Redirect to a general forms page if fetching other forms fails
        setTimeout(() => {
          this.router.navigate(['/forms']);
        }, 2000);
      }
    );
  }

  selectSuggestion(suggestion: string, questionId: number): void {
    this.answers[questionId] = suggestion; // Update the answer for the specified question ID with the selected suggestion
  }



  setCurrentQuestion(question: Question): void {
    this.currentQuestion = question; // Set the selected question
  }

// Method to fetch suggestions for a specific question
  getSuggestions(question: Question): void {
    const questionId = question.idQuestion as number; // Get the ID of the current question
    const userInput = this.answers[questionId] || ''; // Get the current input from the user for this question

    // Prepare the request payload
    const requestData = {
      title: this.form?.title || '',         // Fallback to empty string if form or title is undefined
      description: this.form?.description || '',  // Fallback to empty string if description is undefined
      questionId: questionId,
      userInput: userInput
    };

    // Log the request data (for debugging purposes)
    console.log('Sending data to backend for suggestions:', requestData);

    // Call the AI service to get suggestions for the current question
    this.aiService.getSuggestionsCohere(requestData.title, requestData.description, requestData.questionId, requestData.userInput)
      .subscribe(
        (data: string[]) => {
          this.suggestionsMap[questionId] = data; // Store the suggestions for the specific question in the map
          console.log('Suggestions received for question', questionId, ':', this.suggestionsMap[questionId]);
        },
        (error) => {
          console.error('Error fetching suggestions from the AI service:', error); // Log any error encountered
        }
      );
  }



  // Make sure to call onUserInputChange when userInput changes
  handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.userInput = target.value;  // Update userInput with the current input value
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }





  loadStepsAndQuestions(formId: number): void {
    this.stepService.getStepsByFormId(formId).subscribe(
      steps => {
        this.steps = steps.map(step => ({ ...step, questions: [] }));
        this.loadQuestionsForSteps(this.steps);
      },
      error => {
        console.error('Error fetching steps:', error);
      }
    );
  }

  loadQuestionsForSteps(steps: Step[]): void {
    steps.forEach(step => {
      this.questionService.getQuestionsByStepId(step.idStep).subscribe(
        questions => {
          const foundStep = this.steps.find(s => s.idStep === step.idStep);
          if (foundStep) {
            foundStep.questions = questions.map(question => ({
              ...question,
              input: {} as Input,
              options: [] as Option[]
            }));
            this.loadInputsAndOptionsForQuestions(foundStep.questions);
          }
        },
        error => {
          console.error('Error fetching questions:', error);
        }
      );
    });
  }

  loadInputsAndOptionsForQuestions(questions: (Question & { input: Input; options: Option[] })[]): void {
    questions.forEach(question => {
      if (question.idQuestion !== undefined) {
        this.questionService.getInputByQuestionId(question.idQuestion).subscribe(
          input => {
            question.input = input;
          },
          error => {
            console.error('Error fetching input:', error);
          }
        );

        this.optionService.getOptionsByQuestionId(question.idQuestion).subscribe(
          options => {
            question.options = options || []; // Ensure options is an empty array if undefined
          },
          error => {
            console.error('Error fetching options:', error);
          }
        );

        // Check if the question is required
        this.questionService.isQuestionRequired(question.idQuestion).subscribe(
          isRequired => {
            question.required = isRequired; // Set the required property
          },
          error => {
            console.error('Error checking if question is required:', error);
          }
        );
      }
    });
  }



  handleAnswerChange(questionId: number | undefined, event: Event): void {
    if (questionId !== undefined) {
      const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

      if (target instanceof HTMLInputElement) {
        if (target.type === 'checkbox') {
          const value = target.value;
          const currentAnswers = (this.answers[questionId] as string[]) || [];
          if (target.checked) {
            if (!currentAnswers.includes(value)) {
              this.answers[questionId] = [...currentAnswers, value];
            }
          } else {
            this.answers[questionId] = currentAnswers.filter(val => val !== value);
          }
        } else if (target.type === 'radio' || target.type === 'text') {
          this.answers[questionId] = target.value;
        }
      } else if (target instanceof HTMLTextAreaElement) {
        this.answers[questionId] = target.value;
      } else if (target instanceof HTMLSelectElement) {
        if (target.multiple) {
          this.answers[questionId] = Array.from(target.selectedOptions).map(option => (option as HTMLOptionElement).value);
        } else {
          this.answers[questionId] = target.value;
        }
      }
    }
  }


  async prepareAnswersForSubmission(): Promise<AnswerDto[]> {
    const answersArray: AnswerDto[] = [];

    for (const [questionIdStr, answerValue] of Object.entries(this.answers)) {
      const questionId = Number(questionIdStr);
      const question = this.findQuestionById(questionId);

      if (!question) continue;

      const inputType = question.input?.inputType;

      if (inputType === 'Short answer' || inputType === 'Paragraph') {
        // Handle text-based inputs
        answersArray.push({
          questionId: questionId,
          answer: answerValue as string,
          optionId: null // No optionId for text-based inputs
        });
      } else if (inputType === 'Checkboxes' || inputType === 'Multiple choice' || inputType === 'Drop-down') {
        // Handle options-based inputs
        const options = question.options;

        // Convert answerValue to an array if it's not already
        const answerValues = Array.isArray(answerValue) ? answerValue : [answerValue];

        options.forEach(option => {
          // Check if the option is selected (i.e., exists in answerValues)
          if (answerValues.includes(option.option)) {
            // Add the selected option to answersArray
            answersArray.push({
              questionId: questionId,
              answer: option.option, // The value of the option
              optionId: option.idOption // Correct optionId
            });
            console.log(answersArray)
          }
        });
      }
    }
    return answersArray;
  }

  isChecked(option: string, questionId: number): boolean {
    const selectedOptions = this.answers[questionId];
    return Array.isArray(selectedOptions) && selectedOptions.includes(option);
  }


  isCheckedAny(questionId: number): boolean {
    return this.answers[questionId]?.length > 0;
  }

  isRadioSelected(questionId: number): boolean {
    return !!this.answers[questionId];
  }

  async submitAnswers(): Promise<void> {
    this.formErrors = null; // Reset errors
    const userId = +sessionStorage.getItem('userId')!;
    const formId = +this.route.snapshot.paramMap.get('id')!;

    if (!userId || !formId) {
      this.formErrors = 'User ID or Form ID is missing.';
      return;
    }

    // Validate required fields
    let hasErrors = false;
    for (const step of this.steps) {
      for (const question of step.questions) {
        if (question.required && question.idQuestion !== undefined) {
          const answer = this.answers[question.idQuestion];
          if (answer === undefined || answer === null || answer === '') {
            this.formErrors = 'Please fill in all required fields.';
            hasErrors = true;
            break;
          }
        }
      }
      if (hasErrors) break;
    }

    if (hasErrors) return;

    try {
      const endTime = new Date(); // Capture the current time at submission
      const timeSpent = Math.floor((endTime.getTime() - this.startTime.getTime()) / 1000); // Time spent in seconds

      const answersArray = await this.prepareAnswersForSubmission();
      console.log('Prepared answers:', answersArray); // Add this line to log the prepared answers

      const submissionDto: SubmissionDto = {
        userId: userId,
        formId: formId,
        answers: answersArray,
        timeSpent: timeSpent
      };

      console.log('Submission DTO:', submissionDto); // Add this line to log the submission DTO

      this.submissionService.saveSubmission(submissionDto).subscribe(
        response => {
          console.log('Submission saved successfully:', response);
          localStorage.setItem('lastSubmittedFormId', formId.toString());
          this.router.navigate(['/thank-you']);
        },
        error => {
          console.error('Error saving submission:', error);
        }
      );
    } catch (error) {
      console.error('Error preparing answers:', error);
      this.formErrors = 'An error occurred while preparing the submission.';
    }
  }
  isFieldError(questionId: number): boolean {
    const question = this.findQuestionById(questionId);
    // Ensure that `question.required` defaults to `false` if `undefined`
    return (question?.required ?? false) && (this.answers[questionId] === undefined || this.answers[questionId] === null || this.answers[questionId] === '');
  }

  isFieldEmpty(questionId: number): boolean {
    const question = this.findQuestionById(questionId);
    return (question?.required ?? false) && (this.answers[questionId] === undefined || this.answers[questionId] === null || this.answers[questionId] === '');
  }



  findQuestionById(questionId: number): (Question & { input: Input; options: Option[] }) | undefined {
    for (const step of this.steps) {
      for (const question of step.questions) {
        if (question.idQuestion === questionId) {
          return question;
        }
      }
    }
    return undefined;
  }
  goBack() {
    this.router.navigate(['/forms']); // Replace '/previous-route' with the actual route you want to navigate to
  }


  isPageValid(): boolean {
    const currentStep = this.steps[this.currentPage - 1];
    if (!currentStep || !currentStep.questions) {
      return false;
    }

    // Check if all required fields have been filled
    for (const question of currentStep.questions) {
      if (question.required && !this.answers[question.idQuestion]) {
        return false;
      }
    }

    return true;
  }




}
