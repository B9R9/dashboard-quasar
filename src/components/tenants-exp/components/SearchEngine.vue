<script>
import * as typesenseService from '../typesense/typesenseService.js'

export default {
  name: 'SearchEngine',
  props: {
    themeSelected: {
      type: String,
      default: null
    },
    image: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      searchQuery: '',
      results: [],
      searching: false
    }
  },
  methods: {
    async performSearch () {
      if (this.searchQuery.trim() === '') {
        this.results = []
        return
      }

      this.searching = true
      const userSearch = this.searchQuery.trim()

      try {
        const response = await typesenseService.search(userSearch, 'search_articles')
        console.log('Search results:', response)
        this.results = response.hits.map(hit => hit.document)
        console.log('Mapped results:', this.results)
      } catch (error) {
        console.error('Error performing search:', error)
        this.results = []
      } finally {
        this.searching = false
      }
    },
    clearSearch () {
      this.searchQuery = ''
      this.results = []
    }
  },
  computed: {
    textClass () {
      return `text-themed-${this.themeSelected}`
    },
    bgClass () {
      return `bg-themed-${this.themeSelected}`
    },
    textColor () {
      const colors = {
        classicLight: '#222222',
        elegantDark: '#E0E0E0',
        gentleNature: '#2E3D2F',
        warmEnergy: '#4A2C2A'
      }
      return colors[this.themeSelected] || '#222'
    },
    accentColor () {
      const colors = {
        classicLight: '#007BFF',
        elegantDark: '#BB86FC',
        gentleNature: '#A4DE02',
        warmEnergy: '#F4A261'
      }
      return colors[this.themeSelected] || '#007BFF'
    }
  }
}
</script>

<template>
  <div>
    <!-- Search Container with Image -->
    <div
      v-if="image"
      class="row items-center justify-center q-pa-md search-container"
      :style="{
        minHeight: '300px',
        width: '100%',
        backgroundImage: `url('${image}')`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '--input-text-color': textColor,
        '--input-accent-color': accentColor
      }"
    >
      <div class="col-12 col-md-8 col-lg-6">
        <q-input
          v-model="searchQuery"
          label="Ask me anything..."
          rounded
          outlined
          clearable
          @keyup.enter="performSearch"
          @clear="clearSearch"
          bg-color="grey-2"
        >
          <template v-slot:append>
            <q-icon
              name="search"
              class="cursor-pointer"
              @click="performSearch"
            />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Search Container without Image -->
    <div
      v-else
      class="row items-center justify-center q-pa-md search-container"
      :class="bgClass"
      :style="{
        minHeight: '300px',
        width: '100%',
        '--input-text-color': textColor,
        '--input-accent-color': accentColor
      }"
    >
      <div class="col-12 col-md-8 col-lg-6">
        <q-input
          v-model="searchQuery"
          label="Ask me anything..."
          rounded
          outlined
          clearable
          @keyup.enter="performSearch"
          @clear="clearSearch"
          bg-color="grey-2"
        >
          <template v-slot:append>
            <q-icon
              name="search"
              class="cursor-pointer"
              @click="performSearch"
            />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="searching || results.length > 0" class="q-pa-md">
      <div class="row justify-center">
        <div class="col-12 col-md-10 col-lg-8">
          <!-- Loading State -->
          <!-- <div v-if="searching" class="row justify-center q-py-xl">
            <q-spinner-dots color="primary" size="50px" />
            <div class="col-12 text-center q-mt-md text-grey-7">
              Searching...
            </div>
          </div> -->

          <!-- Results Found -->
          <div v-if="results.length > 0">
            <div class="text-h6 q-mb-md">
              {{ results.length }} result{{ results.length > 1 ? 's' : '' }} found
            </div>

            <q-list bordered separator class="rounded-borders">
              <q-item
                v-for="(result, index) in results"
                :key="index"
                clickable
                v-ripple
                class="q-pa-md"
              >
                <q-item-section>
                  <q-item-label class="text-h6 q-mb-sm">
                    {{ result.title || 'Untitled' }}
                  </q-item-label>
                  <q-item-label caption class="text-body2 q-mb-sm">
                    {{ result.description || result.content || 'No description available' }}
                  </q-item-label>
                  <q-item-label caption class="text-grey-6">
                    <q-icon name="link" size="xs" class="q-mr-xs" />
                    {{ result.url || result.source || 'Source not available' }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-icon name="arrow_forward" color="grey-5" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- No Results -->
          <div v-else class="text-center q-py-xl">
            <q-icon name="search_off" size="64px" color="grey-5" />
            <div class="text-h6 q-mt-md text-grey-7">
              No results found
            </div>
            <div class="text-body2 text-grey-6 q-mt-sm">
              Try adjusting your search query
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container >>> .q-field__native,
.search-container >>> .q-field__label {
  color: var(--input-text-color) !important;
}

.search-container >>> .q-field__control {
  color: var(--input-accent-color) !important;
  border-color: var(--input-accent-color) !important;
}

.search-container >>> .q-field__control:before {
  border-color: var(--input-accent-color) !important;
}

.search-container >>> .q-field--outlined .q-field__control:before {
  border-color: var(--input-accent-color) !important;
}

.q-item {
  transition: background-color 0.3s ease;
}

.q-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
