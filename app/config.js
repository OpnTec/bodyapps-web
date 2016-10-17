var env = process.env;

var config = module.exports = {

  mongo: {
    uri: env.MONGODB_URI || 'mongodb://localhost/bodyapps-service-test',
  },

  google_oauth: {
    client_id: env.GOOGLE_CLIENT_ID || '-',
    client_secret: env.GOOGLE_CLIENT_SECRET || '-'
  },

  logging: {
    level: env.LOG_LEVEL || 'info'
  },

  session: {
    secret: env.SESSION_SECRET || '8527a100-2b37-11e4-8c21-0800200c9a66'
  },

  transport: {
    type: 'SMTP'
  },

  transportOptions: {
    service: 'GMail',
    auth: {
      user: env.GMAIL_USER || '-',
      pass: env.GMAIL_PASS || '-'
    }
  },

  messageOptions: {
    from: 'mailer@bodyapps.org'
  }
}
