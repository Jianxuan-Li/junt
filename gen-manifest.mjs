import 'dotenv/config'
import fs from 'fs'
import { URLS } from './allowedSites.mjs'

let options = {
  name: 'Junt',
  description: 'Track your job applications. Free and open source.',
  version: '0.2.0',
  manifest_version: 3,
  permissions: ['identity', 'scripting', 'activeTab', 'storage'],
  action: {
    default_popup: 'popup.html',
    default_icon: 'icon-128.png',
  },
  oauth2: {
    client_id: '162353131846-8m8bmuepnsk2q6sbk4hg5kah5kv4fe58.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  },
  content_scripts: [
    {
      matches: ['https://*.linkedin.com/job/search/*'],
      css: ['inject.css'],
      js: ['inject.js'],
      run_at: 'document_end',
      all_frames: true,
    },
  ],
  key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5+jmcJju/gggmZDFv4WqnK6O3/b5YGws4Qt2Io+dgg6F3rhMilA34laxgXcYJG9M/j4XPX2qfgH+zEbqa2sgYbOlW/NV8epYPxS+QoTH7PP9wGbaBKbgJjkMGxE1C0/47JyZHVY/Mzu4ELXS403mfSdD///7puyE1V6UZuzPBl1Nc5eMfzfm9GYeqYmej7qGaBR+OvKVFCNCHAhmQxrjCSF5Braj0QExLrHe8VHbz0crQ5dObI7KTVGqxE3Hly/1ZjcJ0IMLgvBMc9akw+QlKnhcCCnZ+x/9bqmfWFt27U+aUrn0VCvlQQiYM5a7eFv9FWWxGzzwu0ffmbUsTz5jQQIDAQAB',
}

if (process.env.GAPI_CLIENT_ID) {
  options.oauth2.client_id = process.env.GAPI_CLIENT_ID
}

// read version from package.json
let packageJson = JSON.parse(fs.readFileSync('package.json'))
options.version = packageJson.version

// load matched urls of allowed sites
let matches = []
for (const url in URLS) {
  matches.push(`https://*.${URLS[url]}*`)
}
options.content_scripts[0].matches = matches

// Write manifest.json
fs.writeFileSync('extension_base/manifest.json', JSON.stringify(options, null, 2))
