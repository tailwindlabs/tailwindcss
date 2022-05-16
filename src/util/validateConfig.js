import log from './log'

export function validateConfig(config) {
  if (config.content.files.length === 0) {
    log.warn('content-problems', [
      'The `content` option in your Tailwind CSS configuration is missing or empty.',
      'Configure your content sources or your generated CSS will be missing styles.',
      'https://tailwindcss.com/docs/content-configuration',
    ])
  }

  return config
}
