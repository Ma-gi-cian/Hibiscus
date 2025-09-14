/** Inspired by : https://github.com/inkdropapp/inkdrop-model/blob/master/docs/schema.md */

export interface Tag {
    _id: string;
    _rev?: string;
    name: string;
    storkeColor: string;
    backgroundColor: string;
    type: 'tag'
    count: number;
}

export interface USER  {
  _id:string,
  _rev?: string,
  name : string,
  syncedOn : Date,
  email: string,
}

export interface Note {
    _id: string;
    _rev?: string;
    title: string;
    body: string;
    bookId: string;
    createdAt: Date;
    modifiedAt: Date;
    numOfTasks: number;
    numOfCheckedTasks: number;
    pinned: boolean;
    status: 'working' | 'draft' | 'done' | 'priority' ;
    tags: string[];
    type: 'note'
}


export interface Notebook {
    _id: string;
    _rev?: string,
    type: 'book',
    name: string,
    count: number,
    parentBookId: string | null,
    createdAt: Date,
    modifiedAt: Date
}


export interface USER  {
  _id:string,
  _rev?: string,
  name : string,
  syncedOn : Date,
  email: string,
}
