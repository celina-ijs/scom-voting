import { Module, customModule, Container, Button } from '@ijstech/components';
import ScomVoting from '@scom/scom-voting';

@customModule
export default class Module1 extends Module {
    private scomVoting: ScomVoting;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
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
                width="580px"
                padding={{ top: '1.25rem', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}
            >
                <i-scom-voting id="scomVoting" onButtonClicked={this.onButtonClicked}></i-scom-voting>
            </i-panel>
        )
    }
}