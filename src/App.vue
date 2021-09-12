<template>
  <IonApp>
    <ion-menu content-id="main" type="push">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ion-list>
          <ion-menu-toggle auto-hide="false">

            <ion-item>
              <ion-button @click="clearDB()" >{{ $t('settings.clearDatabase') }}</ion-button>
            </ion-item>

            <ion-item>
              <ion-button @click="insertDummyTags()" >Insert dummy tags</ion-button>
            </ion-item>

            <ion-item>
              <ion-button @click="insertMetadata()" >Insert metadata</ion-button>
            </ion-item>
          </ion-menu-toggle>

        </ion-list>
      </ion-content>
    </ion-menu>
    
    <ion-router-outlet id="main"></ion-router-outlet>
  </IonApp>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, IonContent, IonHeader, IonTitle, IonToolbar, IonListHeader, IonItem, IonMenuToggle, IonList, IonMenu, IonButton, IonLabel, menuController, onIonViewWillEnter } from '@ionic/vue'
import { defineComponent, inject, computed, watch, ref, onMounted } from 'vue';
import { useStore, MUTATIONS, ACTIONS, TABLES, Tag, MediaMetadata} from './store'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import dbData from '@/data/all_files.json'

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonMenuToggle,
    IonList,
    IonMenu,
    IonButton,
  },
  setup(props, context) {
    useI18n()
    const store = useStore()
    const router = useRouter()

    const clearDB = async () => {
      console.log("in clearDB")
      await store.dispatch(ACTIONS.CLEAR_DB_TABLE, { table: TABLES.TAGS })
      await store.dispatch(ACTIONS.CLEAR_DB_TABLE, { table: TABLES.MEDIA })
      await store.dispatch(ACTIONS.CLEAR_DB_TABLE, { table: TABLES.METADATA })
    }

    const insertDummyTags = async () => {
      console.log("in insertDummyTags")
      await store.dispatch(ACTIONS.INSERT_DUMMY_TAGS)
    }

    const insertMetadata = async() => {
      console.log("in insertMetadata")
      console.log('dbData', dbData)
      // insert into db
      const metaDataRows = [] as MediaMetadata[]
      for(let i = 0; i < dbData.length; i++) {
        metaDataRows.push({
          file: dbData[i].file,
          comment: dbData[i].comment,
          place: dbData[i].place,
          date: dbData[i].date,
          photographer: dbData[i].photographer,
        } as MediaMetadata)
      }
      await store.dispatch(ACTIONS.INSERT_METADATA, metaDataRows)
    }
    
    onMounted(async () => {
//      console.log("$$$ onMounted going to dispatch SELECT_ALL_TAGS")
//      await store.dispatch(ACTIONS.SELECT_ALL_TAGS)
    })

    return {
      insertDummyTags,
      currentRouteName: computed(() => { return router.currentRoute.value.meta.displayName }),
      clearDB,
      insertMetadata,
    }
  }
});
</script>

<style scoped>
</style>