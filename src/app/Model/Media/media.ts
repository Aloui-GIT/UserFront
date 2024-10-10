export class Media {
  id?: number; // Optional field, if not always provided
  data?: Blob; // Raw binary data, if needed
  user?: User; // Optional, if media is associated with a user
}
