<script>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'TileStatistics',
  data () {
    return {
      conversionRate: 0,
      averageBasket: 0,
      customerRetention: 0,
      trafficGrowth: 0,
      historicalConversionData: [],
      historicalBasketData: [],
      historicalRetentionData: [],
      monthlyStats: [],
      loading: true,
      showDialogConversion: false,
      showDialogBasket: false,
      showDialogRetention: false,
      chartInstanceConversion: null,
      chartInstanceBasket: null,
      chartInstanceRetention: null,
      conversionAiTips: null,
      basketAiTips: null,
      retentionAiTips: null,
      loadingConversionTips: false,
      loadingBasketTips: false,
      loadingRetentionTips: false
    }
  },
  async mounted () {
    this.loadHistoricalData()
    this.calculateCurrentStats()
    this.generateMonthlyStats()
    this.loading = false
  },
  methods: {
    loadHistoricalData () {
      // Conversion Rate Data (%)
      this.historicalConversionData = [
        { month: 'Jan 2024', rate: 2.1 },
        { month: 'Feb 2024', rate: 2.3 },
        { month: 'Mar 2024', rate: 2.5 },
        { month: 'Apr 2024', rate: 2.4 },
        { month: 'May 2024', rate: 2.7 },
        { month: 'Jun 2024', rate: 2.9 },
        { month: 'Jul 2024', rate: 3.1 },
        { month: 'Aug 2024', rate: 3.0 },
        { month: 'Sep 2024', rate: 2.8 },
        { month: 'Oct 2024', rate: 2.6 },
        { month: 'Nov 2024', rate: 2.9 },
        { month: 'Dec 2024', rate: 3.2 }
      ]

      // Average Basket Data (€)
      this.historicalBasketData = [
        { month: 'Jan 2024', amount: 45.20 },
        { month: 'Feb 2024', amount: 47.50 },
        { month: 'Mar 2024', amount: 49.80 },
        { month: 'Apr 2024', amount: 48.30 },
        { month: 'May 2024', amount: 51.20 },
        { month: 'Jun 2024', amount: 53.40 },
        { month: 'Jul 2024', amount: 56.70 },
        { month: 'Aug 2024', amount: 55.20 },
        { month: 'Sep 2024', amount: 52.80 },
        { month: 'Oct 2024', amount: 50.60 },
        { month: 'Nov 2024', amount: 54.30 },
        { month: 'Dec 2024', amount: 58.90 }
      ]

      // Customer Retention Data (%)
      this.historicalRetentionData = [
        { month: 'Jan 2024', rate: 68.5 },
        { month: 'Feb 2024', rate: 70.2 },
        { month: 'Mar 2024', rate: 71.8 },
        { month: 'Apr 2024', rate: 72.3 },
        { month: 'May 2024', rate: 73.5 },
        { month: 'Jun 2024', rate: 74.8 },
        { month: 'Jul 2024', rate: 75.2 },
        { month: 'Aug 2024', rate: 74.6 },
        { month: 'Sep 2024', rate: 73.9 },
        { month: 'Oct 2024', rate: 72.8 },
        { month: 'Nov 2024', rate: 74.1 },
        { month: 'Dec 2024', rate: 76.3 }
      ]
    },

    calculateCurrentStats () {
      // Current month is last data point
      this.conversionRate = this.historicalConversionData[this.historicalConversionData.length - 1].rate
      this.averageBasket = this.historicalBasketData[this.historicalBasketData.length - 1].amount
      this.customerRetention = this.historicalRetentionData[this.historicalRetentionData.length - 1].rate

      // Calculate traffic growth (comparing last 3 months to previous 3)
      const recent = this.historicalConversionData.slice(-3).reduce((sum, d) => sum + d.rate, 0) / 3
      const previous = this.historicalConversionData.slice(-6, -3).reduce((sum, d) => sum + d.rate, 0) / 3
      this.trafficGrowth = (((recent - previous) / previous) * 100).toFixed(1)
    },

    generateMonthlyStats () {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      this.monthlyStats = months.map((month, i) => {
        // Simple trend prediction
        const conversionTrend = this.historicalConversionData[this.historicalConversionData.length - 1].rate + (i * 0.1)
        const basketTrend = this.historicalBasketData[this.historicalBasketData.length - 1].amount + (i * 0.5)
        const retentionTrend = this.historicalRetentionData[this.historicalRetentionData.length - 1].rate + (i * 0.2)

        return {
          month: `${month} 2025`,
          conversion: Math.min(Math.max(conversionTrend + (Math.random() - 0.5) * 0.3, 1.5), 5).toFixed(1),
          basket: Math.max(basketTrend + (Math.random() - 0.5) * 2, 40).toFixed(2),
          retention: Math.min(Math.max(retentionTrend + (Math.random() - 0.5) * 1, 65), 85).toFixed(1)
        }
      })
    },

    getConversionGrowth () {
      const current = this.historicalConversionData[this.historicalConversionData.length - 1].rate
      const previous = this.historicalConversionData[this.historicalConversionData.length - 2].rate
      return (((current - previous) / previous) * 100).toFixed(1)
    },

    getBasketGrowth () {
      const current = this.historicalBasketData[this.historicalBasketData.length - 1].amount
      const previous = this.historicalBasketData[this.historicalBasketData.length - 2].amount
      return (((current - previous) / previous) * 100).toFixed(1)
    },

    getRetentionGrowth () {
      const current = this.historicalRetentionData[this.historicalRetentionData.length - 1].rate
      const previous = this.historicalRetentionData[this.historicalRetentionData.length - 2].rate
      return (((current - previous) / previous) * 100).toFixed(1)
    },

    getAverageConversion () {
      const avg = this.monthlyStats.reduce((sum, s) => sum + parseFloat(s.conversion), 0) / 12
      return avg.toFixed(1)
    },

    getAverageBasket () {
      const avg = this.monthlyStats.reduce((sum, s) => sum + parseFloat(s.basket), 0) / 12
      return avg.toFixed(2)
    },

    getAverageRetention () {
      const avg = this.monthlyStats.reduce((sum, s) => sum + parseFloat(s.retention), 0) / 12
      return avg.toFixed(1)
    },

    async generateConversionTips () {
      this.loadingConversionTips = true
      await new Promise(resolve => setTimeout(resolve, 1000))

      const growth = parseFloat(this.getConversionGrowth())
      const current = this.conversionRate
      const avgFuture = parseFloat(this.getAverageConversion())

      this.conversionAiTips = {
        currentRate: {
          tip: current > 3.0
            ? `🎯 Excellent ${current}% conversion rate! You're outperforming industry standards (2-3%). Focus on maintaining quality.`
            : current > 2.0
              ? `📊 Solid ${current}% conversion rate. Room for optimization through A/B testing and UX improvements.`
              : `⚠️ ${current}% conversion needs attention. Review user journey, checkout process, and trust signals.`
        },
        growth: {
          tip: growth > 5
            ? `🚀 Strong +${growth}% growth! Your optimization efforts are paying off. Document what's working.`
            : growth > 0
              ? `📈 Positive ${growth}% trend. Continue testing and iterating on successful patterns.`
              : `📉 ${Math.abs(growth)}% decline. Analyze recent changes and consider rolling back problematic updates.`
        },
        forecast: {
          tip: avgFuture > current
            ? `🔮 Predicted improvement to ${avgFuture}% average in 2025. Invest in conversion optimization tools and training.`
            : '🔧 Maintain current performance with continuous testing. Small improvements compound over time.'
        },
        recommendations: {
          tip: current < 2.5
            ? '💡 Quick wins: Simplify checkout (1-click), add social proof, optimize mobile experience, offer guest checkout.'
            : '💡 Advanced optimization: Implement personalization, retargeting campaigns, exit-intent popups, and live chat support.'
        }
      }

      this.loadingConversionTips = false
    },

    async generateBasketTips () {
      this.loadingBasketTips = true
      await new Promise(resolve => setTimeout(resolve, 1000))

      const growth = parseFloat(this.getBasketGrowth())
      const current = this.averageBasket
      const avgFuture = parseFloat(this.getAverageBasket())

      this.basketAiTips = {
        currentBasket: {
          tip: current > 55
            ? `💰 Strong €${current.toFixed(2)} average basket! Your upselling strategies are effective.`
            : current > 45
              ? `📊 Healthy €${current.toFixed(2)} basket size. Implement cross-selling to boost further.`
              : `⚠️ €${current.toFixed(2)} basket is below potential. Focus on product bundles and recommendations.`
        },
        growth: {
          tip: growth > 3
            ? `🚀 Impressive +${growth}% basket growth! Your merchandising strategies are working excellently.`
            : growth > 0
              ? `📈 Positive ${growth}% growth. Test product bundles and 'frequently bought together' suggestions.`
              : `📉 ${Math.abs(growth)}% decrease. Review pricing strategy and product recommendations engine.`
        },
        forecast: {
          tip: avgFuture > current
            ? `🔮 Projected €${avgFuture} average by 2025. Implement tiered discounts (spend €X, save Y%).`
            : '🔧 Maintain basket value with strategic product placement and limited-time bundle offers.'
        },
        recommendations: {
          tip: current < 50
            ? '💡 Boost basket: Add minimum order for free shipping, create product bundles, suggest complementary items, offer volume discounts.'
            : '💡 Maximize value: Premium product suggestions, loyalty program rewards, exclusive bundle offers, time-limited upsells.'
        }
      }

      this.loadingBasketTips = false
    },

    async generateRetentionTips () {
      this.loadingRetentionTips = true
      await new Promise(resolve => setTimeout(resolve, 1000))

      const growth = parseFloat(this.getRetentionGrowth())
      const current = this.customerRetention
      const avgFuture = parseFloat(this.getAverageRetention())

      this.retentionAiTips = {
        currentRate: {
          tip: current > 75
            ? `🌟 Outstanding ${current}% retention rate! Your customer loyalty programs are highly effective.`
            : current > 65
              ? `👍 Good ${current}% retention. Enhance with personalized communication and rewards.`
              : `⚠️ ${current}% retention needs improvement. Implement win-back campaigns and loyalty incentives.`
        },
        growth: {
          tip: growth > 2
            ? `🚀 Excellent +${growth}% retention growth! Your customer experience initiatives are succeeding.`
            : growth > 0
              ? `📈 Positive ${growth}% trend. Continue building customer relationships and value.`
              : `📉 ${Math.abs(growth)}% decline. Survey churned customers and address pain points immediately.`
        },
        forecast: {
          tip: avgFuture > current
            ? `🔮 Trending towards ${avgFuture}% by 2025. Invest in customer success and personalization.`
            : '🔧 Stabilize retention with consistent engagement, exclusive offers, and exceptional support.'
        },
        recommendations: {
          tip: current < 70
            ? '💡 Improve retention: Launch loyalty program, send personalized emails, offer VIP perks, create community, gather feedback.'
            : '💡 Maximize lifetime value: Subscription models, referral rewards, exclusive early access, personalized experiences.'
        }
      }

      this.loadingRetentionTips = false
    },

    renderChartConversion () {
      const ctx = this.$refs.chartConversion
      if (!ctx) return
      if (this.chartInstanceConversion) {
        this.chartInstanceConversion.destroy()
      }

      this.chartInstanceConversion = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [...this.historicalConversionData.map(d => d.month), ...this.monthlyStats.map(d => d.month)],
          datasets: [
            {
              label: 'Historical',
              data: this.historicalConversionData.map(d => d.rate),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.3
            },
            {
              label: 'Forecast 2025',
              data: [...Array(12).fill(null), ...this.monthlyStats.map(d => parseFloat(d.conversion))],
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
              text: 'Conversion Rate - Historical and Forecast (%)'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => value + '%'
              }
            }
          }
        }
      })
    },

    renderChartBasket () {
      const ctx = this.$refs.chartBasket
      if (!ctx) return
      if (this.chartInstanceBasket) {
        this.chartInstanceBasket.destroy()
      }

      this.chartInstanceBasket = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [...this.historicalBasketData.map(d => d.month), ...this.monthlyStats.map(d => d.month)],
          datasets: [
            {
              label: 'Historical',
              data: this.historicalBasketData.map(d => d.amount),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1
            },
            {
              label: 'Forecast 2025',
              data: [...Array(12).fill(null), ...this.monthlyStats.map(d => parseFloat(d.basket))],
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 1
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
              text: 'Average Basket - Historical and Forecast (€)'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => '€' + value.toFixed(2)
              }
            }
          }
        }
      })
    },

    renderChartRetention () {
      const ctx = this.$refs.chartRetention
      if (!ctx) return
      if (this.chartInstanceRetention) {
        this.chartInstanceRetention.destroy()
      }

      this.chartInstanceRetention = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [...this.historicalRetentionData.map(d => d.month), ...this.monthlyStats.map(d => d.month)],
          datasets: [
            {
              label: 'Historical',
              data: this.historicalRetentionData.map(d => d.rate),
              borderColor: 'rgb(153, 102, 255)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'Forecast 2025',
              data: [...Array(12).fill(null), ...this.monthlyStats.map(d => parseFloat(d.retention))],
              borderColor: 'rgb(255, 159, 64)',
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderDash: [5, 5],
              tension: 0.3,
              fill: true
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
              text: 'Customer Retention Rate - Historical and Forecast (%)'
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 60,
              max: 85,
              ticks: {
                callback: (value) => value + '%'
              }
            }
          }
        }
      })
    }
  },
  watch: {
    showDialogConversion (val) {
      if (val) {
        this.$nextTick(() => {
          this.renderChartConversion()
          this.generateConversionTips()
        })
      }
    },
    showDialogBasket (val) {
      if (val) {
        this.$nextTick(() => {
          this.renderChartBasket()
          this.generateBasketTips()
        })
      }
    },
    showDialogRetention (val) {
      if (val) {
        this.$nextTick(() => {
          this.renderChartRetention()
          this.generateRetentionTips()
        })
      }
    }
  }
}
</script>

