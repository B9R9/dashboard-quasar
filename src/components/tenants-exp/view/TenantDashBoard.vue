<script>
import ChatBot from '../components/ChatBot.vue'
import FeedNews from '../components/FeedNews.vue'
import SearchEngine from '../components/SearchEngine.vue'
import SupportFab from '../components/SupportFab.vue'
import TileAffluence from '../components/TileAffluence.vue'
import TileAffluenceDay from '../components/TileAffluenceDay.vue'
import TileAgenda from '../components/TileAgenda.vue'
import TileBudget from '../components/TileBudget.vue'
import TilePlanning from '../components/TilePlanning.vue'
import TileStatistic from '../components/TileStatistic.vue'
import TileWeather from '../components/TileWeather.vue'

import { themes, getThemeByName } from '../utils/themes.js'

export default {
  name: 'TenantDashBoard',
  components: {
    ChatBot,
    FeedNews,
    SearchEngine,
    SupportFab,
    TileAffluence,
    TileAffluenceDay,
    TileAgenda,
    TileBudget,
    TilePlanning,
    TileStatistic,
    TileWeather
  },
  data () {
    return {
      draggingFabActive: true,
      drawerRight: false,
      today: new Date()
        .toLocaleDateString('fi',
          { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      notifications: [
        { id: 1, text: 'Your offer has been rejected' },
        { id: 2, text: 'Report your sale' },
        { id: 3, text: 'New message from John' }
      ],
      searchImage: '',
      showNotifMenu: false,
      showParamMenu: false,
      theme: themes.classicLight,
      themeSelected: 'classicLight',
      tiles: [
        { id: 'affluence', name: 'Affluence', icon: 'people', visible: true, component: 'TileAffluence' },
        { id: 'affluenceDay', name: 'Affluence Day', icon: 'event', visible: true, component: 'TileAffluenceDay' },
        { id: 'budget', name: 'Budget', icon: 'account_balance', visible: true, component: 'TileBudget' },
        { id: 'agenda', name: 'Agenda', icon: 'calendar_today', visible: true, component: 'TileAgenda' },
        { id: 'statistic', name: 'Statistic', icon: 'bar_chart', visible: true, component: 'TileStatistic' }
      ],
      quickLinks: [
        { id: 1, name: 'Profile', icon: 'person', route: '/profile' },
        { id: 2, name: 'Settings', icon: 'settings', route: '/settings' },
        { id: 3, name: 'Help', icon: 'help', route: '/help' },
        { id: 4, name: 'Analytics', icon: 'analytics', route: '/analytics' },
        { id: 5, name: 'Reports', icon: 'description', route: '/reports' }
      ],
      newQuickLink: {
        name: '',
        icon: '',
        route: ''
      },
      showAddQuickLinkDialog: false,
      availableIcons: [
        'home', 'dashboard', 'person', 'settings', 'help', 'info',
        'analytics', 'description', 'search', 'shopping_cart',
        'favorite', 'star', 'email', 'phone', 'notifications',
        'calendar_today', 'folder', 'cloud', 'security', 'language',
        'work', 'business', 'storefront', 'attach_money', 'trending_up',
        'account_circle', 'group', 'support', 'lightbulb', 'insights'
      ]
    }
  },
  computed: {
    themeApplied () {
      return getThemeByName(this.themeSelected)
    },
    visibleTiles () {
      return this.tiles.filter(tile => tile.visible)
    }
  },
  methods: {
    moveTileUp (index) {
      if (index > 0) {
        const temp = this.tiles[index]
        this.tiles[index] = this.tiles[index - 1]
        this.tiles[index - 1] = temp
      }
    },
    moveTileDown (index) {
      if (index < this.tiles.length - 1) {
        const temp = this.tiles[index]
        this.tiles[index] = this.tiles[index + 1]
        this.tiles[index + 1] = temp
      }
    },
    openContact () {
      console.log('Open contact')
    },
    openNotifMenu () {
      this.showNotifMenu = true
    },
    onImageSelected (files) {
      if (files && files.length > 0) {
        const file = files[0]
        this.searchImage = URL.createObjectURL(file)
      }
    },
    onParams () {
      this.showParamMenu = !this.showParamMenu
    },
    closeNotifMenu () {
      if (this.showNotifMenu) return
      this.showNotifMenu = false
    },
    navigateTo (route) {
      if (route.startsWith('http://') || route.startsWith('https://')) {
        window.open(route, '_blank')
      } else {
        this.$router.push(route)
      }
    },
    addQuickLink () {
      if (this.newQuickLink.name && this.newQuickLink.icon && this.newQuickLink.route) {
        const newId = Math.max(...this.quickLinks.map(q => q.id), 0) + 1
        this.quickLinks.push({
          id: newId,
          name: this.newQuickLink.name,
          icon: this.newQuickLink.icon,
          route: this.newQuickLink.route
        })
        this.resetQuickLinkForm()
        this.showAddQuickLinkDialog = false
        this.$q.notify({
          type: 'positive',
          message: 'Quick link added successfully!',
          position: 'top'
        })
      }
    },
    resetQuickLinkForm () {
      this.newQuickLink = {
        name: '',
        icon: '',
        route: ''
      }
    },
    removeQuickLink (id) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to delete this quick link?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.quickLinks = this.quickLinks.filter(link => link.id !== id)
        this.$q.notify({
          type: 'positive',
          message: 'Quick link deleted',
          position: 'top'
        })
      })
    },
    moveQuickLinkUp (index) {
      if (index > 0) {
        const temp = this.quickLinks[index]
        this.quickLinks[index] = this.quickLinks[index - 1]
        this.quickLinks[index - 1] = temp
      }
    },
    moveQuickLinkDown (index) {
      if (index < this.quickLinks.length - 1) {
        const temp = this.quickLinks[index]
        this.quickLinks[index] = this.quickLinks[index + 1]
        this.quickLinks[index + 1] = temp
      }
    }
  }
}
</script>

