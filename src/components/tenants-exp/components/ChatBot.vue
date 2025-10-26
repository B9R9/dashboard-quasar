<script>
import * as typesenseService from '../typesense/typesenseService.js'

export default {
  name: 'ChatBot',
  data () {
    return {
      chat: [{ role: 'bot', content: ['How can I help you?'], time: new Date() }],
      searchQuery: '',
      isLoading: false,
      showTemplateDialog: false,
      currentTemplate: ''
    }
  },
  methods: {
    closeDrawer () {
      this.$emit('close')
    },
    sanitize (html) {
      // Créer un élément temporaire pour parser le HTML
      const temp = document.createElement('div')
      temp.innerHTML = html

      // Supprimer les scripts et les événements dangereux
      const scripts = temp.querySelectorAll('script')
      scripts.forEach(script => script.remove())

      // Supprimer les attributs on* (onclick, onload, etc.)
      const allElements = temp.querySelectorAll('*')
      allElements.forEach(el => {
        Array.from(el.attributes).forEach(attr => {
          if (attr.name.startsWith('on')) {
            el.removeAttribute(attr.name)
          }
        })
      })

      return temp.innerHTML
    },
    async performSearch () {
      if (this.searchQuery.trim() === '') return

      const userMessage = this.searchQuery.trim()

      // Ajouter le message de l'utilisateur
      this.chat.push({
        role: 'user',
        content: [userMessage],
        time: new Date()
      })

      // Réinitialiser la requête
      this.searchQuery = ''

      // Afficher le loader
      this.isLoading = true

      try {
        // Rechercher dans Typesense
        const results = await typesenseService.search(userMessage)

        // Préparer la réponse du bot
        let botResponse = []
        let actions = []

        if (results.hits && results.hits.length > 0) {
          // Prendre le meilleur résultat (le premier)
          const bestMatch = results.hits[0].document

          botResponse = [
            'I found this article that might help:',
            `**${bestMatch.title}**`,
            bestMatch.content
          ]

          // Ajouter des actions si template existe
          if (bestMatch.template) {
            actions = [
              {
                label: 'More details',
                action: 'showTemplate',
                data: { template: bestMatch.template }
              },
              {
                label: 'Was this helpful?',
                action: 'feedback',
                data: { helpful: true, articleId: bestMatch.id }
              }
            ]
          } else {
            actions = [
              {
                label: 'Was this helpful?',
                action: 'feedback',
                data: { helpful: true, articleId: bestMatch.id }
              }
            ]
          }
        } else {
          botResponse = ["I'm sorry, I couldn't find any relevant information. Please try rephrasing your question."]
          actions = [
            { label: 'Contact support', action: 'contactSupport', data: {} }
          ]
        }

        // Ajouter la réponse du bot avec actions
        this.chat.push({
          role: 'bot',
          content: botResponse,
          actions,
          time: new Date()
        })
      } catch (error) {
        console.error('Search error:', error)
        this.chat.push({
          role: 'bot',
          content: ['Sorry, an error occurred. Please try again.'],
          time: new Date()
        })
      } finally {
        this.isLoading = false
      }
    },

    // Gestionnaire d'actions
    handleAction (action, data) {
      switch (action) {
        case 'showTemplate':
          this.showTemplate(data.template)
          break
        case 'feedback':
          this.handleFeedback(data)
          break
        case 'contactSupport':
          this.contactSupport()
          break
        default:
          console.warn('Unknown action:', action)
      }
    },

    showTemplate (template) {
      this.currentTemplate = template
      this.showTemplateDialog = true
    },

    handleFeedback (data) {
      console.log('Feedback received:', data)
      this.chat.push({
        role: 'bot',
        content: ['Thank you for your feedback! 🙏'],
        time: new Date()
      })
    },

    contactSupport () {
      this.chat.push({
        role: 'bot',
        content: ['Redirecting you to support...'],
        time: new Date()
      })
      window.open('/support', '_blank')
    }
  }
}
</script>

<template>
  <div class="q-pa-md col-10">
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="chat" color="primary" text-color="white" />
        <span class="text-h6 q-ml-sm text-teal">HyperM[in]d</span>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          @click="closeDrawer"
        >
        <q-tooltip>Close chat</q-tooltip>
        </q-btn>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 60vh; overflow-y: auto;">
        <div v-for="(msg, index) in chat" :key="index" class="q-mb-sm">
          <q-chat-message
            :name="msg.role === 'bot' ? 'HyperM[in]d' : 'You'"
            :sent="msg.role === 'user'"
            :avatar="msg.role === 'bot' ? 'https://cdn.quasar.dev/img/avatar6.jpg' : 'https://cdn.quasar.dev/img/avatar5.jpg'"
            :bg-color="msg.role === 'bot' ? 'primary' : 'grey-3'"
            :text-color="msg.role === 'bot' ? 'white' : 'black'"
          >
            <template v-slot:default>
              <div>
                <!-- Contenu du message -->
                <div v-for="(line, li) in msg.content" :key="li" class="q-mb-xs">
                  {{ line }}
                </div>

                <!-- Actions cliquables -->
                <div v-if="msg.actions && msg.actions.length > 0" class="q-mt-sm q-gutter-xs">
                  <q-btn
                    v-for="(btn, bi) in msg.actions"
                    :key="bi"
                    size="sm"
                    outline
                    :label="btn.label"
                    @click="handleAction(btn.action, btn.data)"
                    :color="msg.role === 'bot' ? 'white' : 'primary'"
                  />
                </div>
              </div>
            </template>
          </q-chat-message>
        </div>

        <q-chat-message
          v-if="isLoading"
          name="HyperMind"
          avatar="https://cdn.quasar.dev/img/avatar6.jpg"
          bg-color="primary"
          text-color="white"
        >
          <q-spinner-dots size="2rem" />
        </q-chat-message>
      </q-card-section>

      <q-separator />

      <q-card-section class="row">
        <q-input
          v-model="searchQuery"
          placeholder="Ask me anything..."
          outlined
          dense
          clearable
          class="col"
          :disable="isLoading"
          @keyup.enter="performSearch"
        >
          <template v-slot:append>
            <q-icon
              name="send"
              class="cursor-pointer"
              :class="{ 'text-grey': isLoading }"
              @click="performSearch"
            />
          </template>
        </q-input>
        <q-btn
          icon="refresh"
          flat
          round
          dense
          class="q-ml-sm"
          @click="chat = [{ role: 'bot', content: ['How can I help you?'], time: new Date() }]"
        />
      </q-card-section>
    </q-card>

    <!-- Dialog pour afficher le template HTML -->
    <q-dialog v-model="showTemplateDialog">
      <q-card style="min-width: 600px; max-width: 800px; border-radius: 16px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-medium">Article Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator class="q-mt-md" />

        <q-card-section style="max-height: 70vh; overflow-y: auto;">
          <div v-html="sanitize(currentTemplate)"></div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Close"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
