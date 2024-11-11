import React from "react";
import { Dropdown } from "semantic-ui-react";
import { FUNCTION, FUNCTION_NAME, Rest } from "./rest/Rest";

class ScriptFunctionSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleOptions: [],
    };
  }

  componentDidMount() {
    Rest.getModulesFunctions(this.props.scriptPath).then((res) => {
      const options = res.map((r) => {
        return {
          key: r[FUNCTION],
          text: r[FUNCTION_NAME],
          value: r[FUNCTION],
          image: { avatar: true, src: "/icons/fire-extinguisher.png" },
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
        text="Call function"
        fluid
        search
        selection
        multiple
        value={[null]}
        options={this.state.moduleOptions}
        onChange={(e, { value }) => {
          console.log("value: " + value);
          this.props.onChange(value);
        }}
      />
    );
  }
}

export default ScriptFunctionSelection;
