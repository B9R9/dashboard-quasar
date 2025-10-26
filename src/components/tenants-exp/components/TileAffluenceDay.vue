<script>
import { Chart, registerables } from 'chart.js'
import MLR from 'ml-regression-multivariate-linear'
import { getThemeByName } from '../utils/themes.js'

Chart.register(...registerables)

export default {
  name: 'TileAffluenceDay',
  props: {
    themeSelected: {
      type: String,
      default: 'classicLight'
    }
  },
  data () {
    return {
      todayAffluence: 0,
      historicalData: [],
      dailyPredictions: [],
      loading: true,
      showDialog: false,
      model: null,
      modelTrained: false,
      aiAnalysis: null,
      loadingAnalysis: false,
      showAiDialog: false
    }
  },
  computed: {
    currentTheme () {
      return getThemeByName(this.themeSelected)
    },
    cardBgColor () {
      return this.currentTheme.colors.background
    },
    textColor () {
      return this.currentTheme.colors.text
    },
    titleColor () {
      return this.currentTheme.colors.title
    },
    accentColor () {
      return this.currentTheme.colors.accent
    }
  },
  async mounted () {
    await this.loadHistoricalData()
    await this.trainModel()
    await this.generateDailyPredictions()
  },
  watch: {
    showDialog (val) {
      if (val) {
        this.$nextTick(() => {
          this.renderChart()
        })
      }
    }
  },
  methods: {
    async loadHistoricalData () {
      this.historicalData = this.generateSyntheticData(90)
      this.todayAffluence = this.historicalData[this.historicalData.length - 1].visitors
    },

    generateSyntheticData (days) {
      const data = []
      const baseDate = new Date()
      baseDate.setDate(baseDate.getDate() - days)

      for (let i = 0; i < days; i++) {
        const currentDate = new Date(baseDate)
        currentDate.setDate(baseDate.getDate() + i)

        const dayOfWeek = currentDate.getDay()
        const month = currentDate.getMonth()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0
        const isHoliday = this.checkHoliday(currentDate) ? 1 : 0

        const baseVisitors = 500
        const seasonalFactor = 1 + 0.3 * Math.sin((month / 12) * 2 * Math.PI)
        const weekendFactor = isWeekend ? 1.3 : 1
        const holidayFactor = isHoliday ? 1.5 : 1
        const weather = Math.floor(Math.random() * 3)
        const weatherFactor = [0.8, 1, 1.2][weather]
        const temp = 15 + 10 * Math.sin((month / 12) * 2 * Math.PI)
        const events = Math.random() > 0.9 ? 1 : 0
        const eventFactor = events ? 1.4 : 1

        const visitors = Math.round(
          baseVisitors * seasonalFactor * weekendFactor * holidayFactor * weatherFactor * eventFactor
        )

        data.push({
          date: currentDate.toISOString().split('T')[0],
          visitors,
          dayOfWeek,
          isWeekend,
          isHoliday,
          weather,
          temp: Math.round(temp),
          events
        })
      }

      return data
    },

    checkHoliday (date) {
      const month = date.getMonth()
      const day = date.getDate()
      if ((month === 11 && day >= 20) || (month === 0 && day <= 7)) return true
      if (month === 6 || month === 7) return true
      return false
    },

    async trainModel () {
      console.log('🧠 Training regression model...')

      const x = this.historicalData.map(d => [
        d.dayOfWeek / 7,
        d.isWeekend,
        d.isHoliday,
        d.weather / 2,
        d.temp / 30,
        d.events
      ])

      const y = this.historicalData.map(d => [d.visitors])

      this.model = new MLR(x, y)

      console.log('✅ Model trained!')
      this.modelTrained = true
    },

    async generateDailyPredictions () {
      if (!this.modelTrained) return

      const today = new Date()
      this.dailyPredictions = []

      for (let i = 0; i <= 10; i++) {
        const targetDate = new Date(today)
        targetDate.setDate(today.getDate() + i)

        const dayOfWeek = targetDate.getDay()
        const month = targetDate.getMonth()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0
        const isHoliday = this.checkHoliday(targetDate) ? 1 : 0

        const weather = this.getWeatherForecast(targetDate)
        const weatherCode = { sunny: 2, cloudy: 1, rainy: 0, snowy: 0 }[weather] || 1

        const temp = 15 + 10 * Math.sin((month / 12) * 2 * Math.PI)
        const events = this.checkEventDay(targetDate) ? 1 : 0

        const prediction = this.model.predict([
          dayOfWeek / 7,
          isWeekend,
          isHoliday,
          weatherCode / 2,
          temp / 30,
          events
        ])

        const visitors = Math.round(Math.max(0, prediction[0]))

        this.dailyPredictions.push({
          date: targetDate.toLocaleDateString('en-US'),
          dateObj: targetDate,
          dayName: this.getDayName(targetDate),
          visitors,
          weather,
          isWeekend: isWeekend === 1,
          isHoliday: isHoliday === 1,
          hasEvent: events === 1,
          confidence: 0.85 + Math.random() * 0.1
        })
      }

      this.loading = false
    },

    getWeatherForecast (date) {
      const month = date.getMonth()
      if ([11, 0, 1].includes(month)) return Math.random() > 0.6 ? 'cloudy' : 'rainy'
      if ([6, 7, 8].includes(month)) return Math.random() > 0.7 ? 'sunny' : 'cloudy'
      return Math.random() > 0.5 ? 'sunny' : 'cloudy'
    },

    checkEventDay (date) {
      const month = date.getMonth()
      const day = date.getDate()
      if (month === 10 && day >= 24 && date.getDay() === 5) return true
      if ((month === 0 && day <= 31) || (month === 6)) return true
      return false
    },

    getDayName (date) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return days[date.getDay()]
    },

    getTrend () {
      if (this.dailyPredictions.length < 2) return 'stable'
      const first = this.dailyPredictions[0].visitors
      const last = this.dailyPredictions[this.dailyPredictions.length - 1].visitors
      const growth = ((last - first) / first) * 100
      if (growth > 5) return 'increase'
      if (growth < -5) return 'decrease'
      return 'stable'
    },

    getAverageDaily () {
      if (this.dailyPredictions.length === 0) return 0
      const total = this.dailyPredictions.reduce((sum, d) => sum + d.visitors, 0)
      return Math.round(total / this.dailyPredictions.length)
    },

    getPeakDay () {
      if (this.dailyPredictions.length === 0) return 'N/A'
      const max = Math.max(...this.dailyPredictions.map(p => p.visitors))
      const peak = this.dailyPredictions.find(p => p.visitors === max)
      return peak ? `${peak.dayName.substr(0, 3)} ${peak.date.split('/')[0]}` : 'N/A'
    },

    openDialog () {
      this.showDialog = true
    },

    renderChart () {
      const ctx = this.$refs.chart
      if (!ctx) return

      if (this._chartInstance) {
        this._chartInstance.destroy()
      }

      const labels = this.dailyPredictions.map(d => `${d.dayName.substr(0, 3)} ${d.date.split('/')[0]}`)
      const data = this.dailyPredictions.map(d => d.visitors)
      const colors = this.dailyPredictions.map(d =>
        d.isWeekend ? this.accentColor + 'AA' : this.accentColor + '66'
      )

      this._chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Predicted Visitors',
            data,
            backgroundColor: colors,
            borderColor: this.accentColor,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false,
              labels: {
                color: this.textColor
              }
            },
            title: {
              display: true,
              text: 'Footfall Predictions - Next 10 Days',
              color: this.titleColor
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: this.textColor
              },
              grid: {
                color: this.textColor + '20'
              }
            },
            x: {
              ticks: {
                color: this.textColor
              },
              grid: {
                color: this.textColor + '20'
              }
            }
          }
        }
      })
    },

    async requestAiAnalysis () {
      this.loadingAnalysis = true
      this.showAiDialog = true

      await new Promise(resolve => setTimeout(resolve, 2000))

      const avg = this.getAverageDaily()
      const peak = this.dailyPredictions.reduce((max, p) => p.visitors > max.visitors ? p : max, this.dailyPredictions[0])
      const low = this.dailyPredictions.reduce((min, p) => p.visitors < min.visitors ? p : min, this.dailyPredictions[0])
      const weekendDays = this.dailyPredictions.filter(p => p.isWeekend)
      const weekdayDays = this.dailyPredictions.filter(p => !p.isWeekend)
      const avgWeekend = weekendDays.length > 0 ? Math.round(weekendDays.reduce((sum, d) => sum + d.visitors, 0) / weekendDays.length) : 0
      const avgWeekday = weekdayDays.length > 0 ? Math.round(weekdayDays.reduce((sum, d) => sum + d.visitors, 0) / weekdayDays.length) : 0
      const trend = this.getTrend()

      this.aiAnalysis = {
        summary: this.generateAiSummary(avg, peak, low, trend, avgWeekend, avgWeekday),
        insights: [
          {
            type: 'trend',
            icon: trend === 'increase' ? 'trending_up' : trend === 'decrease' ? 'trending_down' : 'trending_flat',
            color: trend === 'increase' ? 'positive' : trend === 'decrease' ? 'negative' : 'grey',
            title: 'Overall Trend',
            description: this.getTrendDescription(trend, avg)
          },
          {
            type: 'peak',
            icon: 'stars',
            color: 'warning',
            title: 'Peak Day',
            description: `${peak.dayName} ${peak.date} will be the busiest day with ${peak.visitors.toLocaleString()} expected visitors. ${peak.isWeekend ? 'Weekend' : 'Weekday'}${peak.hasEvent ? ' with event' : ''}.`
          },
          {
            type: 'low',
            icon: 'horizontal_rule',
            color: 'info',
            title: 'Quietest Day',
            description: `${low.dayName} ${low.date} will be the quietest day with ${low.visitors.toLocaleString()} expected visitors.`
          },
          {
            type: 'weekend',
            icon: 'weekend',
            color: 'secondary',
            title: 'Weekday vs Weekend',
            description: `Weekend: ${avgWeekend.toLocaleString()} visitors/day vs Weekday: ${avgWeekday.toLocaleString()} visitors/day. ${this.getWeekendComparison(avgWeekend, avgWeekday)}`
          }
        ],
        recommendations: this.generateRecommendations(peak, low, avgWeekend, avgWeekday, weekendDays)
      }

      this.loadingAnalysis = false
    },

    generateAiSummary (avg, peak, low, trend, avgWeekend, avgWeekday) {
      const trendText = trend === 'increase' ? 'an increase' : trend === 'decrease' ? 'a decrease' : 'stability'
      return `Analysis for the next 10 days: We observe ${trendText} in footfall with an average of ${avg.toLocaleString()} visitors/day. Peak footfall is expected on ${peak.dayName} with ${peak.visitors.toLocaleString()} visitors, while the quietest day will be ${low.dayName} with ${low.visitors.toLocaleString()} visitors. Weekends generate ${Math.round(((avgWeekend - avgWeekday) / avgWeekday) * 100)}% ${avgWeekend > avgWeekday ? 'more' : 'less'} footfall than weekdays.`
    },

    getTrendDescription (trend, avg) {
      if (trend === 'increase') {
        return `Footfall is increasing over the next 10 days, averaging ${avg.toLocaleString()} visitors/day. Consider reinforcing your teams.`
      } else if (trend === 'decrease') {
        return `Footfall is decreasing over the next 10 days, averaging ${avg.toLocaleString()} visitors/day. Opportunity for maintenance and training.`
      } else {
        return `Footfall remains stable around ${avg.toLocaleString()} visitors/day. Maintain current staffing levels.`
      }
    },

    getWeekendComparison (weekend, weekday) {
      const diff = Math.abs(weekend - weekday)
      const percent = Math.round((diff / weekday) * 100)
      if (weekend > weekday) {
        return `A ${percent}% increase justifies reinforcing teams on weekends.`
      } else {
        return `A ${percent}% decrease allows for reduced staffing on weekends.`
      }
    },

    generateRecommendations (peak, low, avgWeekend, avgWeekday, weekendDays) {
      const recommendations = []

      if (peak.visitors > avgWeekday * 1.3) {
        recommendations.push({
          icon: 'group_add',
          color: 'warning',
          title: 'Reinforce Staffing',
          description: `Plan for +30% staff on ${peak.dayName} ${peak.date} to handle peak footfall.`,
          priority: 'high'
        })
      }

      if (low.visitors < avgWeekday * 0.7) {
        recommendations.push({
          icon: 'engineering',
          color: 'info',
          title: 'Maintenance & Training',
          description: `${low.dayName} ${low.date} is ideal for scheduling maintenance operations or training sessions.`,
          priority: 'medium'
        })
      }

      if (weekendDays.length > 0 && avgWeekend > avgWeekday * 1.2) {
        recommendations.push({
          icon: 'celebration',
          color: 'secondary',
          title: 'Weekend Promotions',
          description: 'Weekend footfall is significantly higher. Launch targeted promotions to maximize revenue.',
          priority: 'medium'
        })
      }

      const rainyDays = this.dailyPredictions.filter(p => p.weather === 'rainy')
      if (rainyDays.length > 3) {
        recommendations.push({
          icon: 'umbrella',
          color: 'primary',
          title: 'Weather Communication',
          description: `${rainyDays.length} rainy days expected. Promote your indoor services to attract visitors.`,
          priority: 'low'
        })
      }

      const eventDays = this.dailyPredictions.filter(p => p.hasEvent)
      if (eventDays.length > 0) {
        recommendations.push({
          icon: 'event',
          color: 'positive',
          title: 'Upcoming Events',
          description: `${eventDays.length} event(s) scheduled. Prepare special offers and increase inventory.`,
          priority: 'high'
        })
      }

      return recommendations.sort((a, b) => {
        const priority = { high: 3, medium: 2, low: 1 }
        return priority[b.priority] - priority[a.priority]
      })
    }
  }
}
</script>

