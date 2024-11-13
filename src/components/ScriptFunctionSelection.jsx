import React from "react";
import { Dropdown } from "semantic-ui-react";
import { FUNCTION_URI, FUNCTION_NAME } from "../constants/vocabulary.js";
import Rest from "../rest/Rest.jsx";

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
          key: r[FUNCTION_URI],
          text: r[FUNCTION_NAME],
          value: r[FUNCTION_URI],
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
