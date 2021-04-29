import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { Rest } from './rest/Rest'

class ModuleTypesSelection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            moduleOptions: []
        }
    }

    componentDidMount() {
        Rest.getModulesTypes(this.props.scriptPath).then((res) => {
            const options = res.map((r) => {
                return ({
                    key: r['@id'],
                    text: r['http://www.w3.org/2000/01/rdf-schema#label'],
                    value: r['@id'],
                    image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/elliot.jpg' }
                })
            })
            this.setState({
                moduleOptions: options
            })
        })
    }

    render() {
        return (
            <Dropdown
                placeholder='Select Friend'
                fluid
                search
                selection
                options={this.state.moduleOptions}
                onChange={(e, {value}) => {
                    this.props.onChange(value)
                }}
            />
        );
    }

}

export default ModuleTypesSelection
