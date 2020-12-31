export type Note = {
  uuid: string;
  deploymentSerialNo: string;
  note: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

type NotesAction = {
  type: string;
  data: any;
  accountId: string;
  nextCursor: any;
  error?: Error;
};

type NotesState = {
  loading: boolean;
  errorMsg: string;
  notes: Note[] | null;
  nextCursor: any;
  accountId: string;
  hasMore: boolean;
};

type NoteReducer = (
  state: NotesState,
  action: any,
) => NotesState;

type UserNotesResult = {
  doQuery: (limit: number, cursor: any) => Promise<void>;
  loading: boolean;
  errorMsg: string;
  notes: Note[] | null;
  nextCursor: any;
  hasMore: boolean;
};