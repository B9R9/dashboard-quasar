<script>
import { Chart, registerables } from 'chart.js'
import { getThemeByName } from '../utils/themes.js'

Chart.register(...registerables)

export default {
  name: 'TileAffluence',
  props: {
    themeSelected: {
      type: String,
      default: 'classicLight'
    }
  },
  data () {
    return {
      currentAffluence: 0,
      historicalData: [],
      predictions: [],
      loading: true,
      showDialog: false,
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
  mounted () {
    this.loadHistoricalData()
    this.generateSeasonalPredictions()
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
    loadHistoricalData () {
      // Last 24 months data (2 years to capture seasonality)
      this.historicalData = [
        // 2023
        { month: 'Jan 2023', visitors: 12500 },
        { month: 'Feb 2023', visitors: 11800 },
        { month: 'Mar 2023', visitors: 13200 },
        { month: 'Apr 2023', visitors: 13500 },
        { month: 'May 2023', visitors: 14800 },
        { month: 'Jun 2023', visitors: 15600 },
        { month: 'Jul 2023', visitors: 18200 },
        { month: 'Aug 2023', visitors: 17500 },
        { month: 'Sep 2023', visitors: 15200 },
        { month: 'Oct 2023', visitors: 14100 },
        { month: 'Nov 2023', visitors: 16500 },
        { month: 'Dec 2023', visitors: 19800 },
        // 2024
        { month: 'Jan 2024', visitors: 13000 },
        { month: 'Feb 2024', visitors: 12300 },
        { month: 'Mar 2024', visitors: 14200 },
        { month: 'Apr 2024', visitors: 14500 },
        { month: 'May 2024', visitors: 15800 },
        { month: 'Jun 2024', visitors: 16800 },
        { month: 'Jul 2024', visitors: 19500 },
        { month: 'Aug 2024', visitors: 18800 },
        { month: 'Sep 2024', visitors: 16200 },
        { month: 'Oct 2024', visitors: 15100 },
        { month: 'Nov 2024', visitors: 17900 },
        { month: 'Dec 2024', visitors: 21200 }
      ]

      this.currentAffluence = this.historicalData[this.historicalData.length - 1].visitors
    },

    generateSeasonalPredictions () {
      const n = this.historicalData.length
      const x = Array.from({ length: n }, (_, i) => i)
      const y = this.historicalData.map(d => d.visitors)

      const sumX = x.reduce((a, b) => a + b, 0)
      const sumY = y.reduce((a, b) => a + b, 0)
      const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
      const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      const intercept = (sumY - slope * sumX) / n

      const seasonalIndices = this.calculateSeasonalIndices()

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      this.predictions = months.map((month, i) => {
        const trend = slope * (n + i) + intercept
        const seasonalFactor = seasonalIndices[i]
        const predictedValue = Math.round(trend * seasonalFactor)

        return {
          month: `${month} 2025`,
          visitors: predictedValue > 0 ? predictedValue : 0,
          trend: Math.round(trend),
          seasonalFactor: seasonalFactor.toFixed(2)
        }
      })

      this.loading = false
    },

    calculateSeasonalIndices () {
      const globalAverage = this.historicalData.reduce((sum, d) => sum + d.visitors, 0) / this.historicalData.length
      const monthlyAverages = Array(12).fill(0)
      const monthCounts = Array(12).fill(0)

      this.historicalData.forEach((data, index) => {
        const monthIndex = index % 12
        monthlyAverages[monthIndex] += data.visitors
        monthCounts[monthIndex]++
      })

      return monthlyAverages.map((sum, i) => {
        const monthAverage = sum / monthCounts[i]
        return monthAverage / globalAverage
      })
    },

    renderChart () {
      const ctx = this.$refs.chart
      if (!ctx) return

      const chartData = this.getChartOptions()

      if (this._chartInstance) {
        this._chartInstance.destroy()
      }

      this._chartInstance = Chart.getChart(ctx) || new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: chartData.datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: this.textColor
              }
            },
            title: {
              display: true,
              text: 'Historical Footfall and 2025 Predictions',
              color: this.titleColor
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: chartData.max,
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

    getTrend () {
      if (this.predictions.length < 2) return 'stable'
      const firstPrediction = this.predictions[0].visitors
      const lastPrediction = this.predictions[this.predictions.length - 1].visitors
      const growth = ((lastPrediction - firstPrediction) / firstPrediction) * 100

      if (growth > 5) return 'increase'
      if (growth < -5) return 'decrease'
      return 'stable'
    },

    getAverageGrowth () {
      if (this.predictions.length < 2) return 0
      const avgLast12Months = this.historicalData.slice(-12).reduce((sum, d) => sum + d.visitors, 0) / 12
      const avgNext12Months = this.predictions.reduce((sum, d) => sum + d.visitors, 0) / 12
      return (((avgNext12Months - avgLast12Months) / avgLast12Months) * 100).toFixed(1)
    },

    getSeasonalPeak () {
      const maxPrediction = Math.max(...this.predictions.map(p => p.visitors))
      const peakMonth = this.predictions.find(p => p.visitors === maxPrediction)
      return peakMonth ? peakMonth.month : 'N/A'
    },

    openDialog () {
      this.showDialog = true
    },

    getChartOptions () {
      const allData = [...this.historicalData.slice(-12), ...this.predictions]
      const maxVisitors = Math.max(...allData.map(d => d.visitors))

      return {
        labels: allData.map(d => d.month),
        datasets: [
          {
            label: 'Historical',
            data: this.historicalData.slice(-12).map(d => d.visitors),
            borderColor: this.accentColor,
            backgroundColor: this.accentColor + '33',
            tension: 0.3
          },
          {
            label: 'Predictions 2025',
            data: [...Array(12).fill(null), ...this.predictions.map(d => d.visitors)],
            borderColor: this.currentTheme.colors.secondary || this.accentColor,
            backgroundColor: (this.currentTheme.colors.secondary || this.accentColor) + '33',
            borderDash: [5, 5],
            tension: 0.3
          }
        ],
        max: Math.ceil(maxVisitors / 1000) * 1000
      }
    },

    async requestAiAnalysis () {
      this.loadingAnalysis = true
      this.showAiDialog = true

      await new Promise(resolve => setTimeout(resolve, 2000))

      const avgGrowth = parseFloat(this.getAverageGrowth())
      const peak = this.predictions.reduce((max, p) => p.visitors > max.visitors ? p : max, this.predictions[0])
      const low = this.predictions.reduce((min, p) => p.visitors < min.visitors ? p : min, this.predictions[0])
      const trend = this.getTrend()
      const avgMonthly = Math.round(this.predictions.reduce((sum, p) => sum + p.visitors, 0) / 12)
      const currentAvg = Math.round(this.historicalData.slice(-12).reduce((sum, d) => sum + d.visitors, 0) / 12)

      const summerMonths = this.predictions.filter(p => ['Jun', 'Jul', 'Aug'].some(m => p.month.includes(m)))
      const winterMonths = this.predictions.filter(p => ['Dec', 'Jan', 'Feb'].some(m => p.month.includes(m)))
      const avgSummer = summerMonths.reduce((sum, p) => sum + p.visitors, 0) / summerMonths.length
      const avgWinter = winterMonths.reduce((sum, p) => sum + p.visitors, 0) / winterMonths.length

      this.aiAnalysis = {
        summary: this.generateAiSummary(avgGrowth, peak, low, trend, avgMonthly, currentAvg),
        insights: [
          {
            icon: 'analytics',
            color: this.accentColor,
            title: 'Annual Growth Projection',
            description: `Your footfall is expected to ${trend === 'increase' ? 'grow' : trend === 'decrease' ? 'decline' : 'remain stable'} by ${Math.abs(avgGrowth)}% in 2025, from ${currentAvg.toLocaleString()} to ${avgMonthly.toLocaleString()} average monthly visitors.`,
            commentary: avgGrowth > 10 ? '🚀 Strong growth trajectory! Consider expanding your capacity and services.' : avgGrowth > 0 ? '📈 Positive trend. Maintain your current strategies while exploring new opportunities.' : avgGrowth > -5 ? '📊 Stable performance. Focus on customer retention and experience improvement.' : '⚠️ Declining trend. Review your strategy and consider new marketing initiatives.'
          },
          {
            icon: 'wb_sunny',
            color: 'orange',
            title: 'Seasonal Patterns',
            description: `Summer months (Jun-Aug) average ${Math.round(avgSummer).toLocaleString()} visitors, while winter (Dec-Feb) averages ${Math.round(avgWinter).toLocaleString()}.`,
            commentary: avgSummer > avgWinter * 1.2 ? '☀️ Strong summer seasonality detected. Prepare for +' + Math.round(((avgSummer - avgWinter) / avgWinter) * 100) + '% higher capacity needs during peak months.' : '❄️ Winter performs well. Consider year-round promotions to maintain consistent traffic.'
          },
          {
            icon: 'stars',
            color: 'warning',
            title: 'Peak Performance',
            description: `${peak.month} will be your busiest month with ${peak.visitors.toLocaleString()} expected visitors.`,
            commentary: `📅 Mark ${peak.month} on your calendar! Ensure adequate staffing (+30-40%), inventory, and promotional campaigns. Historical data shows this is your golden period.`
          },
          {
            icon: 'trending_down',
            color: 'info',
            title: 'Low Season Strategy',
            description: `${low.month} will be the quietest with ${low.visitors.toLocaleString()} visitors.`,
            commentary: `🔧 Use ${low.month} strategically for maintenance, staff training, and testing new initiatives. Consider off-season promotions to boost traffic during this period.`
          }
        ],
        recommendations: this.generateRecommendations(avgGrowth, peak, low, avgSummer, avgWinter, trend)
      }

      this.loadingAnalysis = false
    },

    generateAiSummary (growth, peak, low, avgMonthly, currentAvg) {
      const growthText = growth > 0 ? 'growth' : growth < 0 ? 'decline' : 'stability'
      const variance = Math.round(((peak.visitors - low.visitors) / low.visitors) * 100)

      return `Based on 24 months of historical data and seasonal analysis, 2025 shows ${growthText} of ${Math.abs(growth)}% with monthly average reaching ${avgMonthly.toLocaleString()} visitors (from current ${currentAvg.toLocaleString()}). Peak traffic in ${peak.month} (${peak.visitors.toLocaleString()}) will exceed low season in ${low.month} by ${variance}%. Strong seasonal patterns identified, requiring dynamic capacity planning.`
    },

    generateRecommendations (growth, peak, low, avgSummer, avgWinter, trend) {
      const recommendations = []

      if (growth > 10) {
        recommendations.push({
          icon: 'expand',
          color: 'positive',
          title: 'Capacity Expansion',
          description: 'With +' + growth + '% growth, consider expanding your physical space, staff, and services to accommodate increased demand.',
          priority: 'high',
          actions: ['Hire additional staff', 'Increase inventory by 20-30%', 'Explore expansion opportunities', 'Upgrade infrastructure']
        })
      } else if (growth < -5) {
        recommendations.push({
          icon: 'crisis_alert',
          color: 'negative',
          title: 'Performance Recovery',
          description: 'Declining footfall requires immediate attention. Review your marketing strategy and customer experience.',
          priority: 'high',
          actions: ['Conduct customer surveys', 'Launch retention campaigns', 'Review pricing strategy', 'Analyze competitor activity']
        })
      }

      if (peak.visitors > avgSummer * 0.9) {
        recommendations.push({
          icon: 'event_available',
          color: 'warning',
          title: 'Peak Season Preparation',
          description: `Prepare for ${peak.month} with enhanced capacity and special promotions.`,
          priority: 'high',
          actions: [
            'Schedule +30% staff for ' + peak.month,
            'Launch pre-season marketing campaigns',
            'Stock up inventory 2 months ahead',
            'Plan special events and promotions'
          ]
        })
      }

      if (avgSummer > avgWinter * 1.3) {
        recommendations.push({
          icon: 'ac_unit',
          color: 'info',
          title: 'Off-Season Activation',
          description: 'Large seasonal variance detected. Boost winter traffic with targeted campaigns.',
          priority: 'medium',
          actions: [
            'Create winter-specific promotions',
            'Offer seasonal packages and discounts',
            'Host indoor events during cold months',
            'Launch loyalty programs to maintain engagement'
          ]
        })
      }

      if (trend === 'stable') {
        recommendations.push({
          icon: 'psychology',
          color: 'secondary',
          title: 'Innovation Opportunity',
          description: 'Stable performance creates opportunity for strategic innovation without risk.',
          priority: 'medium',
          actions: [
            'Test new product lines',
            'Pilot new service concepts',
            'Experiment with digital channels',
            'Invest in customer experience improvements'
          ]
        })
      }

      recommendations.push({
        icon: 'campaign',
        color: 'purple',
        title: 'Targeted Marketing',
        description: 'Align marketing spend with predicted footfall patterns for maximum ROI.',
        priority: 'medium',
        actions: [
          'Increase ad spend 2 months before peak season',
          'Run retention campaigns during low months',
          'Focus on social media during high-traffic periods',
          'Track conversion rates by season'
        ]
      })

      recommendations.push({
        icon: 'schedule',
        color: this.accentColor,
        title: 'Dynamic Scheduling',
        description: 'Optimize staff scheduling based on predicted monthly footfall.',
        priority: 'low',
        actions: [
          'Create flexible shift patterns',
          'Cross-train staff for peak periods',
          'Use part-time staff during high season',
          'Schedule maintenance during ' + low.month
        ]
      })

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
        <q-icon name="groups" size="sm" class="q-mr-sm" />
        Footfall
        <q-space />
        <q-icon
          :name="getTrend() === 'increase' ? 'trending_up' : getTrend() === 'decrease' ? 'trending_down' : 'trending_flat'"
          :color="getTrend() === 'increase' ? 'positive' : getTrend() === 'decrease' ? 'negative' : 'grey'"
        />
      </div>

      <div class="text-h4 text-weight-bold q-mt-md" :style="{ color: titleColor }">
        {{ currentAffluence.toLocaleString() }}
        <span class="text-caption" :style="{ color: textColor, opacity: 0.7 }">visitors/month</span>
      </div>

      <q-separator class="q-my-md" :color="accentColor" />

      <div class="text-subtitle2" :style="{ color: titleColor }">2025 Predictions</div>
      <div class="text-body2" :style="{ color: textColor }">
        Avg. growth:
        <span :class="getAverageGrowth() > 0 ? 'text-positive' : 'text-negative'">
          {{ getAverageGrowth() > 0 ? '+' : '' }}{{ getAverageGrowth() }}%
        </span>
      </div>

      <div class="text-caption q-mt-xs" :style="{ color: textColor, opacity: 0.7 }">
        <q-icon name="celebration" size="xs" class="q-mr-xs" />
        Peak: {{ getSeasonalPeak() }}
      </div>

      <q-linear-progress
        :value="Math.abs(getAverageGrowth()) / 100"
        :color="getAverageGrowth() > 0 ? 'positive' : 'negative'"
        class="q-mt-sm"
      />

      <div class="text-center text-caption q-mt-md" :style="{ color: textColor, opacity: 0.6 }">
        <q-icon name="open_in_full" size="xs" />
        Click for details
      </div>
    </q-card-section>

    <!-- Main Dialog -->
    <q-dialog v-model="showDialog" maximized>
      <q-card :style="{ backgroundColor: cardBgColor, color: textColor }">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h5" :style="{ color: titleColor }">
            <q-icon name="groups" class="q-mr-sm" />
            Footfall Analysis
          </div>
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
          <div class="row q-col-gutter-md">
            <!-- Statistics -->
            <div class="col-12 col-md-3">
              <q-card flat bordered :style="{ backgroundColor: cardBgColor, borderColor: accentColor }">
                <q-card-section>
                  <div class="text-caption" :style="{ color: textColor, opacity: 0.7 }">Current Footfall</div>
                  <div class="text-h5 text-weight-bold" :style="{ color: titleColor }">{{ currentAffluence.toLocaleString() }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered :style="{ backgroundColor: cardBgColor, borderColor: accentColor }">
                <q-card-section>
                  <div class="text-caption" :style="{ color: textColor, opacity: 0.7 }">Expected Growth</div>
                  <div class="text-h5 text-weight-bold" :class="getAverageGrowth() > 0 ? 'text-positive' : 'text-negative'">
                    {{ getAverageGrowth() > 0 ? '+' : '' }}{{ getAverageGrowth() }}%
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered :style="{ backgroundColor: cardBgColor, borderColor: accentColor }">
                <q-card-section>
                  <div class="text-caption" :style="{ color: textColor, opacity: 0.7 }">Peak Month</div>
                  <div class="text-h6 text-weight-bold" :style="{ color: titleColor }">{{ getSeasonalPeak() }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered :style="{ backgroundColor: cardBgColor, borderColor: accentColor }">
                <q-card-section>
                  <div class="text-caption" :style="{ color: textColor, opacity: 0.7 }">Trend</div>
                  <div class="text-h5 text-weight-bold row items-center">
                    <q-icon
                      :name="getTrend() === 'increase' ? 'trending_up' : getTrend() === 'decrease' ? 'trending_down' : 'trending_flat'"
                      :color="getTrend() === 'increase' ? 'positive' : getTrend() === 'decrease' ? 'negative' : 'grey'"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Chart -->
          <div class="q-mt-md">
            <q-card flat bordered :style="{ backgroundColor: cardBgColor, borderColor: accentColor }">
              <q-card-section>
                <div class="text-h6 q-mb-md" :style="{ color: titleColor }">Evolution and Predictions</div>
                <canvas ref="chart" style="max-height: 400px;"></canvas>
              </q-card-section>
            </q-card>
          </div>

          <!-- Detailed Table -->
          <div class="q-mt-md">
            <q-card flat bordered :style="{ backgroundColor: cardBgColor, borderColor: accentColor }">
              <q-card-section>
                <div class="text-h6 q-mb-md" :style="{ color: titleColor }">Monthly Details 2025</div>
                <q-table
                  :rows="predictions"
                  :columns="[
                    { name: 'month', label: 'Month', field: 'month', align: 'left' },
                    { name: 'visitors', label: 'Predicted Visitors', field: 'visitors', format: val => val.toLocaleString(), align: 'right' },
                    { name: 'trend', label: 'Trend', field: 'trend', format: val => val.toLocaleString(), align: 'right' },
                    { name: 'seasonalFactor', label: 'Seasonal Factor', field: 'seasonalFactor', align: 'right' }
                  ]"
                  row-key="month"
                  flat
                  dense
                  :style="{ color: textColor }"
                />
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
          <div class="text-h5">AI Analysis - Annual Footfall Predictions</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup :color="cardBgColor" />
        </q-card-section>

        <q-card-section v-if="loadingAnalysis" class="column items-center justify-center" style="min-height: 400px;">
          <q-spinner-gears :color="accentColor" size="80px" />
          <div class="text-h6 q-mt-md" :style="{ color: textColor, opacity: 0.7 }">Analyzing data...</div>
          <div class="text-caption" :style="{ color: textColor, opacity: 0.6 }">AI is processing your footfall trends</div>
        </q-card-section>

        <q-card-section v-if="!loadingAnalysis && aiAnalysis">
          <!-- Summary -->
          <q-card flat bordered class="q-mb-md" :style="{ backgroundColor: accentColor + '20', borderColor: accentColor }">
            <q-card-section>
              <div class="row items-start">
                <q-icon name="summarize" size="32px" :color="accentColor" class="q-mr-md" />
                <div>
                  <div class="text-h6 q-mb-sm" :style="{ color: titleColor }">Executive Summary</div>
                  <div class="text-body1" :style="{ color: textColor }">{{ aiAnalysis.summary }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Insights with Commentary -->
          <div class="text-h6 q-mb-md" :style="{ color: titleColor }">
            <q-icon name="lightbulb" class="q-mr-sm" />
            Strategic Insights
          </div>
          <div class="q-gutter-md q-mb-lg">
            <q-card
              v-for="(insight, i) in aiAnalysis.insights"
              :key="i"
              flat
              bordered
              :style="{ backgroundColor: cardBgColor, borderColor: accentColor }"
            >
              <q-card-section>
                <div class="row items-start q-mb-md">
                  <q-avatar :icon="insight.icon" :color="insight.color" text-color="white" size="48px" class="q-mr-md" />
                  <div class="col">
                    <div class="text-h6 text-weight-bold q-mb-xs" :style="{ color: titleColor }">{{ insight.title }}</div>
                    <div class="text-body2" :style="{ color: textColor }">{{ insight.description }}</div>
                  </div>
                </div>
                <q-separator class="q-my-sm" :color="accentColor" />
                <div class="row items-start">
                  <q-icon name="chat" :color="accentColor" size="24px" class="q-mr-sm" />
                  <div class="col">
                    <div class="text-caption text-weight-bold q-mb-xs" :style="{ color: accentColor }">AI Commentary</div>
                    <div class="text-body2" style="white-space: pre-line;" :style="{ color: textColor }">{{ insight.commentary }}</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Recommendations -->
          <div class="text-h6 q-mb-md" :style="{ color: titleColor }">
            <q-icon name="recommend" class="q-mr-sm" />
            Action Plan
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
                'border-info': rec.priority === 'medium'
              }"
            >
              <q-card-section>
                <div class="row items-start q-mb-md">
                  <q-badge
                    :color="rec.priority === 'high' ? 'negative' : rec.priority === 'medium' ? 'warning' : 'grey'"
                    :label="rec.priority === 'high' ? 'High Priority' : rec.priority === 'medium' ? 'Medium Priority' : 'Low Priority'"
                    class="q-mr-md"
                  />
                  <q-avatar :icon="rec.icon" :color="rec.color" text-color="white" size="40px" class="q-mr-md" />
                  <div class="col">
                    <div class="text-subtitle1 text-weight-bold" :style="{ color: titleColor }">{{ rec.title }}</div>
                    <div class="text-body2 q-mb-sm" :style="{ color: textColor, opacity: 0.7 }">{{ rec.description }}</div>
                    <div class="text-caption text-weight-bold q-mb-xs" :style="{ color: accentColor }">Recommended Actions:</div>
                    <ul class="q-pl-md q-my-xs">
                      <li v-for="(action, j) in rec.actions" :key="j" class="text-body2" :style="{ color: textColor }">{{ action }}</li>
                    </ul>
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
</style>
