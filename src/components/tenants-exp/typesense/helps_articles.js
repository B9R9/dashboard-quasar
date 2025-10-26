import * as typesenseService from './typesenseService.js'
import { v4 as uuidv4 } from 'uuid'

const testTemplate = `
<div style="font-family: Arial, sans-serif; max-width:720px; padding:16px;">
  <h2 style="color:#2c3e50; margin-bottom:8px;">Instruction — Example</h2>
  <p style="color:#555; margin-bottom:12px;">
    This is a static test template. It is not dynamic and contains no injected data — useful for integration/testing.
  </p>
  <ol style="color:#333; padding-left:18px;">
    <li style="margin-bottom:10px;">
      Step 1: Open the application and sign in.
    </li>
    <li style="margin-bottom:10px;">
      Step 2: Navigate to the Settings page.
    </li>
    <li style="margin-bottom:10px;">
      Step 3: Update the desired option and save changes.
    </li>
  </ol>
  <p style="margin-top:12px; color:#666;">
    Note: This template is intentionally static for testing ingestion & rendering.
  </p>
</div>
`

await typesenseService.migrateCollection('helps_articles')
await typesenseService.addDocument({
  id: uuidv4(),
  title: 'modify password',
  content: 'To change your password, go to Account Settings > Security and click \'Change Password\'.',
  template: testTemplate,
  tags: ['password', 'account', 'security']
}, 'helps_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'Reset password',
  content: 'If you forgot your password, click "Forgot Password" on the login page to receive a reset email.',
  template: testTemplate,
  tags: ['password', 'reset', 'login']
}, 'helps_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'forgot password',
  content: 'If you forgot your password, click "Forgot Password" on the login page to receive a reset email.',
  template: testTemplate,
  tags: ['password', 'reset', 'login']
}, 'helps_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'Two-factor authentication',
  content: 'Enable 2FA in Account Settings > Security for enhanced account protection.',
  template: testTemplate,
  tags: ['security', '2fa', 'account']
}, 'helps_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'Create an Offer',
  content: 'To create an offer, navigate to the Offers section and click on "New Offer". Fill in the required details and save.',
  template: testTemplate,
  tags: ['offers', 'manage', 'test']
}, 'helps_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'Delete an Offer',
  content: 'To delete an offer, go to the Offers section, select the offer you want to delete, and click on the "Delete" button. Confirm the deletion when prompted.',
  template: testTemplate,
  tags: ['offers', 'manage', 'test']
}, 'helps_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'approve an Offer',
  content: 'To approve an offer, navigate to the Offers section, select the offer pending approval, and click on the "Approve" button.',
  template: testTemplate,
  tags: ['offers', 'manage', 'test']
}, 'helps_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'edit an Offer',
  content: 'To edit an offer, go to the Offers section, select the offer you wish to modify, click on the "Edit" button, make the necessary changes, and save.',
  template: testTemplate,
  tags: ['offers', 'manage', 'test']
}, 'helps_articles')

await typesenseService.addDocument({
  id: uuidv4(),
  title: 'No sense',
  content: 'This is a test content for offers management without specific meaning.',
  template: testTemplate,
  tags: ['offers', 'manage', 'test']
}, 'helps_articles')
