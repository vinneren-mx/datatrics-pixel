interface Event extends Event {
  data: any;
  target: any;
}

interface Window extends Window {
  __SETTINGS__: {
    projectID: string;
  };
  _count: any;
  _paq: any[];
  identificator: string;
  dt_dynamic_content: boolean;
  DatatricsReload(): any[];
}