<template>
  <q-card
    class="col-2 cursor-pointer"
    :style="{ backgroundColor: cardBgColor, color: textColor }"
    @click="openDialog"
  >
    <q-card-section>
      <div class="text-h6 row items-center" :style="{ color: titleColor }">
        <q-icon name="today" size="sm" class="q-mr-sm" />
        D+10
        <q-space />
        <q-badge v-if="modelTrained" color="positive" icon="functions">ML</q-badge>
      </div>

      <div class="text-h4 text-weight-bold q-mt-md" :style="{ color: titleColor }">
        {{ todayAffluence.toLocaleString() }}
        <span class="text-caption" :style="{ color: textColor, opacity: 0.7 }">visitors/day</span>
      </div>

      <q-separator class="q-my-md" :color="accentColor" />

      <div class="text-subtitle2" :style="{ color: titleColor }">Next Days</div>
      <div class="text-body2" :style="{ color: textColor }">
        Average: <span class="text-weight-bold">{{ getAverageDaily().toLocaleString() }}</span>
      </div>
      <div class="text-caption q-mt-xs" :style="{ color: textColor, opacity: 0.7 }">
        <q-icon name="trending_up" size="xs" class="q-mr-xs" />
        Peak: {{ getPeakDay() }}
      </div>

      <q-linear-progress :value="0.75" :color="accentColor" class="q-mt-sm" />

      <div class="text-center text-caption q-mt-md" :style="{ color: textColor, opacity: 0.6 }">
        <q-icon name="open_in_full" size="xs" /> Click for details
      </div>
    </q-card-section>

    <q-dialog v-model="showDialog" maximized>
      <q-card :style="{ backgroundColor: cardBgColor, color: textColor }">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h5" :style="{ color: titleColor }">
            <q-icon name="functions" class="q-mr-sm" />
            ML Predictions - Daily Footfall
          </div>
          <q-chip v-if="modelTrained" color="positive" text-color="white" icon="check_circle">
            Model Trained
          </q-chip>
          <q-space />
          <q-btn
            label="AI Analysis"
            icon="psychology"
            :color="accentColor"
            @click="requestAiAnalysis"
            class="q-mr-md"
            :text-color="cardBgColor"
          />
          <q-btn icon="close" flat round dense v-close-popup :color="textColor" />
        </q-card-section>

        <q-card-section>
          <div class="q-mt-md">
            <q-card flat bordered :style="{ backgroundColor: cardBgColor, borderColor: accentColor }">
              <q-card-section>
                <canvas ref="chart" style="max-height: 400px;"></canvas>
              </q-card-section>
            </q-card>
          </div>

          <div class="q-mt-md">
            <q-card flat bordered :style="{ backgroundColor: cardBgColor, borderColor: accentColor }">
              <q-card-section>
                <q-table
                  :rows="dailyPredictions"
                  :columns="[
                    { name: 'date', label: 'Date', field: 'date', align: 'left' },
                    { name: 'day', label: 'Day', field: 'dayName', align: 'left' },
                    { name: 'visitors', label: 'Visitors', field: 'visitors', format: val => val.toLocaleString(), align: 'right' },
                    { name: 'weather', label: 'Weather', field: 'weather', align: 'center' }
                  ]"
                  row-key="date"
                  flat
                  dense
                  :style="{ color: textColor }"
                >
                  <template v-slot:body-cell-weather="props">
                    <q-td :props="props">
                      <q-icon
                        :name="props.row.weather === 'sunny' ? 'wb_sunny' : props.row.weather === 'rainy' ? 'umbrella' : 'cloud'"
                        :color="props.row.weather === 'sunny' ? 'orange' : props.row.weather === 'rainy' ? 'blue' : 'grey'"
                        size="sm"
                      />
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- AI Analysis Dialog -->
    <q-dialog v-model="showAiDialog" maximized>
      <q-card :style="{ backgroundColor: cardBgColor, color: textColor }">
        <q-card-section class="row items-center q-pb-none" :style="{ backgroundColor: accentColor, color: cardBgColor }">
          <q-icon name="psychology" size="32px" class="q-mr-sm" />
          <div class="text-h5">AI Analysis - Footfall Predictions</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup :color="cardBgColor" />
        </q-card-section>

        <q-card-section v-if="loadingAnalysis" class="column items-center justify-center" style="min-height: 400px;">
          <q-spinner-gears :color="accentColor" size="80px" />
          <div class="text-h6 q-mt-md" :style="{ color: textColor, opacity: 0.7 }">Analyzing data...</div>
          <div class="text-caption" :style="{ color: textColor, opacity: 0.6 }">AI is processing your footfall predictions</div>
        </q-card-section>

        <q-card-section v-if="!loadingAnalysis && aiAnalysis">
          <!-- Summary -->
          <q-card flat bordered class="q-mb-md" :style="{ backgroundColor: accentColor + '20', borderColor: accentColor }">
            <q-card-section>
              <div class="row items-start">
                <q-icon name="summarize" size="32px" :color="accentColor" class="q-mr-md" />
                <div>
                  <div class="text-h6 q-mb-sm" :style="{ color: titleColor }">Analysis Summary</div>
                  <div class="text-body1" :style="{ color: textColor }">{{ aiAnalysis.summary }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Insights -->
          <div class="text-h6 q-mb-md" :style="{ color: titleColor }">
            <q-icon name="lightbulb" class="q-mr-sm" />
            Key Insights
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div v-for="(insight, i) in aiAnalysis.insights" :key="i" class="col-12 col-md-6">
              <q-card flat bordered :style="{ backgroundColor: cardBgColor, borderColor: accentColor }">
                <q-card-section>
                  <div class="row items-start">
                    <q-avatar :icon="insight.icon" :color="insight.color" text-color="white" size="40px" class="q-mr-md" />
                    <div class="col">
                      <div class="text-subtitle1 text-weight-bold" :style="{ color: titleColor }">{{ insight.title }}</div>
                      <div class="text-body2" :style="{ color: textColor }">{{ insight.description }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Recommendations -->
          <div class="text-h6 q-mb-md" :style="{ color: titleColor }">
            <q-icon name="recommend" class="q-mr-sm" />
            Recommendations
          </div>
          <div class="q-gutter-sm">
            <q-card
              v-for="(rec, i) in aiAnalysis.recommendations"
              :key="i"
              flat
              bordered
              :style="{ backgroundColor: cardBgColor, borderColor: accentColor }"
              :class="{
                'border-warning': rec.priority === 'high',
                'border-info': rec.priority === 'medium',
                'border-grey': rec.priority === 'low'
              }"
            >
              <q-card-section>
                <div class="row items-center">
                  <q-badge
                    :color="rec.color"
                    :label="rec.priority === 'high' ? 'High Priority' : rec.priority === 'medium' ? 'Medium Priority' : 'Low Priority'"
                    class="q-mr-md"
                  />
                  <q-avatar :icon="rec.icon" :color="rec.color" text-color="white" size="40px" class="q-mr-md" />
                  <div class="col">
                    <div class="text-subtitle1 text-weight-bold" :style="{ color: titleColor }">{{ rec.title }}</div>
                    <div class="text-body2" :style="{ color: textColor }">{{ rec.description }}</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<style scoped>
.border-warning {
  border-left: 4px solid #f2c037;
}

.border-info {
  border-left: 4px solid #31ccec;
}

.border-grey {
  border-left: 4px solid #9e9e9e;
}
</style>
