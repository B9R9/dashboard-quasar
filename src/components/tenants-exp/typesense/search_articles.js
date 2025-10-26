import * as typesenseService from './typesenseService.js'
import { v4 as uuidv4 } from 'uuid'

await typesenseService.migrateCollection('search_articles')
await typesenseService.addDocument({
  id: uuidv4(),
  title: 'modify password',
  link: '/account/settings/security',
  tags: ['password', 'account', 'security']
}, 'search_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'Reset password',
  link: '/forgot-password',
  tags: ['password', 'reset', 'login']
}, 'search_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'forgot password',
  link: '/forgot-password',
  tags: ['password', 'reset', 'login']
}, 'search_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'Two-factor authentication',
  link: '/account/settings/security',
  tags: ['security', '2fa', 'account']
}, 'search_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'Create an Offer',
  link: '/offers/new',
  tags: ['offers', 'manage', 'test']
}, 'search_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'Delete an Offer',
  link: '/delete-offer',
  tags: ['offers', 'manage', 'test']
}, 'search_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'approve an Offer',
  link: '/approve-offer',
  tags: ['offers', 'manage', 'test']
}, 'search_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'edit an Offer',
  link: '/edit-offer',
  tags: ['offers', 'manage', 'test']
}, 'search_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'No sense',
  link: '/nonsense',
  tags: ['offers', 'manage', 'test']
}, 'search_articles')
