import { resolve } from 'path'
import { defineConfig } from 'vitepress'

const repositoryUrl = 'https://github.com/conexaoazul/blue-credit-api-docs'

export default defineConfig({
  base: '/doc/',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,

  // As traduções herdadas do starter ainda descrevem outra API. Elas ficam
  // fora do build até passarem por revisão técnica e tradução completa.
  srcExclude: ['en/**', 'es/**', 'fr/**'],

  head: [
    ['meta', { name: 'theme-color', content: '#0052cc' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'robots', content: 'index,follow' }],
    ['link', { rel: 'icon', href: '/doc/favicon.svg' }]
  ],

  locales: {
    pt: {
      label: 'Português (Brasil)',
      lang: 'pt-BR',
      title: 'Blue Credit API',
      description:
        'Documentação oficial da Blue Credit API para consultas cadastrais, veiculares, protestos, score e dívidas.',
      link: '/pt/',
      themeConfig: {
        siteTitle: 'Blue Credit API',
        nav: [
          { text: 'Início rápido', link: '/pt/inicio-rapido' },
          { text: 'Integrações e preços', link: '/pt/navegacao-dados' },
          { text: 'API Reference', link: '/pt/api-reference' },
          {
            text: 'Ajuda',
            items: [
              { text: 'Perguntas frequentes', link: '/pt/faq' },
              { text: 'Suporte por e-mail', link: 'mailto:ola@conexaoazul.com' },
              { text: 'GitHub', link: repositoryUrl }
            ]
          }
        ],
        sidebar: [
          {
            text: 'Comece aqui',
            items: [
              { text: '🚀 Visão geral', link: '/pt/intro' },
              { text: '⚡ Início rápido', link: '/pt/inicio-rapido' },
              { text: '🔑 Autenticação e ambientes', link: '/pt/auth-ambiente' }
            ]
          },
          {
            text: 'Integração',
            items: [
              { text: '📚 Integrações e preços', link: '/pt/navegacao-dados' },
              { text: '💡 Exemplos de uso', link: '/pt/exemplos-api-aux' },
              { text: '⚠️ Respostas e erros', link: '/pt/respostas-erros' },
              { text: '🚦 Limites e boas práticas', link: '/pt/boas-praticas' },
              { text: '❓ Perguntas frequentes', link: '/pt/faq' },
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
                    buttonText: 'Buscar na documentação',
                    buttonAriaLabel: 'Buscar na documentação'
                  },
                  modal: {
                    noResultsText: 'Nenhum resultado encontrado',
                    resetButtonTitle: 'Limpar busca',
                    footer: {
                      selectText: 'selecionar',
                      navigateText: 'navegar',
                      closeText: 'fechar'
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
        footer: {
          copyright: 'Blue Credit API © 2026 · Conexão Azul Digital'
        },
        docFooter: {
          prev: 'Página anterior',
          next: 'Próxima página'
        },
        lastUpdated: {
          text: 'Atualizado em',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short'
          }
        },
        editLink: {
          pattern: `${repositoryUrl}/edit/main/docs/:path`,
          text: 'Sugerir melhoria nesta página'
        },
        externalLinkIcon: true,
        socialLinks: [{ icon: 'github', link: repositoryUrl }]
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