<template>
  <q-card class="col-2 bg-blue-1">
    <q-card-section>
      <div class="text-h6 row items-center">
        <q-icon name="analytics" size="sm" class="q-mr-sm" />
        Statistics
        <q-space />
        <q-badge color="info" icon="insights" dense>
          AI
        </q-badge>
      </div>

      <div class="q-mt-md">
        <div class="text-caption text-grey-7">
          Conversion Rate
          <q-icon name="trending_up" size="xs" class="q-ml-xs">
            <q-tooltip>Current conversion rate</q-tooltip>
          </q-icon>
        </div>
        <div class="text-h5 text-weight-bold">
          {{ conversionRate }}%
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div>
        <div class="text-caption text-grey-7">
          Average Basket
          <q-icon name="shopping_cart" size="xs" class="q-ml-xs">
            <q-tooltip>Average order value</q-tooltip>
          </q-icon>
        </div>
        <div class="text-h6 text-weight-bold">
          €{{ averageBasket.toFixed(2) }}
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div>
        <div class="text-caption text-grey-7">
          Customer Retention
          <q-icon name="loyalty" size="xs" class="q-ml-xs">
            <q-tooltip>Customer retention rate</q-tooltip>
          </q-icon>
        </div>
        <div class="text-h6 text-weight-bold">
          {{ customerRetention.toFixed(1) }}%
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div class="column q-gutter-sm">
        <q-btn
          flat
          dense
          no-caps
          color="primary"
          icon="percent"
          label="Conversion Analysis"
          @click="showDialogConversion = true"
          class="text-left"
        />
        <q-btn
          flat
          dense
          no-caps
          color="secondary"
          icon="shopping_bag"
          label="Basket Analysis"
          @click="showDialogBasket = true"
          class="text-left"
        />
        <q-btn
          flat
          dense
          no-caps
          color="purple"
          icon="favorite"
          label="Retention Analysis"
          @click="showDialogRetention = true"
          class="text-left"
        />
      </div>
    </q-card-section>

    <!-- Conversion Dialog -->
    <q-dialog v-model="showDialogConversion" maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h5">
            <q-icon name="percent" class="q-mr-sm" />
            Conversion Rate Analysis
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
            <!-- Current Rate -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">Current Rate</div>
                      <div class="text-h5 text-weight-bold">{{ conversionRate }}%</div>
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingConversionTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="conversionAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ conversionAiTips.currentRate.tip }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Growth -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">Monthly Growth</div>
                      <div class="text-h5 text-weight-bold" :class="getConversionGrowth() > 0 ? 'text-positive' : 'text-negative'">
                        {{ getConversionGrowth() > 0 ? '+' : '' }}{{ getConversionGrowth() }}%
                      </div>
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingConversionTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="conversionAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ conversionAiTips.growth.tip }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Forecast -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">2025 Forecast</div>
                      <div class="text-h6 text-weight-bold">{{ getAverageConversion() }}%</div>
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingConversionTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="conversionAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ conversionAiTips.forecast.tip }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Recommendations -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">Action Items</div>
                      <q-icon name="lightbulb" size="lg" color="amber" />
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingConversionTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="conversionAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ conversionAiTips.recommendations.tip }}</div>
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
                <div class="text-h6 q-mb-md">Historical Trend and Forecast</div>
                <canvas ref="chartConversion" style="max-height: 400px;"></canvas>
              </q-card-section>
            </q-card>
          </div>

          <!-- Table -->
          <div class="q-mt-md">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6 q-mb-md">Monthly Forecast 2025</div>
                <q-table
                  :rows="monthlyStats"
                  :columns="[
                    { name: 'month', label: 'Month', field: 'month', align: 'left' },
                    { name: 'conversion', label: 'Conversion Rate', field: 'conversion', format: val => val + '%', align: 'right' }
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

    <!-- Basket Dialog -->
    <q-dialog v-model="showDialogBasket" maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h5">
            <q-icon name="shopping_bag" class="q-mr-sm" />
            Average Basket Analysis
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
            <!-- Current Basket -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">Current Basket</div>
                      <div class="text-h5 text-weight-bold">€{{ averageBasket.toFixed(2) }}</div>
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingBasketTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="basketAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ basketAiTips.currentBasket.tip }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Growth -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">Monthly Growth</div>
                      <div class="text-h5 text-weight-bold" :class="getBasketGrowth() > 0 ? 'text-positive' : 'text-negative'">
                        {{ getBasketGrowth() > 0 ? '+' : '' }}{{ getBasketGrowth() }}%
                      </div>
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingBasketTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="basketAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ basketAiTips.growth.tip }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Forecast -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">2025 Forecast</div>
                      <div class="text-h6 text-weight-bold">€{{ getAverageBasket() }}</div>
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingBasketTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="basketAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ basketAiTips.forecast.tip }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Recommendations -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">Action Items</div>
                      <q-icon name="lightbulb" size="lg" color="amber" />
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingBasketTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="basketAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ basketAiTips.recommendations.tip }}</div>
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
                <div class="text-h6 q-mb-md">Historical Trend and Forecast</div>
                <canvas ref="chartBasket" style="max-height: 400px;"></canvas>
              </q-card-section>
            </q-card>
          </div>

          <!-- Table -->
          <div class="q-mt-md">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6 q-mb-md">Monthly Forecast 2025</div>
                <q-table
                  :rows="monthlyStats"
                  :columns="[
                    { name: 'month', label: 'Month', field: 'month', align: 'left' },
                    { name: 'basket', label: 'Average Basket', field: 'basket', format: val => '€' + val, align: 'right' }
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

    <!-- Retention Dialog -->
    <q-dialog v-model="showDialogRetention" maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h5">
            <q-icon name="favorite" class="q-mr-sm" />
            Customer Retention Analysis
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
            <!-- Current Rate -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">Current Rate</div>
                      <div class="text-h5 text-weight-bold">{{ customerRetention.toFixed(1) }}%</div>
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingRetentionTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="retentionAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ retentionAiTips.currentRate.tip }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Growth -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">Monthly Growth</div>
                      <div class="text-h5 text-weight-bold" :class="getRetentionGrowth() > 0 ? 'text-positive' : 'text-negative'">
                        {{ getRetentionGrowth() > 0 ? '+' : '' }}{{ getRetentionGrowth() }}%
                      </div>
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingRetentionTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="retentionAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ retentionAiTips.growth.tip }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Forecast -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">2025 Forecast</div>
                      <div class="text-h6 text-weight-bold">{{ getAverageRetention() }}%</div>
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingRetentionTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="retentionAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ retentionAiTips.forecast.tip }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Recommendations -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-start">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">Action Items</div>
                      <q-icon name="lightbulb" size="lg" color="amber" />
                    </div>
                    <q-separator vertical class="q-mx-md" />
                    <div class="col">
                      <div v-if="loadingRetentionTips" class="row items-center" style="min-height: 50px;">
                        <q-spinner-dots color="primary" size="20px" class="q-mr-sm" />
                        <span class="text-caption text-grey-6">Analyzing...</span>
                      </div>
                      <div v-else-if="retentionAiTips" class="row items-start">
                        <q-icon name="psychology" color="primary" size="20px" class="q-mr-sm" />
                        <div class="col">
                          <div class="text-caption text-weight-bold text-primary q-mb-xs">AI Tip</div>
                          <div class="text-body2">{{ retentionAiTips.recommendations.tip }}</div>
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
                <div class="text-h6 q-mb-md">Historical Trend and Forecast</div>
                <canvas ref="chartRetention" style="max-height: 400px;"></canvas>
              </q-card-section>
            </q-card>
          </div>

          <!-- Table -->
          <div class="q-mt-md">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6 q-mb-md">Monthly Forecast 2025</div>
                <q-table
                  :rows="monthlyStats"
                  :columns="[
                    { name: 'month', label: 'Month', field: 'month', align: 'left' },
                    { name: 'retention', label: 'Retention Rate', field: 'retention', format: val => val + '%', align: 'right' }
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
  </q-card>
</template>
