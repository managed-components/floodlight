import { ComponentSettings, Client } from '@managed-components/types'
import { getRequestUrl } from '.'

describe('Floodlight MC sends request to the correct URL', () => {
  it('Produces URL with the correct query params', () => {
    // Create a proper URL instance for the mock
    const mockUrl = new URL('http://127.0.0.1:1337/')

    // Mock client object to conform to the Client type
    const mockClient: Client = {
      get: (key: string) => (key === '_gcl_dc' ? '1.1234567890.abcdef' : undefined),
      set: (key: string, value?: string | null) => true, // Simulate successful "set"
      fetch: () => undefined, // Mock fetch as a no-op
      execute: () => undefined, // Mock execute as a no-op
      return: () => undefined, // Mock return as a no-op
      attachEvent: () => undefined, // Mock attachEvent as a no-op
      detachEvent: () => undefined, // Mock detachEvent as a no-op
      url: mockUrl, // Use the proper URL instance here
      title: 'Zaraz "Test" /t Page',
      timestamp: 1670502437,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      language: 'en-GB',
      referer: '',
      ip: '127.0.0.1',
      emitter: 'browser',
    }

    const event = {
      type: 'pageview',
      payload: {
        timestamp: 1670502437,
        groupTag: '111',
        activityTag: '222',
        u1: 'bbb',
      },
      name: undefined,
      client: mockClient,
    }

    const settings: ComponentSettings = { advertiserId: '54321' }

    // Generate and validate the request URL
    const requestUrl = getRequestUrl(settings, event.payload, event.client)
    const url = new URL(requestUrl.split('?')[0]) // Split query params

    expect(url.origin).toEqual('https://ad.doubleclick.net')
    expect(url.pathname.split(';')[0]).toEqual('/activity') // Validate the base pathname
    expect(requestUrl).toContain(`src=${settings.advertiserId}`)
    expect(requestUrl).toContain(`type=${event.payload.groupTag}`)
    expect(requestUrl).toContain(`cat=${event.payload.activityTag}`)
    expect(requestUrl).toMatch(/ord=\d{12,14}/) // Match random number
    expect(requestUrl).toContain('u1=bbb')
    expect(requestUrl).toContain('gcldc=abcdef')
  })
})