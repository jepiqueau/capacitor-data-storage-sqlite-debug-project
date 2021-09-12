<template>
<ion-page>
  <page-header :title="'Test View'"/>
  <ion-content>
    {{ tags }}
    <pre>
      {{ mediaObjects }}
    </pre>
    <table>
      <tr>
        <th>Filename</th><th>Tags</th><th>Metadata</th>
      </tr>
      <tr v-for="m in mediaObjects" :key="m">
        <td>{{ m.name }}</td><td>{{ m.tags }}</td><td>{{ m.metadata }}</td>
      </tr>
    </table>
  </ion-content>
</ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent, onIonViewWillEnter } from '@ionic/vue'
import { defineComponent, ref } from 'vue'
import { useStore, ACTIONS, Tag, MediaObject, TagContributor, MediaMetadata, MediaFileType} from '../store'
import PageHeader from '@/components/PageHeader.vue'
// import dbData from '@/mock/meta-data.json'

export default defineComponent ({
  components: {
    IonPage,
    PageHeader,
    IonContent,
  },
  setup() {
    const store = useStore()
    const tags = ref([] as Tag[])
    const mediaObjects = ref([] as MediaObject[])

    onIonViewWillEnter(async () => {
      console.log("$$$ in TestView onIonViewWillEnter")
      console.log("$$$ TestView onIonViewWillEnter going to dispatch SELECT_ALL_TAGS")
      tags.value = await store.dispatch(ACTIONS.SELECT_ALL_TAGS)
      console.log(`$$$ tags.value ${tags.value}`)
      const dbMediaObjects = await store.dispatch(ACTIONS.SELECT_ALL_MEDIA)

      const fakeMediaObjects = [] as MediaObject[]

      for(let i = 0; i < 500; i++) {
        const n = Math.random().toString(16).substr(2, 8) + '.jpg'
        const place = Math.random().toString(16).substr(2, 8)
        const comment = Math.random().toString(16).substr(2, 8)
        const date = Math.random().toString(16).substr(2, 8)
        const photographer = Math.random().toString(16).substr(2, 8)
        const src = Math.random().toString(16).substr(2, 8)

        fakeMediaObjects.push({
          name: n,
          tags: [] as Tag[],
          contributors: [] as TagContributor[],
          metadata: {
            file: n,
            place,
            comment,
            date,
            photographer,
          } as MediaMetadata,
          src,
          type: MediaFileType.IMAGE
        })
      }
      console.log('fakeMediaObjects', fakeMediaObjects)
      // insert into db
      await store.dispatch(ACTIONS.INSERT_MEDIA_OBJECTS, fakeMediaObjects)

      mediaObjects.value = fakeMediaObjects
    })

    return {
      tags,
      mediaObjects,
    }
  }
})
</script>

<style scoped>
</style>