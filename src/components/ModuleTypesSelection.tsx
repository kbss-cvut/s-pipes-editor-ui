import React from "react";
import { Dropdown } from "semantic-ui-react";
import Rest from "@rest/Rest.js";
import { ICONS_MAP } from "@constants/dagreIcons.ts";

class ModuleTypesSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleOptions: [],
    };
  }

  componentDidMount() {
    Rest.getModulesTypes(this.props.scriptPath).then((res) => {
      const options = res.map((r) => {
        const icon = ICONS_MAP[r["@id"]] === undefined ? "beer.png" : ICONS_MAP[r["@id"]];
        return {
          key: r["@id"],
          text: r["http://www.w3.org/2000/01/rdf-schema#label"],
          value: r["@id"],
          image: { avatar: true, src: "/icons/" + icon },
        };
      });
      this.setState({
        moduleOptions: options,
      });
    });
  }

  render() {
    return (
      <Dropdown
        text="Add module"
        fluid
        search
        selection
        multiple
        value={[null]}
        options={this.state.moduleOptions}
        onChange={(e, { value }) => {
          this.props.onChange(value);
        }}
      />
    );
  }
}

export default ModuleTypesSelection;
