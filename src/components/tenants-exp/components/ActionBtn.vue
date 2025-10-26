<script>
export default {
  name: 'ActionBtn',
  data () {
    return {
      draggingFab: false,
      fabPos: [18, 0],
      pathToFile: [],
      showCreateForm: false,
      showDialog: false,
      showExtractURL: false,
      showFilePicker: false,
      url: ''
    }
  },
  methods: {
    handleImport () {},
    moveFab (ev) {
      if (!this.active) return // Désactive le déplacement si active est false
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
    onClick (val) {
      this.showDialog = true
      if (val === 'create') this.showCreateForm = true
      if (val === 'extract') this.showExtratURL = true
      if (val === 'import') this.showFilePicker = true
    },
    onClose () {
      this.showDialog = false
      this.showFilePicker = false
      this.showCreateForm = false
      this.showExtractURL = false
      this.pathToFile = []
      this.url = ''
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
      <q-fab
        style="min-width: 10vw"
        label="Add Job"
        direction="left"
        color="primary"
        :disable="draggingFab"
        vertical-actions-align="right"
        icon="keyboard_arrow_left"
        padding="sm"
      >
        <q-fab-action
          label="Extract"
          @click="onClick('extract')"
          color="secondary"
          icon="add"
          :disable="draggingFab"
          padding="xs"
        />
        <q-fab-action
          label="Create"
          @click="onClick('create')"
          color="secondary"
          icon="add"
          :disable="draggingFab"
          padding="xs"
        />
      </q-fab>
      <q-fab
        style="min-width: 10vw"
        label="Add a CL"
        direction="left"
        color="primary"
        :disable="draggingFab"
        vertical-actions-align="right"
        icon="keyboard_arrow_left"
        padding="sm"
      >
        <q-fab-action
          label="Import"
          @click="onClick('import')"
          color="secondary"
          icon="add"
          :disable="draggingFab"
          padding="xs"
        />
        <q-fab-action
          label="Create"
          @click="onClick('create')"
          color="secondary"
          icon="add"
          :disable="draggingFab"
          padding="xs"
        />
      </q-fab>
      <q-fab
        style="min-width: 10vw"
        label="Add a CV"
        direction="left"
        color="primary"
        :disable="draggingFab"
        vertical-actions-align="right"
        icon="keyboard_arrow_left"
        padding="sm"
      >
        <q-fab-action
          label="Import"
          @click="onClick('import')"
          color="secondary"
          icon="add"
          :disable="draggingFab"
          padding="xs"
        />
        <q-fab-action
          label="Create"
          @click="onClick('create')"
          color="secondary"
          icon="add"
          :disable="draggingFab"
          padding="xs"
        />
      </q-fab>
    </q-fab>
  </q-page-sticky>
</template>
