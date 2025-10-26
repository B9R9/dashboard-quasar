<script>
import { getThemeByName } from '../utils/themes.js'

export default {
  name: 'TileWeather',
  props: {
    themeSelected: {
      type: String,
      default: 'classicLight'
    }
  },
  data () {
    return {
      weather: null,
      showDetails: false
    }
  },
  computed: {
    currentTheme () {
      return getThemeByName(this.themeSelected)
    },
    borderColor () {
      return this.currentTheme.colors.accent
    },
    textColor () {
      return this.currentTheme.colors.text
    },
    titleColor () {
      return this.currentTheme.colors.title
    },
    backgroundColor () {
      return this.currentTheme.colors.background
    }
  },
  methods: {
    async fetchWeatherData () {
      const apiKey = 'LEYF4HKLK55DCFE822AC7CYSD'
      const location = 'Helsinki'
      const unitGroup = 'metric'
      const contentType = 'json'

      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=${unitGroup}&key=${apiKey}&contentType=${contentType}`

      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`)
        }
        const data = await response.json()
        console.log('Weather data fetched:', data)
        this.weather = data.days ? data.days[0] : null
      } catch (error) {
        console.error('Fetching weather data failed:', error)
      }
    },
    getWeatherIcon () {
      if (!this.weather) return 'help'
      if (this.weather.icon === 'rain') return 'rainy'
      if (this.weather.icon === 'cloudy' || this.weather.cloudcover > 50) return 'cloud'
      if (this.weather.icon === 'partly-cloudy-day') return 'partly_cloudy_day'
      return 'wb_sunny'
    },
    getIconColor () {
      if (!this.weather) return this.borderColor
      if (this.weather.icon === 'rain') return '#5DADE2'
      if (this.weather.icon === 'cloudy' || this.weather.cloudcover > 50) return '#95A5A6'
      if (this.weather.icon === 'partly-cloudy-day') return '#F39C12'
      return '#F39C12'
    }
  },
  mounted () {
    this.fetchWeatherData()
  }
}
</script>

