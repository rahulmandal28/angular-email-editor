import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { loadScript } from './loadScript';
import pkg from './source.json';

declare module unlayer {
  function init(object: any): any;
  function createEditor(object: any): any;
  function loadDesign(object: any): any;
  function saveDesign(Function: any): any;
  function exportHtml(Function: any): any;
}

export interface UnlayerOptions {
  projectId?: number;
  tools?: object;
  appearance?: object;
  locale?: string;
}

let lastEditorId = 0;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'email-editor',
  templateUrl: './email-editor.component.html',
  styleUrls: ['./email-editor.component.css'],
})
export class EmailEditorComponent implements OnInit, AfterViewInit {
  @Input() editorId: string | undefined;
  @Input() options: UnlayerOptions = {};
  @Input() projectId: number | undefined;
  @Input() tools: object | undefined;
  @Input() appearance: object | undefined;
  @Input() locale: string | undefined;
  @Input() id: string;

  @Input() minHeight = '500px';

  @Output() loaded = new EventEmitter();
  @Output() ready = new EventEmitter();

  editor: any;

  constructor() {
    this.id = this.editorId || `editor-${++lastEditorId}`;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    loadScript(this.loadEditor.bind(this));
  }

  protected loadEditor() {
    const options: UnlayerOptions = this.options || {};

    if (this.projectId) {
      options.projectId = this.projectId;
    }

    if (this.tools) {
      options.tools = this.tools;
    }

    if (this.appearance) {
      options.appearance = this.appearance;
    }

    if (this.locale) {
      options.locale = this.locale;
    }

    this.editor = unlayer.createEditor({
      ...options,
      id: this.id,
      displayMode: 'email',
      source: {
        name: pkg.name,
        version: pkg.version,
      },
    });

    this.loaded.emit({});

    this.editor.addEventListener('editor:ready', () => {
      this.ready.emit({});
    });
  }

  public loadDesign(data: object) {
    this.editor.loadDesign(data);
  }

  public saveDesign(cb: (data: object) => void) {
    this.editor.saveDesign(cb);
  }

  public exportHtml(cb: (data: object) => void) {
    this.editor.exportHtml(cb);
  }
}
