<script>
import MLR from 'ml-regression-multivariate-linear'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'TileRevenue',
  data () {
    return {
      currentMonthRevenue: 0,
      todayRevenue: 0,
      historicalMonthlyData: [],
      historicalDailyData: [],
      monthlyPredictions: [],
      dailyPredictions: [],
      loading: true,
      model: null,
      modelTrained: false,
      showDialogMonthly: false,
      showDialogDaily: false,
      chartInstanceMonthly: null,
      chartInstanceDaily: null,
      monthlyAiTips: null,
      dailyAiAnalysis: null,
      loadingMonthlyTips: false,
      loadingDailyAnalysis: false,
      showDailyAnalysis: false
    }
  },
  async mounted () {
    this.loadHistoricalData()
    await this.trainDailyModel()
    this.predictCurrentMonth()
    this.predictToday()
    this.generateMonthlyPredictions()
    this.generateDailyPredictions()
  },
  methods: {
    loadHistoricalData () {
      this.historicalMonthlyData = [
        { month: 'Jan 2023', revenue: 45000 },
        { month: 'Feb 2023', revenue: 42000 },
        { month: 'Mar 2023', revenue: 48000 },
        { month: 'Apr 2023', revenue: 50000 },
        { month: 'May 2023', revenue: 55000 },
        { month: 'Jun 2023', revenue: 58000 },
        { month: 'Jul 2023', revenue: 68000 },
        { month: 'Aug 2023', revenue: 65000 },
        { month: 'Sep 2023', revenue: 56000 },
        { month: 'Oct 2023', revenue: 52000 },
        { month: 'Nov 2023', revenue: 62000 },
        { month: 'Dec 2023', revenue: 75000 },
        { month: 'Jan 2024', revenue: 48000 },
        { month: 'Feb 2024', revenue: 45000 },
        { month: 'Mar 2024', revenue: 52000 },
        { month: 'Apr 2024', revenue: 54000 },
        { month: 'May 2024', revenue: 59000 },
        { month: 'Jun 2024', revenue: 63000 },
        { month: 'Jul 2024', revenue: 73000 },
        { month: 'Aug 2024', revenue: 70000 },
        { month: 'Sep 2024', revenue: 60000 },
        { month: 'Oct 2024', revenue: 56000 },
        { month: 'Nov 2024', revenue: 67000 },
        { month: 'Dec 2024', revenue: 80000 }
      ]
      this.historicalDailyData = this.generateDailyData(90)
    },

    generateDailyData (days) {
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
        const baseRevenue = 1800
        const seasonalFactor = 1 + 0.3 * Math.sin((month / 12) * 2 * Math.PI)
        const weekendFactor = isWeekend ? 1.4 : 1
        const holidayFactor = isHoliday ? 1.6 : 1
        const weather = Math.floor(Math.random() * 3)
        const weatherFactor = [0.8, 1, 1.2][weather]
        const temp = 15 + 10 * Math.sin((month / 12) * 2 * Math.PI)
        const events = Math.random() > 0.9 ? 1 : 0
        const eventFactor = events ? 1.5 : 1
        const revenue = Math.round(
          baseRevenue * seasonalFactor * weekendFactor * holidayFactor * weatherFactor * eventFactor
        )
        data.push({
          date: currentDate.toISOString().split('T')[0],
          revenue,
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

    predictCurrentMonth () {
      const n = this.historicalMonthlyData.length
      const x = Array.from({ length: n }, (_, i) => i)
      const y = this.historicalMonthlyData.map(d => d.revenue)
      const sumX = x.reduce((a, b) => a + b, 0)
      const sumY = y.reduce((a, b) => a + b, 0)
      const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
      const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      const intercept = (sumY - slope * sumX) / n
      const seasonalIndices = this.calculateSeasonalIndices()
      const currentMonth = new Date().getMonth()
      const trend = slope * n + intercept
      const seasonalFactor = seasonalIndices[currentMonth]
      this.currentMonthRevenue = Math.round(trend * seasonalFactor)
    },

    calculateSeasonalIndices () {
      const globalAverage = this.historicalMonthlyData.reduce((sum, d) => sum + d.revenue, 0) / this.historicalMonthlyData.length
      const monthlyAverages = Array(12).fill(0)
      const monthCounts = Array(12).fill(0)
      this.historicalMonthlyData.forEach((data, index) => {
        const monthIndex = index % 12
        monthlyAverages[monthIndex] += data.revenue
        monthCounts[monthIndex]++
      })
      return monthlyAverages.map((sum, i) => {
        const monthAverage = sum / monthCounts[i]
        return monthAverage / globalAverage
      })
    },

    async trainDailyModel () {
      const x = this.historicalDailyData.map(d => [
        d.dayOfWeek / 7,
        d.isWeekend,
        d.isHoliday,
        d.weather / 2,
        d.temp / 30,
        d.events
      ])
      const y = this.historicalDailyData.map(d => [d.revenue])
      this.model = new MLR(x, y)
      this.modelTrained = true
    },

    predictToday () {
      if (!this.modelTrained) return
      const today = new Date()
      const dayOfWeek = today.getDay()
      const month = today.getMonth()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0
      const isHoliday = this.checkHoliday(today) ? 1 : 0
      const weather = this.getWeatherForecast(today)
      const weatherCode = { sunny: 2, cloudy: 1, rainy: 0, snowy: 0 }[weather] || 1
      const temp = 15 + 10 * Math.sin((month / 12) * 2 * Math.PI)
      const events = this.checkEventDay(today) ? 1 : 0
      const prediction = this.model.predict([
        dayOfWeek / 7,
        isWeekend,
        isHoliday,
        weatherCode / 2,
        temp / 30,
        events
      ])
      this.todayRevenue = Math.round(Math.max(0, prediction[0]))
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

    generateMonthlyPredictions () {
      const n = this.historicalMonthlyData.length
      const x = Array.from({ length: n }, (_, i) => i)
      const y = this.historicalMonthlyData.map(d => d.revenue)
      const sumX = x.reduce((a, b) => a + b, 0)
      const sumY = y.reduce((a, b) => a + b, 0)
      const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
      const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      const intercept = (sumY - slope * sumX) / n
      const seasonalIndices = this.calculateSeasonalIndices()
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      this.monthlyPredictions = months.map((month, i) => {
        const trend = slope * (n + i) + intercept
        const seasonalFactor = seasonalIndices[i]
        const predictedValue = Math.round(trend * seasonalFactor)
        return {
          month: `${month} 2025`,
          revenue: predictedValue > 0 ? predictedValue : 0,
          trend: Math.round(trend),
          seasonalFactor: seasonalFactor.toFixed(2)
        }
      })
    },

    generateDailyPredictions () {
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
        const revenue = Math.round(Math.max(0, prediction[0]))
        this.dailyPredictions.push({
          date: targetDate.toLocaleDateString('en-US'),
          dateObj: targetDate,
          dayName: this.getDayName(targetDate),
          revenue,
          weather,
          isWeekend: isWeekend === 1,
          isHoliday: isHoliday === 1,
          hasEvent: events === 1,
          confidence: 0.85 + Math.random() * 0.1
        })
      }
    },

    getDayName (date) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return days[date.getDay()]
    },

    getAverageGrowth () {
      if (this.monthlyPredictions.length < 2) return 0
      const avgLast12 = this.historicalMonthlyData.slice(-12).reduce((sum, d) => sum + d.revenue, 0) / 12
      const avgNext12 = this.monthlyPredictions.reduce((sum, d) => sum + d.revenue, 0) / 12
      return (((avgNext12 - avgLast12) / avgLast12) * 100).toFixed(1)
    },

    getPeakMonth () {
      const max = Math.max(...this.monthlyPredictions.map(p => p.revenue))
      const peak = this.monthlyPredictions.find(p => p.revenue === max)
      return peak ? peak.month : 'N/A'
    },

    getTrend () {
      if (this.monthlyPredictions.length < 2) return 'stable'
      const first = this.monthlyPredictions[0].revenue
      const last = this.monthlyPredictions[this.monthlyPredictions.length - 1].revenue
      const growth = ((last - first) / first) * 100
      if (growth > 5) return 'increase'
      if (growth < -5) return 'decrease'
      return 'stable'
    },

    getAverageDaily () {
      if (this.dailyPredictions.length === 0) return 0
      const total = this.dailyPredictions.reduce((sum, d) => sum + d.revenue, 0)
      return Math.round(total / this.dailyPredictions.length)
    },

    getPeakDay () {
      if (this.dailyPredictions.length === 0) return 'N/A'
      const max = Math.max(...this.dailyPredictions.map(p => p.revenue))
      const peak = this.dailyPredictions.find(p => p.revenue === max)
      return peak ? `${peak.dayName.substr(0, 3)} ${peak.date.split('/')[0]}` : 'N/A'
    },

    async generateMonthlyAiTips () {
      this.loadingMonthlyTips = true

      await new Promise(resolve => setTimeout(resolve, 1000))

      const avgGrowth = parseFloat(this.getAverageGrowth())
      const peak = this.monthlyPredictions.reduce((max, p) => p.revenue > max.revenue ? p : max, this.monthlyPredictions[0])
      const avgMonthly = Math.round(this.monthlyPredictions.reduce((sum, p) => sum + p.revenue, 0) / 12)

      const summerMonths = this.monthlyPredictions.filter(p => ['Jun', 'Jul', 'Aug'].some(m => p.month.includes(m)))
      const winterMonths = this.monthlyPredictions.filter(p => ['Dec', 'Jan', 'Feb'].some(m => p.month.includes(m)))
      const avgSummer = summerMonths.reduce((sum, p) => sum + p.revenue, 0) / summerMonths.length
      const avgWinter = winterMonths.reduce((sum, p) => sum + p.revenue, 0) / winterMonths.length

      this.monthlyAiTips = {
        currentRevenue: {
          tip: avgGrowth > 10
            ? '🚀 Excellent trajectory! Your revenue is growing strongly. Consider expanding capacity.'
            : avgGrowth > 0
              ? '📈 Positive growth detected. Keep up the good work and explore optimization opportunities.'
              : avgGrowth > -5
                ? '📊 Stable performance. Focus on cost efficiency and customer retention strategies.'
                : '⚠️ Declining revenue. Immediate action needed - review pricing, marketing, and competition.'
        },
        expectedGrowth: {
          tip: avgGrowth > 10
            ? `Strong ${avgGrowth}% growth! Plan for increased inventory and staff to handle demand surge.`
            : avgGrowth > 0
              ? `Steady ${avgGrowth}% growth expected. Maintain current strategies while testing new initiatives.`
              : avgGrowth > -5
                ? `Minor ${Math.abs(avgGrowth)}% variance. Perfect time to optimize operations without major risks.`
                : `${Math.abs(avgGrowth)}% decline forecast. Consider promotional campaigns and customer surveys.`
        },
        peakMonth: {
          tip: peak.revenue > avgMonthly * 1.3
            ? `${peak.month} will be exceptional! Prepare +30% capacity, stock inventory early, and launch marketing campaigns 2 months ahead.`
            : `${peak.month} is your best performer. Ensure adequate staffing and inventory to maximize this opportunity.`
        },
        trend: {
          tip: avgSummer > avgWinter * 1.2
            ? `☀️ Strong summer seasonality (+${Math.round(((avgSummer - avgWinter) / avgWinter) * 100)}%). Prepare for €${Math.round(avgSummer).toLocaleString()}/month Jun-Aug vs €${Math.round(avgWinter).toLocaleString()}/month winter. Plan cash flow accordingly.`
            : '❄️ Balanced performance year-round provides stable cash flow. Consider seasonal promotions to create peak periods for strategic planning.'
        }
      }

      this.loadingMonthlyTips = false
    },

    async generateDailyAiAnalysis () {
      this.loadingDailyAnalysis = true
      this.showDailyAnalysis = true

      await new Promise(resolve => setTimeout(resolve, 1500))

      const avg = this.getAverageDaily()
      const peak = this.dailyPredictions.reduce((max, p) => p.revenue > max.revenue ? p : max, this.dailyPredictions[0])
      const low = this.dailyPredictions.reduce((min, p) => p.revenue < min.revenue ? p : min, this.dailyPredictions[0])
      const weekendDays = this.dailyPredictions.filter(p => p.isWeekend)
      const weekdayDays = this.dailyPredictions.filter(p => !p.isWeekend)
      const avgWeekend = weekendDays.length > 0 ? Math.round(weekendDays.reduce((sum, d) => sum + d.revenue, 0) / weekendDays.length) : 0
      const avgWeekday = weekdayDays.length > 0 ? Math.round(weekdayDays.reduce((sum, d) => sum + d.revenue, 0) / weekdayDays.length) : 0

      this.dailyAiAnalysis = {
        summary: `📊 Next 10 days forecast: Average daily revenue of €${avg.toLocaleString()} with peak on ${peak.dayName} ${peak.date} (€${peak.revenue.toLocaleString()}). Weekend performance ${avgWeekend > avgWeekday ? 'exceeds' : 'lags'} weekdays by ${Math.abs(Math.round(((avgWeekend - avgWeekday) / avgWeekday) * 100))}%.`,
        insights: [
          {
            title: 'Daily Performance',
            commentary: `💰 Your average daily revenue of €${avg.toLocaleString()} indicates ${avg > 2000 ? 'strong' : avg > 1500 ? 'solid' : 'moderate'} business performance. ${peak.hasEvent ? 'Special event on ' + peak.dayName + ' will boost revenue significantly.' : ''}`
          },
          {
            title: 'Peak Day Strategy',
            commentary: `⭐ ${peak.dayName} ${peak.date} will generate €${peak.revenue.toLocaleString()}${peak.isWeekend ? ' (weekend boost)' : ''}${peak.hasEvent ? ' (event day)' : ''}. Ensure +25% staff capacity and adequate inventory levels.`
          },
          {
            title: 'Weekend vs Weekday',
            commentary: avgWeekend > avgWeekday
              ? `🎉 Weekends outperform with €${avgWeekend.toLocaleString()}/day vs €${avgWeekday.toLocaleString()}/day on weekdays (+${Math.round(((avgWeekend - avgWeekday) / avgWeekday) * 100)}%). Focus weekend marketing efforts for maximum ROI.`
              : `📅 Weekday revenue (€${avgWeekday.toLocaleString()}) leads weekend performance. Consider special weekend promotions to balance traffic.`
          },
          {
            title: 'Operational Efficiency',
            commentary: low.revenue < avg * 0.8
              ? `🔧 ${low.dayName} ${low.date} shows lower activity (€${low.revenue.toLocaleString()}). Optimize staffing and use this time for maintenance or training.`
              : '✅ Consistent daily performance across the period allows for stable operational planning.'
          }
        ]
      }

      this.loadingDailyAnalysis = false
    },

    renderChartMonthly () {
      const ctx = this.$refs.chartMonthly
      if (!ctx) return
      const allData = [...this.historicalMonthlyData.slice(-12), ...this.monthlyPredictions]
      const maxRevenue = Math.max(...allData.map(d => d.revenue))
      if (this.chartInstanceMonthly) {
        this.chartInstanceMonthly.destroy()
      }
      this.chartInstanceMonthly = new Chart(ctx, {
        type: 'line',
        data: {
          labels: allData.map(d => d.month),
          datasets: [
            {
              label: 'Historical',
              data: this.historicalMonthlyData.slice(-12).map(d => d.revenue),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.3
            },
            {
              label: 'Predictions 2025',
              data: [...Array(12).fill(null), ...this.monthlyPredictions.map(d => d.revenue)],
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderDash: [5, 5],
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: 'Revenue - Historical and 2025 Predictions'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: Math.ceil(maxRevenue / 10000) * 10000,
              ticks: {
                callback: (value) => '€' + value.toLocaleString()
              }
            }
          }
        }
      })
    },

    renderChartDaily () {
      const ctx = this.$refs.chartDaily
      if (!ctx) return
      if (this.chartInstanceDaily) {
        this.chartInstanceDaily.destroy()
      }
      const labels = this.dailyPredictions.map(d => `${d.dayName.substr(0, 3)} ${d.date.split('/')[0]}`)
      const data = this.dailyPredictions.map(d => d.revenue)
      const colors = this.dailyPredictions.map(d =>
        d.isWeekend ? 'rgba(75, 192, 192, 0.6)' : 'rgba(76, 175, 80, 0.6)'
      )
      this.chartInstanceDaily = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Predicted Revenue (€)',
            data,
            backgroundColor: colors,
            borderColor: 'rgba(76, 175, 80, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Revenue Predictions - Next 10 Days'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => '€' + value.toLocaleString()
              }
            }
          }
        }
      })
    }
  },
  watch: {
    showDialogMonthly (val) {
      if (val) {
        this.$nextTick(() => {
          this.renderChartMonthly()
          this.generateMonthlyAiTips()
        })
      }
    },
    showDialogDaily (val) {
      if (val) {
        this.$nextTick(() => {
          this.renderChartDaily()
        })
      }
    }
  }
}
</script>

