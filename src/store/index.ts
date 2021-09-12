import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store, MutationTree, ActionTree } from 'vuex'
import { CapacitorDataStorageSqlite, capOpenStorageOptions} from "capacitor-data-storage-sqlite";
import { mockTags } from '@/mock/tags'
import { Capacitor } from '@capacitor/core';

const dbName = 'MY_DATABASE'

export const enum TABLES {
  TAGS = 'TAGS',
  MEDIA = 'MEDIA',
  METADATA= 'METADATA'
}
export interface State {
  count: number;
  tags: Tag[];
  mediaObjects: MediaObject[];
}
export interface Tag {
  key: string;
  value: string;
}

export interface TagContributor {
  role: string;
  age: string;
  location: string;
  tag: Tag;
  description: string;
}

export interface MediaObject {
  name: string;
  tags: Tag[];
  metadata: MediaMetadata | undefined;
  contributors: TagContributor[];
  src: string;
  type: MediaFileType;
}

export const enum MediaFileType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}
export interface MediaMetadata {
  file: string;
  place: string;
  comment: string;
  date: string;
  photographer: string;
}

export const key: InjectionKey<Store<State>> = Symbol()

// /*
//  * Mutations
//  * How we mutate our state.
//  * Mutations must be synchronous
//  */
export const enum MUTATIONS {
  INIT_SQLITE = 'INIT_SQLITE',
  INIT_DB = 'INIT_DB',
  INIT_TAGS = 'INIT_TAGS',
  CLEAR_TAGS = 'CLEAR_TAGS',
  ADD_TAG = 'ADD_TAG',
  ADD_TAGS = 'ADD_TAGS',
  DEL_TAG = 'DEL_TAG',
  ADD_MEDIA_FILES = 'ADD_MEDIA_FILES',
  CLEAR_MEDIA_OBJECTS = 'CLEAR_MEDIA_OBJECTS',
  UPDATE_STORE_MEDIA_OBJECT = 'UPDATE_STORE_MEDIA_OBJECT'
}
const mutations: MutationTree<State> = {
  // [MUTATIONS.DEL_TODO](state, todo: Todo) {
  //   state.todos.splice(state.todos.indexOf(todo), 1);
  // },
  // [MUTATIONS.EDIT_TODO](state, todo: Todo) {
  //   const ogIndex = state.todos.findIndex(t => t.id === todo.id)
  //   state.todos[ogIndex] = todo
  // },
  [MUTATIONS.ADD_TAG](state, tag: Tag) {
    state.tags.push({...tag})
  },
  [MUTATIONS.ADD_TAGS](state, tags: Tag[]) {
    for(let i = 0; i < tags.length; i++) {
      state.tags.push(tags[i])
    }
  },
  [MUTATIONS.DEL_TAG](state, tag: Tag) {
    state.tags.splice(state.tags.indexOf(tag), 1);
  },
  [MUTATIONS.INIT_TAGS](state, tags: Tag[]) {
    state.tags.push(...tags)
  },
  [MUTATIONS.CLEAR_TAGS](state) {
    state.tags = []
  },
  // [MUTATIONS.ADD_MEDIA_FILES](state, mediaFiles: MediaObject[]) {
  //   state.mediaObjects.push(...mediaFiles)
  // },
  [MUTATIONS.CLEAR_MEDIA_OBJECTS](state) {
    state.mediaObjects = []
  },
  [MUTATIONS.UPDATE_STORE_MEDIA_OBJECT](state, mediaObject: MediaObject) {
    const index = state.mediaObjects.findIndex((m) => m.name == mediaObject.name)
    if(index) {
      state.mediaObjects[index] = mediaObject
      console.log('STATE: UPDATE_STORE_MEDIA_OBJECT Updated state', mediaObject)
    }
  },
}

// /*
//  * Actions
//  * Perform async tasks, then mutate state
//  */

