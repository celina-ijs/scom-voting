import { Module} from '@ijstech/components';
import { IVoting } from './interface';
import formSchema from './formSchema';

export class Model {
  private module: Module;
  private data: IVoting = { title: '' };
  updateVoting: () => void;

  constructor(module: Module) {
    this.module = module;
  }

  getData() {
    return this.data;
  }

  async setData(value: IVoting) {
    this.data = value;
    this.updateVoting();
  }

  getTag() {
    return this.module.tag;
  }

  async setTag(value: any) {
    this.module.tag = value;
  }

  getConfigurators() {
    return [
      {
        name: 'Editor',
        target: 'Editor',
        getActions: () => {
          return this._getActions();
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private _getActions() {
    const actions = [
      {
        name: 'Edit',
        icon: 'edit',
        command: (builder: any, userInputData: any) => {
          let oldData: IVoting = { title: '' };
          return {
            execute: () => {
              oldData = JSON.parse(JSON.stringify(this.data));
              if (builder?.setData) builder.setData(userInputData);
            },
            undo: () => {
              this.data = JSON.parse(JSON.stringify(oldData));
              if (builder?.setData) builder.setData(this.data);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: formSchema.dataSchema,
        userInputUISchema: formSchema.uiSchema
      }
    ]
    return actions;
  }

}
