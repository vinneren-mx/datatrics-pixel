interface Event extends Event {
  data: any
  target: any
}

interface Window extends Window {
  __SETTINGS__: {
    projectID: string
  }
  _count: any
  _paq: any[]
  identificator: string
  DatatricsReload(): any[]
  dt_dynamic_content: boolean
}