export const enum ACTIONS { 
  ADD_RND_TODO = 'ADD_RND_TODO',
  SET_DB_ITEM = 'SET_DB_ITEM',
  GET_DB_ITEM = 'GET_DB_ITEM',
  CLEAR_DB_TABLE = 'CLEAR_DB_TABLE',
  INSERT_DUMMY_TAGS = 'INSERT_DUMMY_TAGS',
  INSERT_TAG = 'INSERT_TAG',
  SELECT_ALL_TAGS = 'SELECT_ALL_TAGS',
  INSERT_MEDIA_OBJECTS = 'INSERT_MEDIA_OBJECTS',
  GET_MEDIA = 'GET_MEDIA',
  SELECT_ALL_MEDIA = 'SELECT_ALL_MEDIA',
  UPDATE_MEDIA_OBJECT = 'UPDATE_MEDIA_OBJECT',
  INSERT_METADATA = 'INSERT_METADATA'
}
const actions: ActionTree<State, any> = {
  async [ACTIONS.SET_DB_ITEM](store, { table, key, value }) {
    console.log('__________________')
    console.log('DB: SETTING VALUE')
    console.log(`DB: table: ${table}, key: ${key}, value: ${value}`)
    const options: capOpenStorageOptions = {
      database: dbName,
      table,
    }
    let successful = false
    const sqlStore = CapacitorDataStorageSqlite
    try {
      const testConn = await sqlStore.isStoreOpen({ database: dbName })
      console.log('DB: SET_DB_ITEM: testConn', testConn, sqlStore)
      if(testConn) {
        await sqlStore.setTable({ table })
        console.log('DB: SET_DB_ITEM: SET TABLE', table)
      } else {
        await sqlStore.openStore(options)
      }
    
      await sqlStore.set({ key, value: JSON.stringify(value) })
      console.log('DB: SUCCESS (SETTING VALUE)')
      successful = true
    } catch (err) {
      console.log('DB: FAIL (SETTING VALUE)')
      console.log('DB:', err)
    } finally {
      if(Capacitor.getPlatform() != 'web') {
        try {
          await sqlStore.closeStore({database: dbName})
        } catch (err) {
          successful = false;
          console.log('DB: FAILED SET_DB_ITEM Close', err)
        }
      }
    }
    return successful
  },
  async [ACTIONS.GET_DB_ITEM](store, { table, key }) {
    console.log('__________________')
    console.log('DB: GETTING VALUE')
    console.log(`DB: table: ${table}, key: ${key}`)
    const options: capOpenStorageOptions = {
      database: dbName,
      table,
    }
    let result = false
    const sqlStore = CapacitorDataStorageSqlite
    try {
      await sqlStore.openStore(options)
      
      const exists = await sqlStore.iskey({key})
      if(!exists.result) return null

      const valueJSON = await sqlStore.get({ key })
      result = JSON.parse(valueJSON.value)
      console.log('DB: SUCCESS')
    } catch (err) {
      console.log(`DB: FAIL Error restoring key ${key}`)
      console.log('DB:', err)
    } finally {
      if(Capacitor.getPlatform() != 'web') {
        try {
          await sqlStore.closeStore({database: dbName})
        } catch (err) {
          result = false;
          console.log('DB: FAILED GET_DB_ITEM Close', err)
        }
      }
    }
    return result
  },
  async [ACTIONS.CLEAR_DB_TABLE](store, { table }) {
    console.log('__________________')
    console.log('DB: CLEARING DB')
    const options: capOpenStorageOptions = {
      database: dbName,
      table
    }
    
    let successful = false
    const sqlStore = CapacitorDataStorageSqlite
    try {
      await sqlStore.openStore(options)
      sqlStore.clear()
      switch(table) {
        case TABLES.TAGS:
          store.commit(MUTATIONS.CLEAR_TAGS)
          break
        case TABLES.MEDIA:
          store.commit(MUTATIONS.CLEAR_MEDIA_OBJECTS)
          break
      }
      console.log('DB: SUCCESS CLEAR')
      successful = true
    } catch (err) {
      console.log('DB: FAILED CLEAR', err)
    } finally {
      if(Capacitor.getPlatform() != 'web') {
        try {
          await sqlStore.closeStore({database: dbName})
        } catch (err) {
          successful = false;
          console.log('DB: FAILED CLEAR_DB_TABLE Close', err)
        }
      }
    }
    return successful
  },
  async [ACTIONS.INSERT_DUMMY_TAGS](store) {
    console.log('__________________')
    console.log('DB: INSERTING DUMMY DATA')
    const options: capOpenStorageOptions = {
      database: dbName,
      table: TABLES.TAGS
    }

    let successful = false
    const sqlStore = CapacitorDataStorageSqlite
    
    try {
      await sqlStore.openStore(options)
      const tagsToAdd: Tag[] = []
      for(let i = 0; i < mockTags.length; i++) {
        await sqlStore.set({ key: mockTags[i], value: mockTags[i] })
        tagsToAdd.push({ key: mockTags[i].replaceAll(' ', '-'), value: mockTags[i] })
      }
      store.commit(MUTATIONS.ADD_TAGS, tagsToAdd)
      const keys = await sqlStore.keysvalues()
      console.log(keys)
      console.log('DB: SUCCESS INSERT DATA')
      successful = true
    } catch (err) {
      console.log('DB: FAILED INSERT_DUMMY_TAGs', err)
    } finally {
      if(Capacitor.getPlatform() != 'web') {
        try {
          await sqlStore.closeStore({database: dbName})
        } catch (err) {
          successful = false;
          console.log('DB: FAILED SELECT_DUMMY_TAGS Close', err)
        }
      }
    }
    return successful
  },
  async [ACTIONS.INSERT_TAG](store, tag: Tag) {
    console.log('__________________')
    console.log('DB: INSERTING TAG')
    const options: capOpenStorageOptions = {
      database: dbName,
      table: TABLES.TAGS
    }
    
    let successful = false
    const sqlStore = CapacitorDataStorageSqlite
    
    try {
      await sqlStore.openStore(options)
      const valueJSON = await sqlStore.get({ key: tag.key.replace(/[^a-zA-Z0-9]/g, '-') })
      if(!valueJSON.value) {
        await sqlStore.set({ key: tag.key.replace(/[^a-zA-Z0-9]/g, '-'), value: tag.value })
        store.commit(MUTATIONS.ADD_TAG, tag)
        console.log('DB: SUCCESS INSERTING TAG', tag)
      } else {
        console.log('DB: TAG ALREADY EXISTS, SKIPPED INSERT', tag)
      }
      successful = true
    } catch (err) {
      console.log('DB: FAILED INSERT TAG', err)
    } finally {
      if(Capacitor.getPlatform() != 'web') {
        try {
          await sqlStore.closeStore({database: dbName})
        } catch (err) {
          successful = false;
          console.log('DB: FAILED INSERT TAG Close', err)
        }
      }
    }
    return successful
  },
  async [ACTIONS.SELECT_ALL_TAGS](store) {
    const options: capOpenStorageOptions = {
      database: dbName,
      table: TABLES.TAGS
    }

    let successful = false
    const sqlStore = CapacitorDataStorageSqlite

    try {
      await sqlStore.openStore(options)
      const tagResults = await sqlStore.keysvalues()
      console.log('SELECT_ALL_TAGS DB: keys', tagResults.keysvalues)
      store.commit(MUTATIONS.INIT_TAGS, tagResults.keysvalues)
      successful = true
    } catch (err) {
      console.log('DB: FAILED SELECT_ALL_TAGS', err)
    } finally {
      if(Capacitor.getPlatform() != 'web') {
        try {
          await sqlStore.closeStore({database: dbName})
        } catch (err) {
          successful = false;
          console.log('DB: FAILED SELECT_ALL_TAGS Close', err)
        }
      }
    }
    return successful
  },
  async [ACTIONS.INSERT_MEDIA_OBJECTS](store, mediaObjects: MediaObject[]) {
    const options: capOpenStorageOptions = {
      database: dbName,
      table: TABLES.MEDIA
    }
    
    let successful = false
    const sqlStore = CapacitorDataStorageSqlite
    
    try {
      // const testConn = await sqlStore.closeStore({ database: dbName })
      // console.log('DB: INSERT_MEDIA_OBJECTS: testConn', testConn, sqlStore)
      // if(testConn) {
      //   await sqlStore.setTable({ table: TABLES.MEDIA })
      //   console.log('DB: SET_DB_ITEM: SET TABLE', TABLES.MEDIA)
      // } else {
      //   await sqlStore.openStore(options)
      // }

      await sqlStore.openStore(options)

      // await sqlStore.openStore(options)
      // const mediaObjectsToAdd: MediaObject[] = []
      // loop over our media objects and check if they are in the db
      await mediaObjects.map(async (media) => {
//        const keyTest = await sqlStore.iskey({ key: media.name })
        
        // // if not found in db, then add them
//        if(keyTest.result) {
//          console.log('DB: KEY EXISTS', media.name)
//        } else {
          console.log('DB: SUCCESS INSERTING MEDIA', media)
          await sqlStore.set({ key: media.name, value: JSON.stringify(media) }) 
//        }

        // if media object not in state then add to list to add later
        // if(!store.state.mediaObjects.find((m) => m.name == media.name)) {
        //   mediaObjectsToAdd.push(media)
        // }
      })
      // console.log(await sqlStore.keysvalues())
      // update state
      // store.commit(MUTATIONS.ADD_MEDIA_FILES, mediaObjectsToAdd)
      successful = true
    } catch (err) {
      console.log('DB: FAILED INSERT', err)
    } finally {
      if(Capacitor.getPlatform() != 'web') {
        try {
          await sqlStore.closeStore({database: dbName})
        } catch (err) {
          successful = false;
          console.log('DB: FAILED INSERT_MEDIA_OBJECTS Close', err)
        }
      }
    }
    return successful
  },
  async [ACTIONS.UPDATE_MEDIA_OBJECT](store, mediaObject: MediaObject) {
    const options: capOpenStorageOptions = {
      database: dbName,
      table: TABLES.MEDIA
    }
    
    let successful = false
    const sqlStore = CapacitorDataStorageSqlite
    
    try {
      await sqlStore.openStore(options)
      console.log('DB: UPDATE_MEDIA_OBEJECT:', mediaObject.name)
      if(await sqlStore.iskey({ key: mediaObject.name})) {
        // replace value in db
        await sqlStore.set({ key: mediaObject.name, value: JSON.stringify(mediaObject) })
        // store.commit(MUTATIONS.UPDATE_STORE_MEDIA_OBJECT, mediaObject)
      } else {
        throw 'DB: UPDATE_MEDIA_OBEJECT: Media Object Not Found'
      }
      successful = true
    } catch (err) {
      console.log(err)
    } finally {
      if(Capacitor.getPlatform() != 'web') {
        try {
          await sqlStore.closeStore({database: dbName})
        } catch (err) {
          successful = false;
          console.log('DB: FAILED UPDATE_MEDIA_OBJECT Close', err)
        }
      }
    }
    return successful
  },
  async [ACTIONS.GET_MEDIA](store, filename: string) {
    const options: capOpenStorageOptions = {
      database: dbName,
      table: TABLES.MEDIA
    }
    
    let result = undefined
    const sqlStore = CapacitorDataStorageSqlite
    
    try {
      await sqlStore.openStore(options)
      console.log('filename:', filename)
      const media = await sqlStore.get({ key: filename})
      
      console.log('filename:', media.value)
      console.log('DB: GETTING VALUE', media)
      if(media.value != '') {
        result = JSON.parse(media.value) as MediaObject
        if(result.metadata?.file == undefined) {
          // go fetch the metadata
          await sqlStore.setTable({ table: TABLES.METADATA })
          const metadata = await sqlStore.get({ key: filename.replace(/\.[^/.]+$/, "")})
          if(metadata.value != '') {
            result.metadata = JSON.parse(metadata.value) as MediaMetadata
          } else {
            console.log('DB: METADATA NOT FOUND', result.metadata, metadata.value, filename.replace(/\.[^/.]+$/, ""))
          }
        }
      }
    } catch (err) {
      console.log(err)
    } finally {
      if(Capacitor.getPlatform() != 'web') {
        try {
          await sqlStore.closeStore({database: dbName})
        } catch (err) {
          result = undefined;
          console.log('DB: FAILED GET_MEDIA Close', err)
        }
      }
    }
    return result
  },
  async [ACTIONS.SELECT_ALL_MEDIA](store) {
    const options: capOpenStorageOptions = {
      database: dbName,
      table: TABLES.MEDIA
    }

    let result = undefined
    const sqlStore = CapacitorDataStorageSqlite

    try {
      await sqlStore.openStore(options)
      const mediaResults = await sqlStore.keysvalues()
      console.log('SELECT_ALL_MEDIA DB: keys', mediaResults.keysvalues)
      result = mediaResults
    } catch (err) {
      console.log('DB ERROR SELECT_ALL_MEDIA', err)
    } finally {
      if(Capacitor.getPlatform() != 'web') {
        try {
          await sqlStore.closeStore({database: dbName})
        } catch (err) {
          result = undefined;
          console.log('DB: FAILED SELECT_ALL_MEDIA Close', err)
        }
      }
    }
    return result
  },
  async [ACTIONS.INSERT_METADATA](store, metadataRows: MediaMetadata[]) {
    console.log('__________________')
    console.log('DB: INSERTING METADATA', metadataRows)
    const options: capOpenStorageOptions = {
      database: dbName,
      table: TABLES.METADATA
    }

    let successful = false
    const sqlStore = CapacitorDataStorageSqlite
    
    try {
      await sqlStore.openStore(options)
      
      await metadataRows.map(async (row: MediaMetadata) => {
        const keyTest = await sqlStore.iskey({ key: row.file })
        
        // if not found in db, then add them
        if(!keyTest.result) {
          await sqlStore.set({ key: row.file, value: JSON.stringify(row) }) 
          console.log('DB: SUCCESS INSERTING MEDIAMETADATA', row)
        } else {
          console.log('DB: KEY EXISTS', row.file)
        }
        
      })

      console.log('DB: SUCCESS INSERT DATA')
      successful = true
    } catch (err) {
      console.log('DB: FAILED INSERT', err)
    } finally {
      if(Capacitor.getPlatform() != 'web') {
        try {
          await sqlStore.closeStore({database: dbName})
        } catch (err) {
          successful = false;
          console.log('DB: FAILED INSERT_METADATA Close', err)
        }
      }
    }
    return successful
  },
}

// export const store = createStore<State>({ state, mutations, actions });
export const store = createStore<State>({
  state: {
    count: 0,
    tags: [] as Tag[],
    mediaObjects: [] as MediaObject[],
  },
  mutations,
  actions,
  // modules: {}
})

export function useStore() {
  return baseUseStore(key)
}