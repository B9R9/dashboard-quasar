<template>
  <div class="col-12 q-pa-md">
    <q-card flat bordered @click="showOverview = true" class="q-pa-md" style="cursor: pointer;">
      <div class="row items-center q-mb-sm">
        <q-icon name="calendar_month" color="primary" size="32px" />
        <div class="text-h5 q-ml-sm">Planning Overview</div>
        <q-space />
        <q-btn
          v-if="planning.length"
          icon="search"
          flat
          round
          dense
          color="primary"
          @click.stop="showOverview = true"
        >
          <q-tooltip>View full schedule</q-tooltip>
        </q-btn>
      </div>
      <q-separator />
      <div v-if="planning.length && todayPlanning" class="q-mt-md">
        <div class="text-subtitle2 q-mb-xs">Today - {{ formatDate(todayPlanning.date) }}</div>
        <div v-if="todayPlanning.shifts.length > 0">
          <div v-for="shift in todayPlanning.shifts" :key="shift.id" class="shift-preview q-mb-xs">
            <q-badge :color="shift.color" text-color="white" class="q-mr-xs">{{ shift.position }}</q-badge>
            <span>{{ shift.employee }} ({{ shift.start }}-{{ shift.end }})</span>
          </div>
        </div>
        <div v-else class="text-grey-6 text-center q-py-md">
          No shifts scheduled today
        </div>
      </div>
      <div v-else class="q-mt-md text-grey-6 text-center">
        <q-icon name="event_busy" color="grey-5" size="22px" class="q-mr-sm" />
        <span>No schedule generated.</span>
        <div class="q-mt-md">
          <q-btn label="Configure Schedule" color="primary" @click.stop="showConfig = true" />
        </div>
      </div>
    </q-card>

    <!-- Dialog: Schedule Configuration -->
    <q-dialog v-model="showConfig">
      <q-card style="min-width: 500px; max-width: 700px; border-radius: 16px;">
        <q-card-section>
          <div class="row items-center">
            <q-icon name="settings" color="primary" size="28px" />
            <div class="text-h6 q-ml-sm">Schedule Configuration</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <!-- Step 1: Position Master Setup -->
          <q-expansion-item label="Configure Master" expand-separator>
            <div class="q-gutter-sm">
              <q-radio v-model="masterChoice" val="Create" label="Create new master" />
              <q-radio v-model="masterChoice" val="Select" label="Select existing master" />
            </div>

            <!-- Select existing master -->
            <div v-if="masterChoice === 'Select'" class="q-mb-md">
              <q-select
                v-model="selectedMaster"
                :options="availableMasters"
                label="Choose a master"
                outlined
                dense
                option-label="name"
                option-value="id"
              />
              <div v-if="selectedMaster" class="q-mt-md">
                <div class="text-caption">Selected master positions:</div>
                <div v-for="(pos, i) in selectedMaster.positions" :key="i" class="row items-center q-gutter-sm q-mb-xs">
                  <q-chip color="primary" text-color="white">{{ pos.name }}</q-chip>
                  <span class="q-ml-sm">{{ pos.start }} - {{ pos.end }}</span>
                </div>
                <q-btn label="Use this master" color="primary" class="q-my-md" @click="useSelectedMaster" />
              </div>
            </div>

            <!-- Create new master -->
            <div v-if="masterChoice === 'Create'">
              <div class="text-caption q-mb-md">
                Create positions needed for your store with their schedules.
              </div>
              <div class="row q-gutter-md q-mb-sm">
                <q-input v-model="master.name" label="Master name" outlined dense class="col" />
                <q-input v-model="master.start" label="Day start" type="time" outlined dense class="col" />
                <q-input v-model="master.end" label="Day end" type="time" outlined dense class="col" />
              </div>
              <div v-for="(pos, i) in positions" :key="i" class="row items-center q-gutter-sm q-mb-sm">
                <q-input v-model="pos.name" label="Position name" outlined dense class="col-4" />
                <q-input v-model="pos.start" label="Start" type="time" outlined dense class="col-3" />
                <q-input v-model="pos.end" label="End" type="time" outlined dense class="col-3" />
                <q-btn icon="delete" flat round dense color="negative" @click="positions.splice(i,1)" />
              </div>
              <q-btn
                label="Add position"
                color="primary"
                @click="positions.push({master: master.name, name: '', start: master.start, end: master.end})"
                class="q-my-sm"
              />
              <div>
                <q-btn
                  label="Save master"
                  color="primary"
                  @click="saveMaster"
                  :disable="!master.name || positions.length === 0 || positions.some(p => !p.name || !p.start || !p.end)"
                  class="q-mb-sm"
                />
              </div>
            </div>
          </q-expansion-item>

          <!-- Step 2: Add Employees -->
          <q-expansion-item label="Add Employees" expand-separator class="q-my-md">
            <div class="text-caption q-mb-md">
              Add your employees with their skills and preferences.
            </div>
            <div v-for="(emp, i) in employees" :key="i" class="q-pa-sm q-mb-sm bg-grey-1 rounded-borders">
              <div class="row q-gutter-sm">
                <q-input v-model="emp.firstName" label="First Name" outlined dense class="col" />
                <q-input v-model="emp.lastName" label="Last Name" outlined dense class="col" />
              </div>
              <q-select
                v-model="emp.skills"
                :options="allMasterPositions"
                label="Preferred positions"
                multiple
                outlined
                dense
                class="q-mb-sm"
                use-input
                use-chips
                stack-label
                option-label="name"
                option-value="id"
                emit-value
                map-options
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label v-if="scope.opt.group" class="text-bold text-primary">
                        {{ scope.opt.group }}
                      </q-item-label>
                      <q-item-label v-else>
                        {{ scope.opt.name }}
                      </q-item-label>
                      <q-item-label v-if="!scope.opt.group" caption>
                        {{ scope.opt.start }} - {{ scope.opt.end }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:selected-item="scope">
                  <q-chip
                    removable
                    @remove="scope.removeAtIndex(scope.index)"
                    :tabindex="scope.tabindex"
                    color="primary"
                    text-color="white"
                    class="q-ma-xs"
                  >
                    {{ getPositionNameById(scope.opt) }}
                  </q-chip>
                </template>
              </q-select>
              <q-select
                v-model="emp.daysOff"
                :options="[
                  { label: 'Sunday', value: 0 },
                  { label: 'Monday', value: 1 },
                  { label: 'Tuesday', value: 2 },
                  { label: 'Wednesday', value: 3 },
                  { label: 'Thursday', value: 4 },
                  { label: 'Friday', value: 5 },
                  { label: 'Saturday', value: 6 }
                ]"
                label="Days off"
                multiple
                outlined
                dense
                emit-value
                map-options
                class="q-mb-sm"
                placeholder="All days available"
              />
              <q-btn icon="delete" flat round dense color="negative" @click="employees.splice(i,1)" />
            </div>
            <q-btn
              label="Add employee"
              color="primary"
              class="q-my-sm"
              @click="addEmployee"
            />
          </q-expansion-item>

          <!-- Step 3: Generation -->
          <div class="q-mt-md">
            <q-btn
              label="Generate Schedule"
              color="primary"
              @click="generatePlanning"
              :loading="loading"
              :disable="!selectedMaster || employees.length === 0"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog: Full Schedule View -->
    <q-dialog v-model="showOverview" maximized>
      <q-card style="border-radius: 0;">
        <q-card-section>
          <div class="row items-center">
            <q-icon name="calendar_month" color="primary" size="28px" />
            <div class="text-h6 q-ml-sm">Full Schedule</div>
            <q-space />
            <q-select
              v-model="viewMode"
              :options="[
                { label: 'Day view', value: 'day' },
                { label: 'Week view', value: 'week' }
              ]"
              dense
              outlined
              option-label="label"
              option-value="value"
              emit-value
              map-options
              class="q-mr-md"
              style="width: 150px"
            />
            <q-btn icon="settings" flat round dense @click="showConfig = true">
              <q-tooltip>Configure schedule</q-tooltip>
            </q-btn>
            <q-btn icon="bar_chart" flat round dense @click="showStats = true">
              <q-tooltip>View stats</q-tooltip>
            </q-btn>
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row items-center q-mb-md">
            <q-select
              v-model="selectedWeek"
              :options="weekOptions"
              label="Week"
              dense
              outlined
              option-label="label"
              option-value="value"
              emit-value
              map-options
              class="col-2"
              v-if="planning.length"
            />
            <q-select
              v-if="viewMode === 'day'"
              v-model="selectedDay"
              :options="currentWeekDays.map((d, i) => ({ label: formatDate(d.date), value: i }))"
              label="Day"
              dense
              outlined
              option-label="label"
              option-value="value"
              emit-value
              map-options
              class="col-3 q-ml-md"
            />
          </div>

          <!-- Week view (employees in rows, days in columns) -->
          <div v-if="viewMode === 'week'" class="week-grid-view">
            <div class="week-grid-container">
              <!-- Header with days -->
              <div class="week-grid-header">
                <div class="employee-cell-header">Employee</div>
                <div v-for="(day, i) in currentWeekDays" :key="i" class="day-cell-header">
                  <div class="day-name">{{ formatDateShort(day.date) }}</div>
                  <div class="day-date">{{ formatDayNumber(day.date) }}</div>
                </div>
              </div>

              <!-- Rows per employee -->
              <div v-for="emp in employees" :key="emp.firstName + emp.lastName" class="week-grid-row">
                <div class="employee-cell">
                  <div class="employee-name">{{ emp.firstName }} {{ emp.lastName }}</div>
                </div>
                <div v-for="(day, dayIndex) in currentWeekDays" :key="dayIndex" class="day-cell">
                  <div
                    v-for="shift in getEmployeeShiftsForDay(emp, day)"
                    :key="shift.id"
                    class="shift-card"
                    :style="{ backgroundColor: getShiftColor(shift) }"
                  >
                    <div class="shift-position">{{ shift.position }}</div>
                    <div class="shift-hours">{{ shift.start }} - {{ shift.end }}</div>
                  </div>
                  <div v-if="getEmployeeShiftsForDay(emp, day).length === 0" class="no-shift">
                    <span v-if="isEmployeeDayOff(emp, day)">Off</span>
                    <span v-else class="text-grey-5">-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Day view (positions in rows, timeline in columns) -->
          <div v-if="viewMode === 'day' && currentWeekDays[selectedDay]" class="planning-day-view">
            <div class="text-h6 q-mb-md">{{ formatDate(currentWeekDays[selectedDay].date) }}</div>

            <!-- Timeline header -->
            <div class="timeline-container">
              <div class="timeline-header">
                <div class="position-label-header">Position</div>
                <div class="timeline-hours">
                  <div v-for="hour in timelineHours" :key="hour" class="hour-mark">
                    <span class="hour-text">{{ hour }}h</span>
                  </div>
                </div>
              </div>

              <!-- Shifts per position -->
              <div v-for="pos in selectedMaster.positions" :key="pos.name" class="position-row">
                <div class="position-label">
                  <q-chip :color="getPositionColor(pos.name)" text-color="white" dense>
                    {{ pos.name }}
                  </q-chip>
                </div>
                <div class="timeline-hours">
                  <!-- Bars for each employee on this position -->
                  <div
                    v-for="shift in getShiftsForPosition(currentWeekDays[selectedDay].shifts, pos.name)"
                    :key="shift.id"
                    class="shift-bar"
                    :style="getShiftBarStyle(shift)"
                  >
                    <span class="shift-employee-name">{{ shift.employee }}</span>
                    <span class="shift-time">{{ shift.start }} - {{ shift.end }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog: Employee Stats -->
    <q-dialog v-model="showStats">
      <q-card style="min-width: 400px; max-width: 600px; border-radius: 16px;">
        <q-card-section>
          <div class="row items-center">
            <q-icon name="bar_chart" color="primary" size="28px" />
            <div class="text-h6 q-ml-sm">Employee Statistics</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div v-for="emp in employees" :key="emp.firstName + emp.lastName" class="q-mb-md">
            <div class="text-bold">{{ emp.firstName }} {{ emp.lastName }}</div>
            <div class="text-caption">Positions: {{ getEmployeeSkillNames(emp.skills).join(', ') }}</div>
            <div class="text-caption">Days worked: {{ getDaysWorked(emp.firstName + ' ' + emp.lastName) }}</div>
            <div class="text-caption">Days off: {{ emp.daysOff?.map(d => dayLabel(d)).join(', ') || 'None' }}</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'TilePlanning',
  data () {
    return {
      master: { name: '', start: '09:00', end: '18:00' },
      masters: [
        {
          id: 1,
          name: 'Default Master',
          start: '09:00',
          end: '18:00',
          positions: [
            { name: 'Cashier', start: '09:00', end: '18:00' },
            { name: 'Sales', start: '10:00', end: '17:00' },
            { name: 'Manager', start: '09:00', end: '17:00' }
          ]
        },
        {
          id: 2,
          name: 'Evening Shift Master',
          start: '12:00',
          end: '21:00',
          positions: [
            { name: 'Cashier', start: '12:00', end: '21:00' },
            { name: 'Sales', start: '13:00', end: '20:00' }
          ]
        }
      ],
      selectedMaster: null,
      positions: [],
      employees: [
        {
          firstName: 'Marie',
          lastName: 'Dupont',
          skills: ['1-Cashier', '1-Sales'],
          daysOff: [0, 6]
        },
        {
          firstName: 'Jean',
          lastName: 'Martin',
          skills: ['1-Cashier', '1-Manager'],
          daysOff: [0, 3]
        },
        {
          firstName: 'Sophie',
          lastName: 'Bernard',
          skills: ['1-Sales'],
          daysOff: [1, 6]
        },
        {
          firstName: 'Pierre',
          lastName: 'Dubois',
          skills: ['1-Cashier', '1-Sales', '1-Manager'],
          daysOff: [2, 5]
        },
        {
          firstName: 'Emma',
          lastName: 'Petit',
          skills: ['1-Sales', '1-Manager'],
          daysOff: [0, 4]
        }
      ],
      planning: [],
      loading: false,
      showConfig: false,
      showOverview: false,
      showStats: false,
      selectedWeek: 1,
      selectedDay: 0,
      masterChoice: 'Select',
      viewMode: 'week'
    }
  },
  computed: {
    allMasterPositions () {
      const result = []
      this.availableMasters.forEach(master => {
        result.push({
          group: master.name,
          disable: true
        })
        master.positions.forEach(pos => {
          result.push({
            id: `${master.id}-${pos.name}`,
            name: pos.name,
            start: pos.start,
            end: pos.end,
            masterId: master.id
          })
        })
      })
      return result
    },
    availableMasters () {
      return this.masters
    },
    weekOptions () {
      const weeks = Math.ceil(this.planning.length / 7)
      return Array.from({ length: weeks }, (_, i) => ({ label: `Week ${i + 1}`, value: i + 1 }))
    },
    currentWeekDays () {
      if (!this.planning.length) return []
      const start = (this.selectedWeek - 1) * 7
      return this.planning.slice(start, start + 7)
    },
    timelineHours () {
      if (!this.selectedMaster) return []
      const start = parseInt(this.selectedMaster.start.split(':')[0])
      const end = parseInt(this.selectedMaster.end.split(':')[0])
      const hours = []
      for (let i = start; i <= end; i++) {
        hours.push(i)
      }
      return hours
    },
    todayPlanning () {
      if (!this.planning.length) return null
      const today = new Date().toISOString().split('T')[0]
      return this.planning.find(day => day.date === today) || this.planning[0]
    }
  },
  methods: {
    addEmployee () {
      this.employees.push({
        firstName: '',
        lastName: '',
        skills: [],
        daysOff: [6, 0]
      })
    },
    useSelectedMaster () {
      if (this.selectedMaster) {
        this.master = {
          name: this.selectedMaster.name,
          start: this.selectedMaster.start,
          end: this.selectedMaster.end
        }
        this.positions = [...this.selectedMaster.positions]
      }
    },
    saveMaster () {
      this.masters.push({
        id: Date.now(),
        name: this.master.name,
        start: this.master.start,
        end: this.master.end,
        positions: [...this.positions]
      })
      this.master = { name: '', start: '09:00', end: '18:00' }
      this.positions = []
    },
    generatePlanning () {
      this.loading = true
      setTimeout(() => {
        const days = []
        const positionColors = ['primary', 'secondary', 'accent', 'positive', 'warning', 'info']

        for (let d = 0; d < 21; d++) {
          const date = new Date()
          date.setDate(date.getDate() + d)
          const dayOfWeek = date.getDay()

          const day = {
            date: date.toISOString().split('T')[0],
            shifts: []
          }

          this.selectedMaster.positions.forEach((pos, posIndex) => {
            const availableEmployees = this.employees.filter(emp => {
              const hasSkill = emp.skills.some(skillId => {
                const posName = this.getPositionNameById(skillId)
                return posName === pos.name
              })
              const isAvailable = !emp.daysOff?.includes(dayOfWeek)
              return hasSkill && isAvailable
            })

            if (availableEmployees.length > 0) {
              const emp = availableEmployees[Math.floor(Math.random() * availableEmployees.length)]
              day.shifts.push({
                id: `${d}-${pos.name}-${emp.firstName}`,
                position: pos.name,
                employee: `${emp.firstName} ${emp.lastName}`,
                employeeFirstName: emp.firstName,
                employeeLastName: emp.lastName,
                start: pos.start,
                end: pos.end,
                color: positionColors[posIndex % positionColors.length]
              })
            }
          })

          days.push(day)
        }

        this.planning = days
        this.loading = false
        this.showConfig = false
        this.showOverview = true
      }, 1000)
    },
    getPositionNameById (id) {
      const pos = this.allMasterPositions.find(p => p.id === id)
      return pos ? pos.name : id
    },
    getEmployeeSkillNames (skills) {
      if (!skills) return []
      return skills.map(id => this.getPositionNameById(id))
    },
    getShiftsForPosition (shifts, positionName) {
      return shifts.filter(s => s.position === positionName)
    },
    getEmployeeShiftsForDay (employee, day) {
      const empFullName = `${employee.firstName} ${employee.lastName}`
      return day.shifts.filter(s => s.employee === empFullName)
    },
    isEmployeeDayOff (employee, day) {
      const date = new Date(day.date)
      const dayOfWeek = date.getDay()
      return employee.daysOff?.includes(dayOfWeek)
    },
    getShiftColor (shift) {
      const colors = {
        primary: '#1976D2',
        secondary: '#26A69A',
        accent: '#9C27B0',
        positive: '#21BA45',
        warning: '#F2C037',
        info: '#31CCEC'
      }
      return colors[shift.color] || colors.primary
    },
    getShiftBarStyle (shift) {
      const masterStart = parseInt(this.selectedMaster.start.split(':')[0])
      const masterEnd = parseInt(this.selectedMaster.end.split(':')[0])
      const totalHours = masterEnd - masterStart

      const shiftStart = parseInt(shift.start.split(':')[0]) + parseInt(shift.start.split(':')[1]) / 60
      const shiftEnd = parseInt(shift.end.split(':')[0]) + parseInt(shift.end.split(':')[1]) / 60

      const left = ((shiftStart - masterStart) / totalHours) * 100
      const width = ((shiftEnd - shiftStart) / totalHours) * 100

      const colors = {
        primary: '#1976D2',
        secondary: '#26A69A',
        accent: '#9C27B0',
        positive: '#21BA45',
        warning: '#F2C037',
        info: '#31CCEC'
      }

      return {
        left: `${left}%`,
        width: `${width}%`,
        backgroundColor: colors[shift.color] || colors.primary
      }
    },
    getPositionColor (position) {
      const colors = ['primary', 'secondary', 'accent', 'positive', 'warning', 'info']
      const idx = this.selectedMaster.positions.findIndex(p => p.name === position)
      return colors[idx % colors.length]
    },
    formatDate (dateStr) {
      const date = new Date(dateStr)
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`
    },
    formatDateShort (dateStr) {
      const date = new Date(dateStr)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      return days[date.getDay()]
    },
    formatDayNumber (dateStr) {
      const date = new Date(dateStr)
      return `${date.getDate()}/${date.getMonth() + 1}`
    },
    getDaysWorked (employeeName) {
      if (!this.planning.length) return 0
      return this.planning.reduce((acc, day) => {
        return acc + day.shifts.filter(s => s.employee === employeeName).length
      }, 0)
    },
    dayLabel (dayNum) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      return days[dayNum] || ''
    }
  }
}
</script>

<style scoped>
.shift-preview {
  font-size: 13px;
}

.planning-day-view {
  width: 100%;
}

/* Week view - Grid */
.week-grid-view {
  width: 100%;
  overflow-x: auto;
}

.week-grid-container {
  min-width: 900px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.week-grid-header {
  display: flex;
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
  font-weight: 600;
}

.employee-cell-header {
  width: 150px;
  padding: 16px 12px;
  border-right: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1976D2;
  color: white;
}

.day-cell-header {
  flex: 1;
  padding: 12px 8px;
  text-align: center;
  border-right: 1px solid #e0e0e0;
  min-width: 120px;
}

.day-cell-header:last-child {
  border-right: none;
}

.day-name {
  font-size: 12px;
  font-weight: 600;
  color: #1976D2;
  margin-bottom: 4px;
}

.day-date {
  font-size: 11px;
  color: #666;
}

.week-grid-row {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  min-height: 80px;
}

.week-grid-row:last-child {
  border-bottom: none;
}

.week-grid-row:nth-child(even) {
  background-color: #fafafa;
}

.employee-cell {
  width: 150px;
  padding: 12px;
  border-right: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
}

.employee-name {
  font-weight: 500;
  font-size: 13px;
  word-break: break-word;
}

.day-cell {
  flex: 1;
  padding: 8px;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
}

.day-cell:last-child {
  border-right: none;
}

.shift-card {
  padding: 8px;
  border-radius: 4px;
  color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  transition: transform 0.2s;
}

.shift-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.shift-position {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 2px;
}

.shift-hours {
  font-size: 10px;
  opacity: 0.9;
}

.no-shift {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 12px;
  color: #999;
}

/* Day view - Timeline */
.timeline-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.timeline-header {
  display: flex;
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
}

.position-label-header {
  width: 150px;
  padding: 12px;
  font-weight: 600;
  border-right: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
}

.timeline-hours {
  flex: 1;
  display: flex;
  position: relative;
  min-height: 60px;
}

.hour-mark {
  flex: 1;
  text-align: center;
  padding: 12px 4px;
  border-right: 1px solid #e0e0e0;
  position: relative;
}

.hour-mark:last-child {
  border-right: none;
}

.hour-text {
  font-size: 12px;
  font-weight: 500;
  color: #666;
}

.position-row {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  min-height: 70px;
}

.position-row:last-child {
  border-bottom: none;
}

.position-label {
  width: 150px;
  padding: 12px;
  border-right: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  background: #fafafa;
}

.shift-bar {
  position: absolute;
  height: 50px;
  top: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 12px;
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 1;
  transition: transform 0.2s, box-shadow 0.2s;
}

.shift-bar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  z-index: 2;
}

.shift-employee-name {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shift-time {
  font-size: 11px;
  opacity: 0.9;
  white-space: nowrap;
}
</style>