<template>
  <q-layout view="lhh LpR lff" style="height: 100vh">
    <q-page-container>
      <q-drawer
        v-model="drawerRight"
        side="right"
        :width="400"
        behavior="desktop"
        elevated
        :class="`bg-themed-${themeSelected} text-themed-${themeSelected} row justify-center align-center`"
      >
        <chat-bot
          :theme-selected="themeSelected"
          @close="drawerRight = false"
        />
      </q-drawer>

      <div class="col-12">
        <search-engine :themeSelected="themeSelected" :image="searchImage"/>
      </div>

      <div class="q-pa-md col-12 row items-center" :class="`bg-themed-${themeSelected} title-themed-${themeSelected}`">
        <div class="col-auto q-mr-md">
          <tile-weather
            :class="`bg-themed-${themeSelected} title-themed-${themeSelected}`"
            :themeSelected="themeSelected"
          />
        </div>
        <div class="text-left col-2 q-mr-md">
          <p class="text-h6 q-mb-none">{{ today.split(' ')[0] }}</p>
          <p class="text-subtitle2 q-mb-none">{{ today.split(' ').slice(1).join(' ') }}</p>
        </div>

        <h1 class="text-left col">Dashboard</h1>

        <q-space />
        <div class="row col-1 justify-around">
          <div style="position: relative; display: inline-block;">
            <q-icon
              name="notifications"
              size="20px"
              ref="notifIcon"
              class="text-center cursor-pointer"
              @mouseenter="openNotifMenu"
              @mouseleave="closeNotifMenu"
            />
            <q-badge
              v-if="notifications.length > 0"
              color="red"
              floating
              style="position: absolute; top: -8px; right: -8px;"
            >
              {{ notifications.length }}
            </q-badge>
            <q-menu
              :target="$refs.notifIcon && $refs.notifIcon.$el"
              anchor="bottom right"
              self="top right"
              transition-show="jump-down"
              transition-hide="jump-up"
              v-model="showNotifMenu"
              @mouseenter="openNotifMenu"
              @mouseleave="closeNotifMenu"
            >
              <q-list style="min-width:200px">
                <q-item v-for="notif in notifications" :key="notif.id" clickable>
                  <q-item-section>{{ notif.text }}</q-item-section>
                </q-item>
                <q-item v-if="notifications.length === 0">
                  <q-item-section>
                    <span class="text-grey">Aucune notification</span>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
          <div style="position: relative; display: inline-block;">
            <q-icon name="mail" size="20px" class="text-center cursor-pointer" />
            <q-badge
              color="red"
              floating
              style="position: absolute; top: -8px; right: -8px;"
            >
              3
            </q-badge>
          </div>
          <q-icon
            name="contacts"
            size="20px"
            class="text-center cursor-pointer"
            @click="openContact"
          />
          <q-icon
            name="settings"
            size="20px"
            class="text-center cursor-pointer"
            @click="onParams"
          />
        </div>
      </div>

      <!-- Quick Links Section -->
      <div class="q-pa-md col-12" :class="`bg-themed-${themeSelected}`">
        <div class="row items-center q-mb-md">
          <q-icon name="link" size="24px" class="q-mr-sm" :class="`title-themed-${themeSelected}`" />
          <div class="text-h6" :class="`title-themed-${themeSelected}`">Quick Links</div>
        </div>
        <div class="row q-gutter-sm">
          <q-btn
            v-for="link in quickLinks"
            :key="link.id"
            unelevated
            :icon="link.icon"
            :color="themeApplied.colors.accent"
            text-color="black"
            class="quick-link-btn"
            @click="navigateTo(link.route)"
          >
            <q-tooltip :offset="[0, 8]">{{ link.name }}</q-tooltip>
          </q-btn>
        </div>
      </div>

      <div
        class="col-12 row justify-around q-pa-md"
        style="height: 10%"
        :class="`bg-themed-${themeSelected} title-themed-${themeSelected}`"
      >
        <component
          v-for="tile in visibleTiles"
          :key="tile.id"
          :is="tile.component"
          :themeSelected="themeSelected"
        />
        <div class="col-12 q-ma-md row">
          <tile-planning />
        </div>
      </div>

      <support-fab
        @open-chat="drawerRight = !drawerRight"
        :active="draggingFabActive"
        :theme-selected="themeSelected"
      />
    </q-page-container>
  </q-layout>

  <!-- Settings Dialog -->
  <q-dialog v-model="showParamMenu">
    <q-card style="min-width: 600px; max-width: 800px; border-radius: 16px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 text-weight-medium">Settings</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator class="q-mt-md" />

      <q-card-section class="q-pt-md" style="max-height: 70vh; overflow-y: auto;">
        <div class="q-gutter-md">
          <!-- FAB Toggle -->
          <div class="row items-center q-pa-sm bg-grey-1 rounded-borders">
            <q-icon name="touch_app" size="24px" class="q-mr-md text-primary" />
            <div class="col">
              <div class="text-subtitle2 text-weight-medium">FAB Dragging</div>
              <div class="text-caption text-grey-7">Enable floating button drag</div>
            </div>
            <q-toggle
              v-model="draggingFabActive"
              color="primary"
              size="lg"
            />
          </div>

          <!-- Theme Selector -->
          <div class="q-mt-md">
            <div class="text-subtitle2 text-weight-medium q-mb-sm">
              <q-icon name="palette" class="q-mr-xs" />
              Theme
            </div>
            <q-select
              v-model="themeSelected"
              :options="[
                { label: 'Classic Light', value: 'classicLight', icon: 'wb_sunny' },
                { label: 'Elegant Dark', value: 'elegantDark', icon: 'nights_stay' },
                { label: 'Gentle Nature', value: 'gentleNature', icon: 'eco' },
                { label: 'Warm Energy', value: 'warmEnergy', icon: 'local_fire_department' }
              ]"
              label="Select theme"
              emit-value
              map-options
              outlined
              dense
              class="q-mt-sm"
            >
              <template v-slot:prepend>
                <q-icon name="palette" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Image Upload -->
          <div class="q-mt-md">
            <div class="text-subtitle2 text-weight-medium q-mb-sm">
              <q-icon name="image" class="q-mr-xs" />
              Search Background
            </div>
            <q-uploader
              url=""
              label="Upload or drag image"
              :auto-upload="false"
              @added="onImageSelected"
              accept="image/*"
              style="width: 100%"
              flat
              bordered
              class="q-mt-sm"
            >
              <template v-slot:header="scope">
                <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                  <q-btn
                    v-if="scope.queuedFiles.length > 0"
                    icon="clear_all"
                    @click="scope.removeQueuedFiles"
                    round
                    dense
                    flat
                  >
                    <q-tooltip>Clear All</q-tooltip>
                  </q-btn>
                  <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                  <div class="col">
                    <div class="q-uploader__title">{{ scope.label }}</div>
                  </div>
                  <q-btn
                    v-if="scope.canAddFiles"
                    type="a"
                    icon="add_box"
                    round
                    dense
                    flat
                  >
                    <q-uploader-add-trigger />
                    <q-tooltip>Pick Files</q-tooltip>
                  </q-btn>
                </div>
              </template>
            </q-uploader>
            <div v-if="searchImage" class="q-mt-sm">
              <q-img
                :src="searchImage"
                style="height: 100px; border-radius: 8px;"
                fit="cover"
              >
                <div class="absolute-bottom text-subtitle2 text-center">
                  Preview
                </div>
              </q-img>
            </div>
          </div>

          <!-- Quick Links Configuration -->
          <div class="q-mt-md">
            <div class="row items-center q-mb-sm">
              <div class="text-subtitle2 text-weight-medium">
                <q-icon name="link" class="q-mr-xs" />
                Quick Links
              </div>
              <q-space />
              <q-btn
                icon="add"
                color="primary"
                size="sm"
                round
                flat
                @click="showAddQuickLinkDialog = true"
              >
                <q-tooltip>Add Quick Link</q-tooltip>
              </q-btn>
            </div>
            <div class="text-caption text-grey-7 q-mb-md">
              Manage your quick access links
            </div>

            <q-list bordered separator class="rounded-borders">
              <q-item
                v-for="(link, index) in quickLinks"
                :key="link.id"
                class="q-pa-sm"
              >
                <q-item-section avatar>
                  <q-icon :name="link.icon" color="primary" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ link.name }}</q-item-label>
                  <q-item-label caption>{{ link.route }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center q-gutter-xs">
                    <q-btn
                      icon="arrow_upward"
                      flat
                      round
                      dense
                      size="sm"
                      :disable="index === 0"
                      @click="moveQuickLinkUp(index)"
                    >
                      <q-tooltip>Move up</q-tooltip>
                    </q-btn>

                    <q-btn
                      icon="arrow_downward"
                      flat
                      round
                      dense
                      size="sm"
                      :disable="index === quickLinks.length - 1"
                      @click="moveQuickLinkDown(index)"
                    >
                      <q-tooltip>Move down</q-tooltip>
                    </q-btn>

                    <q-btn
                      icon="delete"
                      flat
                      round
                      dense
                      size="sm"
                      color="negative"
                      @click="removeQuickLink(link.id)"
                    >
                      <q-tooltip>Delete</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>

              <q-item v-if="quickLinks.length === 0">
                <q-item-section class="text-center text-grey-6">
                  No quick links yet. Add one!
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Tiles Configuration -->
          <div class="q-mt-md">
            <div class="text-subtitle2 text-weight-medium q-mb-sm">
              <q-icon name="dashboard" class="q-mr-xs" />
              Dashboard Tiles
            </div>
            <div class="text-caption text-grey-7 q-mb-md">
              Show/hide tiles and reorder them
            </div>

            <q-list bordered separator class="rounded-borders">
              <q-item
                v-for="(tile, index) in tiles"
                :key="tile.id"
                class="q-pa-sm"
              >
                <q-item-section avatar>
                  <q-icon :name="tile.icon" color="primary" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ tile.name }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center q-gutter-xs">
                    <q-toggle
                      v-model="tile.visible"
                      color="primary"
                      size="sm"
                    />

                    <q-btn
                      icon="arrow_upward"
                      flat
                      round
                      dense
                      size="sm"
                      :disable="index === 0"
                      @click="moveTileUp(index)"
                    >
                      <q-tooltip>Move up</q-tooltip>
                    </q-btn>

                    <q-btn
                      icon="arrow_downward"
                      flat
                      round
                      dense
                      size="sm"
                      :disable="index === tiles.length - 1"
                      @click="moveTileDown(index)"
                    >
                      <q-tooltip>Move down</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>

      <q-separator class="q-mt-md" />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Cancel"
          color="grey-7"
          v-close-popup
        />
        <q-btn
          unelevated
          label="Apply"
          color="primary"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Add Quick Link Dialog -->
  <q-dialog v-model="showAddQuickLinkDialog">
    <q-card style="min-width: 400px; border-radius: 12px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Add Quick Link</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="resetQuickLinkForm" />
      </q-card-section>

      <q-separator class="q-my-sm" />

      <q-card-section>
        <div class="q-gutter-md">
          <!-- Name -->
          <q-input
            v-model="newQuickLink.name"
            label="Link Name *"
            outlined
            dense
            hint="This will appear in the tooltip"
          >
            <template v-slot:prepend>
              <q-icon name="label" />
            </template>
          </q-input>

          <!-- Icon -->
          <q-select
            v-model="newQuickLink.icon"
            :options="availableIcons"
            label="Icon *"
            outlined
            dense
            emit-value
            map-options
          >
            <template v-slot:prepend>
              <q-icon name="interests" />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-icon :name="scope.opt" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <div class="row items-center" v-if="newQuickLink.icon">
                <q-icon :name="newQuickLink.icon" class="q-mr-sm" />
                <span>{{ newQuickLink.icon }}</span>
              </div>
            </template>
          </q-select>

          <!-- Route/URL -->
          <q-input
            v-model="newQuickLink.route"
            label="Route or URL *"
            outlined
            dense
            hint="Internal route (/profile) or external URL (https://...)"
          >
            <template v-slot:prepend>
              <q-icon name="link" />
            </template>
          </q-input>

          <!-- Preview -->
          <div v-if="newQuickLink.name && newQuickLink.icon" class="q-mt-md">
            <div class="text-caption text-grey-7 q-mb-xs">Preview:</div>
            <q-btn
              unelevated
              :icon="newQuickLink.icon"
              color="primary"
              text-color="white"
              disable
            >
              <q-tooltip>{{ newQuickLink.name }}</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Cancel"
          color="grey-7"
          @click="resetQuickLinkForm(); showAddQuickLinkDialog = false"
        />
        <q-btn
          unelevated
          label="Add"
          color="primary"
          @click="addQuickLink"
          :disable="!newQuickLink.name || !newQuickLink.icon || !newQuickLink.route"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.quick-link-btn {
  min-width: 56px;
  height: 56px;
  transition: all 0.3s ease;
}

.quick-link-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
