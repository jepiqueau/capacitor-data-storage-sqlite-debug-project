<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-toggle auto-hide="false" menu="main-menu">
          <ion-button @click='openMenu()'>
            <IosMenuIcon slot="icon-only" />
          </ion-button>
        </ion-menu-toggle>
      </ion-buttons>
      <slot></slot>
      <ion-title v-if="title">{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuToggle, IonButton } from '@ionic/vue'
import { defineComponent, inject } from '@vue/runtime-core'
import IosMenuIcon from 'vue-ionicons/dist/ios-menu.vue'

export default defineComponent({
  name: 'PageHeader',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonButtons,
    IonMenuToggle,
    IosMenuIcon
  },
  props: {
    title: String,
  },
  setup() {
    const emitter = inject("emitter") as any
    
    const openMenu = () => {
      emitter.emit('open-menu')
    }

    return {
      openMenu
    }
  }
})
</script>

<style>

</style>