import { ComponentSettings, Manager, MCEvent } from '@managed-components/types'
import { setGclDcCookie } from './utils'
import { Client } from '@managed-components/types'

const getUrlString = (query: { [k: string]: string }) => {
  return Object.entries(query)
    .map(([key, val]) => new URLSearchParams({ [key]: val }).toString())
    .join(';')
}

export const getRequestUrl = (
  settings: ComponentSettings,
  payload: MCEvent['payload'],
  client: Client
) => {
  const { advertiserId } = settings
  const { timestamp, groupTag, activityTag, ...customFields } = payload
  const baseURL = 'https://ad.doubleclick.net/activity;'

  if (client.get('_gcl_dc')) {
    customFields.gcldc = client.get('_gcl_dc')?.split('.').pop()
  }

  const query = {
    src: advertiserId,
    type: groupTag,
    cat: activityTag,
    ord: Math.floor(Math.random() * (1e13 - 1e11 + 1) + 1e11),
    ...customFields,
  }

  const params = getUrlString(query)

  return baseURL + params + '?'
}

const sendEvent = (settings: ComponentSettings) => async (event: MCEvent) => {
  const { client, payload } = event
  // set the _gcl_aw cookie if _gl or gclid query params exists
  setGclDcCookie(client)
  client.fetch(getRequestUrl(settings, payload, client), {
    credentials: 'include',
    keepalive: true,
    mode: 'no-cors',
  })
}

export default async function (manager: Manager, settings: ComponentSettings) {
  manager.addEventListener('pageview', sendEvent(settings))
}
