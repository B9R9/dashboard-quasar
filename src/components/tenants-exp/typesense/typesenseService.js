import Typesense from 'typesense'
import { pipeline } from '@xenova/transformers'

const client = new Typesense.Client({
  nodes: [{ host: 'localhost', port: 8108, protocol: 'http' }],
  apiKey: 'xyz',
})

let embedder = null

async function embed(text) {
  if (!embedder) {
    // Charge le modèle une seule fois
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  const output = await embedder(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}

async function migrateCollection(collection) {
  try {
    await client.collections(collection).delete()
  } catch {
    console.log('Collection does not exist, creating new one...')
  }
  /** TODO:
   * Create a pre category search_articles
   * name: 'helps_categories',
      fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'vector', type: 'float[]', num_dim: 384 }
    ]
    const queryVector = await embed(userQuery)
    const categoryResults = await client.multiSearch.perform({
      searches: [
        {
          collection: 'helps_categories',
          q: '*',
          vector_query: `vector:([${queryVector.join(',')}], k:1)`
        }
      ]
    })

    const bestCategory = categoryResults.results[0].hits[0].document.name
    console.log('🧭 Category detected:', bestCategory)
    const articleResults = await client.multiSearch.perform({
      searches: [
      {
      collection: 'helps_articles',
      q: userQuery,
      query_by: 'search_text',
      vector_query: `vector:([${queryVector.join(',')}], k:5)`,
      filter_by: `category:${bestCategory}`,
      hybrid_alpha: 0.7
      }
    ]
  })
   */

  if (collection === 'helps_articles') {
    await client.collections().create({
      name: collection,
      fields: [
        { name: 'id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'template', type: 'string' },
        { name: 'vector', type: 'float[]', num_dim: 384 },
        { name: 'tags', type: 'string[]', facet: true },
        { name: 'created_at', type: 'int64' }, // Champ numérique pour le tri
        // { name: 'category', type: 'string', facet: true }
      ],
      default_sorting_field: 'created_at', // Utilise ce champ au lieu de 'id'
    })
    console.log(`✅ Collection '${collection}' created successfully`)
  }

  if (collection === 'search_articles') {
    await client.collections().create({
      name: collection,
      fields: [
        { name: 'id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'link', type: 'string' },
        { name: 'vector', type: 'float[]', num_dim: 384 },
        { name: 'tags', type: 'string[]', facet: true },
        { name: 'created_at', type: 'int64' }, // Champ numérique pour le tri
      ],
      default_sorting_field: 'created_at', // Utilise ce champ au lieu de 'id'
    })
    console.log(`✅ Collection '${collection}' created successfully`)
  }
}

async function addDocument(document, collection) {
  const title = document.title?.trim() || ''
  const content = (document.content || document.link || '').trim()
  const tags = Array.isArray(document.tags) ? document.tags : []
  let textForEmbedding
  if (content.length < 10 && title.length < 3) {
    console.warn(`⚠️ Skipping embedding for "${title || 'Untitled'}" (too little content)`)
    textForEmbedding = ''
  } else {
    // Tronquer le contenu si trop long (MiniLM ≈ 512 tokens)
    const truncated = content.slice(0, 800)
    textForEmbedding = `${title}. ${truncated}${tags.length ? `. Tags: ${tags.join(', ')}` : ''}`
  }

  let vector
  if (textForEmbedding) {
    vector = await embed(textForEmbedding)
  } else {
    // Vecteur neutre
    vector = new Array(384).fill(0)
  }

  // Ajoute un champ combiné pour les recherches hybrides
  const searchText = `${title} ${content} ${tags.join(' ')}`.trim()

  const result = await client
    .collections(collection)
    .documents()
    .create({
      ...document,
      vector,
      search_text: searchText,
      created_at: Date.now(),
    })

  console.log(`✅ Document added: ${title}`)
  return result
}

async function search(query, collection = 'helps_articles') {
  const queryVector = await embed(query)

  // Utilise multi_search avec POST pour éviter la limite de longueur
  // Adapter query_by selon la collection
  let queryBy = 'title,content'
  if (collection === 'search_articles') {
    queryBy = 'title' // search_articles n'a pas de champ 'content'
  }
  const results = await client.multiSearch.perform({
    searches: [
      {
        collection,
        q: query,
        query_by: queryBy,
        vector_query: `vector:([${queryVector.join(',')}], k:5)`,
        hybrid_alpha: 0.7, // pondère text vs vector (entre 0 et 1)
      },
    ],
  })

  console.log('\n🔍 Query:', query)
  console.log('Top results:')

  // Les résultats sont dans results.results[0]
  for (const hit of results.results[0].hits) {
    console.log('-', hit.document.title, '| Score:', hit.vector_distance)
  }

  return results.results[0]
}

export { migrateCollection, addDocument, search }
