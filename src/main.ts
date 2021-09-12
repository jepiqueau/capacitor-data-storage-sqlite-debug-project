import { createApp, ref,  } from 'vue'
import App from './App.vue'
import router from './router';
import { store, key, Tag, ACTIONS } from './store'
import { IonicVue } from '@ionic/vue';
import { CapacitorDataStorageSqlite, capOpenStorageOptions} from "capacitor-data-storage-sqlite";

import Vue3TouchEvents from "vue3-touch-events";

// import i18n from './i18n'
import i18n from '@/i18n'

import mitt from 'mitt'
const emitter = mitt();

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Icons */
import 'vue-ionicons/ionicons.scss'


const tags = ref([] as Tag[]);
const app = createApp(App).use(store, key)
  .use(IonicVue)
  .use(router)
  .use(Vue3TouchEvents)
  .use(i18n)

app.provide('emitter', emitter)
// app.provide('i18n', i18n)

router.isReady().then(() => {
  store.dispatch(ACTIONS.SELECT_ALL_TAGS).then((res) => {
    console.log(`$$$$$ res ${JSON.stringify(res)}`)
    tags.value = res;
    app.config.globalProperties.$tags = tags;
    app.mount('#app');
  })
});