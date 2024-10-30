import React from "react";
import { Dropdown } from "semantic-ui-react";
import { Rest } from "../api/Rest.jsx";
import * as Vocabulary from "../vocabularies/Vocabulary.js";

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
          key: r[Vocabulary.FUNCTION],
          text: r[Vocabulary.FUNCTION_NAME],
          value: r[Vocabulary.FUNCTION],
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
