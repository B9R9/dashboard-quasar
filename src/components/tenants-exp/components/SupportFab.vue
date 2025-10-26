<script>
export default {
  name: 'SupportFab',
  props: {
    active: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      draggingFab: false,
      drawerRight: false,
      fabPos: [18, 18]
    }
  },
  methods: {
    goToHelpCenter () {
      window.open('https://helpcenter.hyperin.com/', '_blank')
    },
    moveFab (ev) {
      if (!this.active) return
      this.draggingFab = ev.isFirst !== true && ev.isFinal !== true

      // Calcul de la nouvelle position
      const newX = this.fabPos[0] - ev.delta.x
      const newY = this.fabPos[1] - ev.delta.y

      // Taille approximative du FAB (56px par défaut)
      const fabSize = 56

      // Limites de l'écran avec marges de sécurité
      const minX = 10
      const maxX = window.innerWidth - fabSize - 10
      const minY = 10
      const maxY = window.innerHeight - fabSize - 10

      // Application des limites
      const safeX = Math.max(minX, Math.min(newX, maxX))
      const safeY = Math.max(minY, Math.min(newY, maxY))

      this.fabPos = [safeX, safeY]
    },
    openChat () {
      this.$emit('open-chat')
    }
  }
}
/**
 * Creer des computed pour modifer le label suivant taille d ecran
 */
</script>

<template>
  <q-page-sticky position="bottom-right" :offset="fabPos">
    <q-fab
      icon="add"
      direction="up"
      color="accent"
      :disable="draggingFab"
      v-touch-pan.prevent.mouse="moveFab"
      vertical-actions-align="right"
    >
      <q-fab-action icon="chat" label="Chat" @click="openChat"/>
      <q-fab-action icon="help" label="Help" @click="goToHelpCenter"/>
      <q-fab-action icon="support_agent" label="Support" />
    </q-fab>
  </q-page-sticky>
</template>
