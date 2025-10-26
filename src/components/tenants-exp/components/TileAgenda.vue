<script>
export default {
  name: 'TileAgenda',
  data () {
    return {
      planningDays: [
        {
          date: '2025-10-14',
          items: [
            { time: '09:00', event: 'Meeting with Team A', icon: 'groups', color: 'primary' },
            { time: '11:00', event: 'Project Review', icon: 'assignment', color: 'secondary' },
            { time: '14:00', event: 'Client Call', icon: 'call', color: 'accent' },
            { time: '16:00', event: 'Wrap-up and Emails', icon: 'email', color: 'info' }
          ]
        },
        {
          date: '2025-10-15',
          items: [
            { time: '10:00', event: 'Team Standup', icon: 'groups', color: 'primary' },
            { time: '13:00', event: 'Lunch with Client', icon: 'restaurant', color: 'positive' },
            { time: '15:00', event: 'Design Review', icon: 'brush', color: 'warning' }
          ]
        },
        {
          date: '2025-10-16',
          items: [
            { time: '09:30', event: 'Sprint Planning', icon: 'event', color: 'primary' },
            { time: '12:00', event: 'Documentation', icon: 'description', color: 'secondary' },
            { time: '17:00', event: 'Team Feedback', icon: 'feedback', color: 'accent' }
          ]
        }
      ],
      selectedDay: new Date().toISOString().split('T')[0],
      showDetails: false,
      today: new Date().toISOString().split('T')[0]
    }
  },
  computed: {
    todayPlanning () {
      const found = this.planningDays.find(day => day.date === this.today)
      return found ? found.items : []
    },
    planning () {
      if (!this.selectedDay) return []
      const selectedValue = typeof this.selectedDay === 'object' && this.selectedDay.value
        ? this.selectedDay.value
        : this.selectedDay
      if (selectedValue === this.today) {
        return this.todayPlanning
      }
      const found = this.planningDays.find(day => day.date === selectedValue)
      return found ? found.items : []
    },
    dayOptions () {
      return this.planningDays.map(day => ({
        label: day.date,
        value: day.date
      }))
    }
  }
}
</script>

<template>
  <div class="row justify-center items-center" style="width: 20%;">
    <q-card
      class="col-12 col-md-8 q-pa-md agenda-card"
      @click="showDetails = true"
      :style="{cursor: 'pointer', height: '100%', width: '90%'}"
      flat
      bordered
    >
      <div class="row items-center q-mb-sm">
        <q-icon name="calendar_month" color="primary" size="32px" />
        <div class="text-h5 q-ml-sm">Today's Planning</div>
        <q-space />
        <q-btn icon="search" flat round dense color="primary" @click.stop="showDetails = true">
          <q-tooltip>Voir tout le planning</q-tooltip>
        </q-btn>
      </div>
      <q-separator />
      <div v-if="todayPlanning.length" class="q-mt-md">
        <div v-for="item in todayPlanning" :key="item.time" class="row items-center q-mb-xs">
          <q-icon :name="item.icon" :color="item.color" size="22px" class="q-mr-sm" />
          <div class="text-subtitle2">{{ item.time }} - {{ item.event }}</div>
        </div>
      </div>
      <div v-else class="q-mt-md text-grey-6">
        <q-icon name="event_busy" color="grey-5" size="22px" class="q-mr-sm" />
        <span>Aucun événement prévu aujourd'hui.</span>
      </div>
    </q-card>

    <q-dialog v-model="showDetails">
      <q-card style="min-width: 350px; max-width: 400px; border-radius: 16px;">
        <q-card-section>
          <div class="row items-center">
            <q-icon name="calendar_month" color="primary" size="28px" />
            <div class="text-h6 q-ml-sm">Planning</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
          <q-select
            v-model="selectedDay"
            :options="dayOptions"
            label="Choisir un jour"
            dense
            outlined
            class="q-mt-md q-mb-md"
          />
          <div v-if="planning.length">
            <div v-for="item in planning" :key="item.time" class="row items-center q-mb-xs">
              <q-icon :name="item.icon" :color="item.color" size="20px" class="q-mr-sm" />
              <div class="text-subtitle2">{{ item.time }} - {{ item.event }}</div>
            </div>
          </div>
          <div v-else class="text-caption text-grey-6 q-mt-md">
            <q-icon name="event_busy" color="grey-5" size="20px" class="q-mr-sm" />
            Aucune planification pour ce jour.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Fermer" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.agenda-card {
  border: 2px solid #26a69a;
  border-radius: 12px;
  transition: box-shadow 0.2s;
}
.agenda-card:hover {
  box-shadow: 0 4px 24px 0 rgba(38,166,154,0.15);
  border-color: #009688;
}
</style>
