import { app } from 'electron'
import path from 'node:path'
import { Note, Tag, Notebook, USER } from '../../utils/types'
import { v4 as uuidv4 } from 'uuid'
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'

PouchDB.plugin(PouchDBFind)

interface Resource {
  _id: string
  type: string
  saved: boolean
}

class DatabaseManager {
  private db: PouchDB.Database | null = null
  public currentlyOpenResources: Resource[] = []
  constructor() {
    this.InitDb()
    this.HandleUser()
  }

  public async InitDb() {
    const dbPath = path.join(app.getPath('userData'), 'hibiscus-db')
    this.db = new PouchDB(dbPath) // will create the database if it does not exists. If it does well you will get the database simple

    // creating indexes
    await this.db.createIndex({
      index: {
        fields: ['type', 'parentBookId']
      }
    })

    await this.db.createIndex({
      index: {
        fields: ['type', 'bookId']
      }
    })
  }

  public async HandleUser() {
    try {
      await this.db?.get('default:user')
    } catch (error) {
      // TODO: Make a screen in renderer -> when not found any user then needs to create a user
      const user: USER = {
        _id: 'default:user',
        name: 'Aditya Jha',
        email: 'aditya01jha.02@gmail.com',
        syncedOn: new Date()
      }

      await this?.db?.put(user)
    }
  }

  public async sync(): Promise<USER> {
    let previous_sync = await this.db?.get('default:user')
    await this.db?.put({ ...previous_sync, syncedOn: new Date() })
    const new_sync = await this.db?.get<USER>('default:user')
    console.log('This is syncing')
    if (!new_sync) {
      // TODO: enable error handling
      throw new Error('Error should be handled')
    }
    return new_sync as USER
  }

  public async handleNote(
    title: string,
    noteId: string | null,
    body: string,
    bookId: string,
    numOfTasks: number = 0,
    numOfCheckedTasks: number = 0,
    status: 'working' | 'draft' | 'done' | 'priority' = 'working',
    createdAt?: Date
  ): Promise<boolean | undefined> {
    let note: Note
    const now = new Date()

    if (noteId === null) {
      // Creating a new note
      note = {
        _id: `note:${uuidv4()}`,
        title,
        body,
        bookId,
        createdAt: now,
        modifiedAt: now,
        numOfTasks,
        numOfCheckedTasks,
        pinned: false,
        tags: [],
        type: 'note',
        status
      }
    } else {
      // Updating an existing note
      note = {
        _id: noteId,
        title,
        body,
        bookId,
        createdAt: createdAt ?? now, // Use provided createdAt or current time
        modifiedAt: now, // Always update modifiedAt
        numOfTasks,
        numOfCheckedTasks,
        pinned: false,
        tags: [],
        type: 'note',
        status
      }
    }

    console.log('Note to be saved:', note)

    if (!this.db) {
      console.warn('Database connection not available')
      return false
    }

    try {
      const response = await this.db.put(note)
      console.log('Database response:', response)
      return response?.ok
    } catch (error) {
      console.error('Error saving note:', error)
      return false
    }
  }

  public async createNotebook(
    name: string,
    parentBookId: string | null = null
  ): Promise<boolean | undefined> {
    if (name != '') {
      let _id = `book:${uuidv4()}`
      console.log('Notebook Creation :', name)
      let createdAt = new Date()
      try {
        const update_response = await this.db?.put<Notebook>({
          _id: _id,
          type: 'book',
          name: name,
          count: 0,
          parentBookId: parentBookId,
          createdAt: createdAt,
          modifiedAt: createdAt
        })
        return update_response?.ok
      } catch (error) {
        return false
      }
    } else {
      return false
    }
  }

  public async handleTag(
    name: string,
    strokeColor: string,
    backgroundColor: string
  ): Promise<boolean | undefined> {
    const tag = await this.db?.put<Tag>({
      _id: `tag:${uuidv4()}`,
      name: name,
      storkeColor: strokeColor,
      backgroundColor: backgroundColor,
      type: 'tag',
      count: 0
    })
    return tag?.ok
  }

  // get all the notes inside of an notebook -> will only take the id of the notebook
  public async getNotes(notebookId: string) {
    const notes = await this.db?.find({
      selector: {
        type: 'note',
        bookId: notebookId
      }
    })

    return notes
  }

  public async getRootNotebooks() {
    const notebooks = await this.db?.find({
      selector: {
        type: 'book',
        parentBookId: null
      }
    })

    return notebooks
  }

  public async deleteNotebook(name: string, id: string) {
    try {
      const document = await this.db?.get<Notebook>(id)
      if (document && document.name == name) {
        this.db?.remove(document)
      } else {
        console.log('Did not find the notebook')
      }
    } catch (error) {
      console.error('ERROR:', error)
    }
  }
}

export default DatabaseManager
