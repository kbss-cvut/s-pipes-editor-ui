import React from "react";
import PropTypes from "prop-types";

const Header = ({ onSelect, style, customStyles, node }) => {
  const iconType = node.children ? "folder" : "file-text";
  const iconClass = `fa fa-${iconType}`;
  const iconStyle = { marginRight: "5px" };

  return (
    <div style={style.base} onClick={onSelect}>
      <div
        data-id={node.id}
        data-children={node.children ? "folder" : "file-text"}
        style={node.selected ? { ...style.title, ...customStyles.header.title } : style.title}
      >
        <i className={iconClass} style={iconStyle} />
        {node.name}
      </div>
    </div>
  );
};

Header.propTypes = {
  onSelect: PropTypes.func,
  node: PropTypes.object,
  style: PropTypes.object,
  customStyles: PropTypes.object,
};

Header.defaultProps = {
  customStyles: {},
};

export default Header;
