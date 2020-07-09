interface Event extends Event {
  data: any
  target: any
}

interface Window extends Window {
  __SETTINGS__: {
    projectID: string
    identificator: string
  }
  _paq: any[]
}
