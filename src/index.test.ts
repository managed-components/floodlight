import { ComponentSettings } from '@managed-components/types'
import { getRequestUrl } from '.'

describe('Floodlight MC sends request to the correct url', () => {
  it('Produces url with the correct query params', () => {
    const searchParams = new URLSearchParams()
    const event = {
      type: 'pageview',
      payload: {
        timestamp: 1670502437,
        groupTag: '111',
        activityTag: '222',
        u1: 'bbb',
      },
      name: undefined,
      client: {
        url: {
          href: 'http://127.0.0.1:1337/',
          origin: 'http://127.0.0.1:1337',
          protocol: 'http:',
          username: '',
          password: '',
          host: '127.0.0.1:1337',
          hostname: '127.0.0.1',
          port: '1337',
          pathname: '/',
          search: '',
          searchParams,
          hash: '',
        },
        title: 'Zaraz "Test" /t Page',
        timestamp: 1670502437,
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        language: 'en-GB',
        referer: '',
        ip: '127.0.0.1',
        emitter: 'browser',
      },
    }
    const settings: ComponentSettings = { advertiserId: '54321' }

    const [base, ...params] = getRequestUrl(settings, event.payload).split(';')
    const urlString = base + '?' + params.join('&').slice(0, -1)
    let url: URL
    try {
      url = new URL(urlString)
    } catch {
      return false
    }
    expect(url.origin).toEqual('https://ad.doubleclick.net')
    expect(url.pathname).toEqual('/activity')
    expect(url.searchParams.get('src')).toEqual(settings.advertiserId)
    expect(url.searchParams.get('type')).toEqual(event.payload.groupTag)
    expect(url.searchParams.get('cat')).toEqual(event.payload.activityTag)
    expect(url.searchParams.get('ord')).toMatch(/[0-9]{12,14}/)
    expect(url.searchParams.get('u1')).toEqual(event.payload.u1)
  })
})