<template>
  <div class="weather-compact" @click="showDetails = true">
    <div v-if="weather" class="weather-content">
      <q-icon
        :name="getWeatherIcon()"
        size="28px"
        :style="{ color: getIconColor() }"
        class="weather-icon"
      />
      <div class="weather-data">
        <div class="temperature" :style="{ color: titleColor }">
          {{ Math.round(weather.temp) }}°C
        </div>
        <div class="condition" :style="{ color: textColor }">
          {{ weather.conditions }}
        </div>
      </div>
    </div>
    <div v-else class="weather-loading">
      <q-spinner size="24px" :color="borderColor" />
    </div>
  </div>

  <!-- Dialog détaillé -->
  <q-dialog v-model="showDetails">
    <q-card style="min-width: 500px; max-width: 700px; border-radius: 16px;" :style="{ backgroundColor: backgroundColor, color: textColor }">
      <q-card-section class="row items-center q-pb-none" :style="{ backgroundColor: borderColor + '20' }">
        <q-icon name="wb_sunny" size="32px" :color="borderColor" class="q-mr-sm" />
        <div class="text-h6 text-weight-medium" :style="{ color: titleColor }">
          Weather Forecast - {{ weather?.datetime }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup :color="textColor" />
      </q-card-section>

      <q-separator :color="borderColor" />

      <q-card-section v-if="weather">
        <!-- Résumé du jour -->
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-md-6">
            <q-card flat bordered :style="{ borderColor: borderColor }">
              <q-card-section class="text-center">
                <q-icon
                  :name="getWeatherIcon()"
                  size="64px"
                  :style="{ color: getIconColor() }"
                />
                <div class="text-h3 text-weight-bold q-mt-sm" :style="{ color: titleColor }">
                  {{ Math.round(weather.temp) }}°C
                </div>
                <div class="text-subtitle1" :style="{ color: textColor }">
                  {{ weather.conditions }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <q-card flat bordered :style="{ borderColor: borderColor }">
              <q-card-section>
                <div class="q-gutter-sm">
                  <div class="row items-center">
                    <q-icon name="thermostat" :color="borderColor" class="q-mr-sm" />
                    <span :style="{ color: textColor }">Feels like: {{ Math.round(weather.feelslike) }}°C</span>
                  </div>
                  <div class="row items-center">
                    <q-icon name="water_drop" :color="borderColor" class="q-mr-sm" />
                    <span :style="{ color: textColor }">Humidity: {{ weather.humidity }}%</span>
                  </div>
                  <div class="row items-center">
                    <q-icon name="air" :color="borderColor" class="q-mr-sm" />
                    <span :style="{ color: textColor }">Wind: {{ Math.round(weather.windspeed) }} km/h</span>
                  </div>
                  <div class="row items-center">
                    <q-icon name="umbrella" :color="borderColor" class="q-mr-sm" />
                    <span :style="{ color: textColor }">Rain: {{ weather.precipprob }}%</span>
                  </div>
                  <div class="row items-center">
                    <q-icon name="cloud" :color="borderColor" class="q-mr-sm" />
                    <span :style="{ color: textColor }">Cloud cover: {{ weather.cloudcover }}%</span>
                  </div>
                  <div class="row items-center">
                    <q-icon name="visibility" :color="borderColor" class="q-mr-sm" />
                    <span :style="{ color: textColor }">Visibility: {{ weather.visibility }} km</span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Prévisions horaires -->
        <div class="text-h6 q-mb-md" :style="{ color: titleColor }">
          <q-icon name="schedule" class="q-mr-xs" />
          Hourly Forecast
        </div>

        <div v-if="weather?.hours && weather.hours.length" class="hourly-forecast-container">
          <q-scroll-area style="height: 350px;">
            <div class="row q-col-gutter-sm">
              <div
                v-for="hour in weather.hours"
                :key="hour.datetime"
                class="col-12 col-sm-6 col-md-4"
              >
                <q-card
                  flat
                  bordered
                  class="hour-card"
                  :style="{ borderColor: borderColor }"
                >
                  <q-card-section class="q-pa-sm">
                    <div class="row items-center no-wrap">
                      <div class="col-auto q-mr-sm">
                        <q-icon
                          :name="hour.icon === 'rain' ? 'rainy' : hour.cloudcover > 50 ? 'cloud' : 'wb_sunny'"
                          size="32px"
                          :color="hour.icon === 'rain' ? 'blue' : hour.cloudcover > 50 ? 'grey' : 'orange'"
                        />
                      </div>
                      <div class="col">
                        <div class="text-weight-bold" :style="{ color: titleColor }">
                          {{ hour.datetime }}
                        </div>
                        <div class="text-h6" :style="{ color: titleColor }">
                          {{ Math.round(hour.temp) }}°C
                        </div>
                        <div class="text-caption" :style="{ color: textColor, opacity: 0.7 }">
                          {{ hour.conditions }}
                        </div>
                      </div>
                    </div>
                    <q-separator class="q-my-xs" :color="borderColor" />
                    <div class="row items-center justify-between text-caption" :style="{ color: textColor, opacity: 0.8 }">
                      <span>
                        <q-icon name="water_drop" size="xs" :color="borderColor" />
                        {{ hour.precipprob }}%
                      </span>
                      <span>
                        <q-icon name="cloud" size="xs" :color="borderColor" />
                        {{ hour.cloudcover }}%
                      </span>
                      <span>
                        <q-icon name="air" size="xs" :color="borderColor" />
                        {{ Math.round(hour.windspeed) }} km/h
                      </span>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-scroll-area>
        </div>
        <div v-else class="text-center q-py-lg" :style="{ color: textColor, opacity: 0.6 }">
          <q-icon name="info" size="32px" class="q-mb-sm" />
          <div>No hourly data available</div>
        </div>
      </q-card-section>

      <q-separator :color="borderColor" />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Close"
          :color="borderColor"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.weather-compact {
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  min-width: 160px;
}

.weather-compact:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.1);
}

.weather-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.weather-icon {
  flex-shrink: 0;
}

.weather-data {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.temperature {
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
}

.condition {
  font-size: 12px;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.weather-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
}

.hour-card {
  transition: all 0.2s ease;
}

.hour-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hourly-forecast-container {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 12px;
}
</style>
