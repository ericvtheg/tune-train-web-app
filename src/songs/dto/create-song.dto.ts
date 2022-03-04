// add validation here
export class CreateSongDto {
  readonly title: string;
  readonly fileName: string;
  readonly description: string;
  readonly genres: string[];
  /** Song Owner's UUID */
  readonly userId: string;
}
