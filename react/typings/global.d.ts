interface Event extends Event {
  data: any
}

interface Window extends Window {
  __SETTINGS__: {
    projectID: string
  }
}
