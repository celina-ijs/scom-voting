import { Module, customModule, Container, Button } from '@ijstech/components';
import ScomVoting from '@scom/scom-voting';
import ScomWidgetTest from '@scom/scom-widget-test';

@customModule
export default class Module1 extends Module {
    private scomVoting: ScomVoting;
    private widgetModule: ScomWidgetTest;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    private async onShowConfig() {
        const editor = this.scomVoting.getConfigurators().find(v => v.target === 'Editor');
        const widgetData = await editor.getData();
        if (!this.widgetModule) {
            this.widgetModule = await ScomWidgetTest.create({
                widgetName: 'scom-voting',
                onConfirm: (data: any, tag: any) => {
                    editor.setData(data);
                    editor.setTag(tag);
                    this.widgetModule.closeModal();
                }
            });
        }
        this.widgetModule.openModal({
            width: '90%',
            maxWidth: '90rem',
            minHeight: 400,
            padding: { top: 0, bottom: 0, left: 0, right: 0 },
            closeOnBackdropClick: true,
            closeIcon: null
        });
        this.widgetModule.show(widgetData);
    }

    async init() {
        super.init();
        const configs = this.scomVoting.getConfigurators() || [];
        const configurator = configs.find((conf: any) => conf.target === 'Editor');
        configurator.setData({
            title: 'Do you schedule casts?',
            buttons: [
                {
                    value: 'yes',
                    label: 'Yes'
                },
                {
                    value: 'no',
                    label: 'No'
                },
                {
                    value: 'sometimes',
                    label: 'Sometimes'
                }
            ]
        })
    }

    onButtonClicked(target: Button, value: string) {
        console.log("selected value: ", value);
    }

    render() {
        return (
            <i-panel
                width="100%"
            >
                <i-vstack
                    verticalAlignment="center"
                    margin={{ top: '1rem', left: 'auto', right: 'auto' }}
                    padding={{ left: '1rem', right: '1rem' }}
                    gap="1rem"
                    width={600}
                    maxWidth="100%"
                >
                    <i-button caption="Config" onClick={this.onShowConfig} width={160} padding={{ top: 5, bottom: 5 }} margin={{ left: 'auto', right: 20 }} font={{ color: '#fff' }} />
                    <i-scom-voting
                        id="scomVoting"
                        onButtonClicked={this.onButtonClicked}
                    />
                </i-vstack>
            </i-panel>
        )
    }
}