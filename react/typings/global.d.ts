interface Event extends Event {
  data: any
  target: any
}

interface Window extends Window {
  __SETTINGS__: {
    projectID: string
  }
  dataLayer: any[]
  _paq: any[]
  identificator: string
  DatatricsReload(): any[]
}