<template>
  <q-card class="col-2 bg-green-1">
    <q-card-section>
      <div class="text-h6 row items-center">
        <q-icon name="euro" size="sm" class="q-mr-sm" />
        Revenue
        <q-space />
        <q-badge v-if="modelTrained" color="positive" icon="functions" dense>
          ML
        </q-badge>
      </div>

      <div class="q-mt-md">
        <div class="text-caption text-grey-7">
          Current Month
          <q-icon name="functions" size="xs" class="q-ml-xs">
            <q-tooltip>Seasonal regression prediction</q-tooltip>
          </q-icon>
        </div>
        <div class="text-h5 text-weight-bold">
          €{{ currentMonthRevenue.toLocaleString() }}
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div>
        <div class="text-caption text-grey-7">
          Today
          <q-icon name="psychology" size="xs" class="q-ml-xs">
            <q-tooltip>ML Prediction</q-tooltip>
          </q-icon>
        </div>
        <div class="text-h6 text-weight-bold">
          €{{ todayRevenue.toLocaleString() }}
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div class="column q-gutter-sm">
        <q-btn
          flat
          dense
          no-caps
          color="primary"
          icon="calendar_month"
          label="Monthly Predictions"
          @click="showDialogMonthly = true"
          class="text-left"
        />
        <q-btn
          flat
          dense
          no-caps
          color="secondary"
          icon="today"
          label="Daily Predictions (D+10)"
          @click="showDialogDaily = true"
          class="text-left"
        />
      </div>
    </q-card-section>

    <!-- Monthly Dialog -->
    <q-dialog v-model="showDialogMonthly" maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h5">
            <q-icon name="euro" class="q-mr-sm" />
            Monthly Revenue Analysis
          </div>
          <q-chip color="primary" text-color="white" icon="psychology">
            AI-Powered Insights
          </q-chip>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <!-- Statistics with AI Tips -->
          <div class="row q-col-gutter-md q-mb-md">
            <!-- Current Revenue -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">Current Revenue</div>
                      <div class="text-h5 text-weight-bold">€{{ currentMonthRevenue.toLocaleString() }}</div>
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingMonthlyTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="monthlyAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ monthlyAiTips.currentRevenue.tip }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Expected Growth -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">Expected Growth</div>
                      <div class="text-h5 text-weight-bold" :class="getAverageGrowth() > 0 ? 'text-positive' : 'text-negative'">
                        {{ getAverageGrowth() > 0 ? '+' : '' }}{{ getAverageGrowth() }}%
                      </div>
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingMonthlyTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="monthlyAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ monthlyAiTips.expectedGrowth.tip }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Peak Month -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">Peak Month</div>
                      <div class="text-h6 text-weight-bold">{{ getPeakMonth() }}</div>
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingMonthlyTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="monthlyAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ monthlyAiTips.peakMonth.tip }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Trend -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">Trend</div>
                      <div class="text-h5 text-weight-bold row items-center">
                        <q-icon
                          :name="getTrend() === 'increase' ? 'trending_up' : getTrend() === 'decrease' ? 'trending_down' : 'trending_flat'"
                          :color="getTrend() === 'increase' ? 'positive' : getTrend() === 'decrease' ? 'negative' : 'grey'"
                        />
                      </div>
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingMonthlyTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="monthlyAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ monthlyAiTips.trend.tip }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Chart -->
          <div class="q-mt-md">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6 q-mb-md">Evolution and Predictions</div>
                <canvas ref="chartMonthly" style="max-height: 400px;"></canvas>
              </q-card-section>
            </q-card>
          </div>

          <!-- Table -->
          <div class="q-mt-md">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6 q-mb-md">Monthly Details 2025</div>
                <q-table
                  :rows="monthlyPredictions"
                  :columns="[
                    { name: 'month', label: 'Month', field: 'month', align: 'left' },
                    { name: 'revenue', label: 'Predicted Revenue', field: 'revenue', format: val => '€' + val.toLocaleString(), align: 'right' },
                    { name: 'trend', label: 'Trend', field: 'trend', format: val => '€' + val.toLocaleString(), align: 'right' },
                    { name: 'seasonalFactor', label: 'Seasonal Factor', field: 'seasonalFactor', align: 'right' }
                  ]"
                  row-key="month"
                  flat
                  dense
                />
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Daily Dialog -->
    <q-dialog v-model="showDialogDaily" maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h5">
            <q-icon name="functions" class="q-mr-sm" />
            ML Predictions - Daily Revenue (D+10)
          </div>
          <q-chip v-if="modelTrained" color="positive" text-color="white" icon="check_circle" class="q-ml-sm">
            Model Trained
          </q-chip>
          <q-space />
          <q-btn
            v-if="!showDailyAnalysis"
            label="AI Analysis"
            icon="psychology"
            color="primary"
            @click="generateDailyAiAnalysis"
            class="q-mr-md"
          />
          <q-btn
            v-else
            label="Hide Analysis"
            icon="visibility_off"
            color="grey"
            @click="showDailyAnalysis = false"
            class="q-mr-md"
          />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <!-- AI Analysis Section -->
          <div v-if="showDailyAnalysis" class="q-mb-lg">
            <q-card flat bordered class="bg-purple-1">
              <q-card-section v-if="loadingDailyAnalysis" class="column items-center justify-center" style="min-height: 200px;">
                <q-spinner-gears color="primary" size="60px" />
                <div class="text-subtitle1 q-mt-md text-grey-7">Analyzing daily patterns...</div>
              </q-card-section>

              <q-card-section v-if="!loadingDailyAnalysis && dailyAiAnalysis">
                <div class="row items-start q-mb-md">
                  <q-icon name="psychology" size="32px" color="primary" class="q-mr-md" />
                  <div>
                    <div class="text-h6 q-mb-sm">AI Analysis - Daily Revenue Insights</div>
                    <div class="text-body1 text-grey-8">{{ dailyAiAnalysis.summary }}</div>
                  </div>
                </div>

                <q-separator class="q-my-md" />

                <div class="q-gutter-md">
                  <div v-for="(insight, i) in dailyAiAnalysis.insights" :key="i">
                    <div class="row items-start">
                      <q-icon name="chat_bubble" color="primary" size="20px" class="q-mr-sm q-mt-xs" />
                      <div class="col">
                        <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs">{{ insight.title }}</div>
                        <div class="text-body2 text-grey-9">{{ insight.commentary }}</div>
                      </div>
                    </div>
                    <q-separator v-if="i < dailyAiAnalysis.insights.length - 1" class="q-my-sm" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Chart -->
          <div class="q-mt-md">
            <q-card flat bordered>
              <q-card-section>
                <canvas ref="chartDaily" style="max-height: 400px;"></canvas>
              </q-card-section>
            </q-card>
          </div>

          <!-- Table -->
          <div class="q-mt-md">
            <q-card flat bordered>
              <q-card-section>
                <q-table
                  :rows="dailyPredictions"
                  :columns="[
                    { name: 'date', label: 'Date', field: 'date', align: 'left' },
                    { name: 'day', label: 'Day', field: 'dayName', align: 'left' },
                    { name: 'revenue', label: 'Predicted Revenue', field: 'revenue', format: val => '€' + val.toLocaleString(), align: 'right' },
                    { name: 'confidence', label: 'Confidence', field: 'confidence', format: val => (val * 100).toFixed(0) + '%', align: 'right' },
                    { name: 'weather', label: 'Weather', field: 'weather', align: 'center' }
                  ]"
                  row-key="date"
                  flat
                  dense
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
  </q-card>
</template>
