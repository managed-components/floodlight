import { Client } from '@managed-components/types'

export const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min)) + min

export function setGclDcCookie(client: Client) {
  // search for _gl param used for cross-domain tracking, and extract the _gcl_aw cookie value from it
  try {
    const ts = Math.floor(new Date().valueOf() / 1000)

    // search for gclid param and set it as the _gcl_aw cookie value
    if (client.url.searchParams.get('dclid')) {
      const dclid = client.url.searchParams.get('dclid')
      if (dclid) {
        client.set('_gcl_dc', `GCL.${ts}.${dclid}`, {
          scope: 'infinite',
        })
      }
    }
  } catch (e) {
    console.error('Google Ads: Error parsing dclid')
    console.error(e)
  }
}
