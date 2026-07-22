import { resolve } from 'path'
import { defineConfig } from 'vitepress'

const sharedFooter = {
  copyright: 'Blue Credit API © 2026 · Conexão Azul Digital'
}

export default defineConfig({
  base: '/doc/',
  cleanUrls: true,
  lastUpdated: false,
  ignoreDeadLinks: true,

  head: [
    ['meta', { name: 'theme-color', content: '#0052cc' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['link', { rel: 'icon', href: '/favicon.svg' }]
  ],

  locales: {
    pt: {
      label: 'Português (Brasil)',
      lang: 'pt',
      title: 'Blue Credit API',
      description: 'Documentação da API REST da Blue Credit API — consultas cadastrais, veiculares, protestos, score e dívidas.',
      link: '/pt/',
      themeConfig: {
        siteTitle: true,
        nav: [
          { text: 'Home', link: '/pt/' },
          { text: 'Visão Geral', link: '/pt/intro' },
          { text: 'API Reference', link: '/pt/api-reference' },
          {
            text: 'Recursos',
            items: [
              { text: 'GitHub', link: 'https://github.com/conexaoazul/blue-credit-api-docs' }
            ]
          }
        ],
        sidebar: [
          {
            text: 'Documentação',
            items: [
              { text: '🚀 Visão Geral', link: '/pt/intro' },
              { text: '🔗 API Reference', link: '/pt/api-reference' }
            ]
          }
        ],
        search: {
          provider: 'local',
          options: {
            locales: {
              pt: {
                translations: {
                  button: {
                    buttonText: 'Buscar documentos',
                    buttonAriaLabel: 'Buscar documentos'
                  },
                  modal: {
                    noResultsText: 'Nenhum resultado encontrado',
                    resetButtonTitle: 'Limpar busca',
                    footer: {
                      selectText: 'para selecionar',
                      navigateText: 'para navegar',
                      closeText: 'para fechar'
                    }
                  }
                }
              }
            }
          }
        },
        outline: {
          level: [2, 3],
          label: 'Nesta página'
        },
        footer: sharedFooter,
        docFooter: {
          prev: 'Página anterior',
          next: 'Próxima página'
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/conexaoazul/blue-credit-api-docs' }
        ]
      }
    },

    en: {
      label: 'English',
      lang: 'en',
      title: 'Blue Credit API',
      description: 'REST API documentation for Blue Credit API — registry, vehicle, protest, credit score and debt queries.',
      link: '/en/',
      themeConfig: {
        siteTitle: true,
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Overview', link: '/en/intro' },
          { text: 'API Reference', link: '/en/api-reference' },
          {
            text: 'Resources',
            items: [
              { text: 'GitHub', link: 'https://github.com/conexaoazul/blue-credit-api-docs' }
            ]
          }
        ],
        sidebar: [
          {
            text: 'Documentation',
            items: [
              { text: '🚀 Overview', link: '/en/intro' },
              { text: '🔗 API Reference', link: '/en/api-reference' }
            ]
          }
        ],
        outline: {
          level: [2, 3],
          label: 'On this page'
        },
        footer: sharedFooter,
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/conexaoazul/blue-credit-api-docs' }
        ]
      }
    },

    es: {
      label: 'Español',
      lang: 'es',
      title: 'Blue Credit API',
      description: 'Documentación de la API REST de Blue Credit API.',
      link: '/es/',
      themeConfig: {
        siteTitle: true,
        nav: [
          { text: 'Inicio', link: '/es/' },
          { text: 'Visión General', link: '/es/intro' },
          { text: 'Referencia API', link: '/es/api-reference' }
        ],
        sidebar: [
          {
            text: 'Documentación',
            items: [
              { text: '🚀 Visión General', link: '/es/intro' },
              { text: '🔗 Referencia API', link: '/es/api-reference' }
            ]
          }
        ],
        outline: {
          level: [2, 3],
          label: 'En esta página'
        },
        footer: sharedFooter,
        docFooter: {
          prev: 'Página anterior',
          next: 'Siguiente página'
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/conexaoazul/blue-credit-api-docs' }
        ]
      }
    },

    fr: {
      label: 'Français',
      lang: 'fr',
      title: 'Blue Credit API',
      description: 'Documentation de l API REST Blue Credit API.',
      link: '/fr/',
      themeConfig: {
        siteTitle: true,
        nav: [
          { text: 'Accueil', link: '/fr/' },
          { text: 'Aperçu', link: '/fr/intro' },
          { text: 'Référence API', link: '/fr/api-reference' }
        ],
        sidebar: [
          {
            text: 'Documentation',
            items: [
              { text: '🚀 Aperçu', link: '/fr/intro' },
              { text: '🔗 Référence API', link: '/fr/api-reference' }
            ]
          }
        ],
        outline: {
          level: [2, 3],
          label: 'Sur cette page'
        },
        footer: sharedFooter,
        docFooter: {
          prev: 'Page précédente',
          next: 'Page suivante'
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/conexaoazul/blue-credit-api-docs' }
        ]
      }
    }
  },

  vite: {
    ssr: {
      noExternal: ['@scalar/api-reference', '@vueuse/motion', '@vueuse/core', 'motion-v']
    },
    build: {
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
        }
      }
    },
    css: {
      postcss: {
        plugins: []
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './theme')
      }
    }
  }
})
