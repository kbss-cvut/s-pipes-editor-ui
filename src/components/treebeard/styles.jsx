export default {
  component: {
    width: "100%",
    display: "inline-block",
    verticalAlign: "top",
    padding: "20px",
    backgroundColor: "white",
    color: "white",
  },
  treeStyle: {
    tree: {
      base: {
        listStyle: "none",
        backgroundColor: "white",
        margin: 0,
        padding: 0,
        color: "black",
        fontFamily: "lucida grande ,tahoma,verdana,arial,sans-serif",
        fontSize: "14px",
      },
      node: {
        base: {
          position: "relative",
        },
        link: {
          cursor: "pointer",
          position: "relative",
          padding: "0px 5px",
          display: "block",
        },
        activeLink: {
          background: "white",
        },
        toggle: {
          base: {
            position: "relative",
            display: "inline-block",
            verticalAlign: "top",
            marginLeft: "-5px",
            height: "24px",
            width: "24px",
          },
          wrapper: {
            position: "absolute",
            top: "50%",
            left: "50%",
            margin: "-7px 0 0 -7px",
            height: "14px",
          },
          height: 14,
          width: 14,
          arrow: {
            fill: "#9DA5AB",
            strokeWidth: 0,
          },
        },
        header: {
          base: {
            display: "inline-block",
            verticalAlign: "top",
            color: "black",
          },
          connector: {
            width: "2px",
            height: "12px",
            borderLeft: "solid 2px black",
            borderBottom: "solid 2px black",
            position: "absolute",
            top: "0px",
            left: "-21px",
          },
          title: {
            lineHeight: "28px",
            verticalAlign: "middle",
          },
        },
        subtree: {
          listStyle: "none",
          paddingLeft: "19px",
        },
        loading: {
          color: "#E2C089",
        },
      },
    },
  },
};
