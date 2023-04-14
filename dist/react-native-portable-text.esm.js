import React, { createContext, useMemo, useContext, useCallback } from "react";
import { StyleSheet, Text, Linking, View } from "react-native";
function e(e2, t2) {
  var n2 = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var r2 = Object.getOwnPropertySymbols(e2);
    t2 && (r2 = r2.filter(function(t3) {
      return Object.getOwnPropertyDescriptor(e2, t3).enumerable;
    })), n2.push.apply(n2, r2);
  }
  return n2;
}
function t(t2) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var i2 = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? e(Object(i2), true).forEach(function(e2) {
      n(t2, e2, i2[e2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t2, Object.getOwnPropertyDescriptors(i2)) : e(Object(i2)).forEach(function(e2) {
      Object.defineProperty(t2, e2, Object.getOwnPropertyDescriptor(i2, e2));
    });
  }
  return t2;
}
function n(e2, t2, n2) {
  return t2 in e2 ? Object.defineProperty(e2, t2, { value: n2, enumerable: true, configurable: true, writable: true }) : e2[t2] = n2, e2;
}
function r(e2) {
  return "span" === e2._type && "text" in e2 && "string" == typeof e2.text && (void 0 === e2.marks || Array.isArray(e2.marks) && e2.marks.every((e3) => "string" == typeof e3));
}
function i(e2) {
  return "string" == typeof e2._type && "@" !== e2._type[0] && (!("markDefs" in e2) || Array.isArray(e2.markDefs) && e2.markDefs.every((e3) => "string" == typeof e3._key)) && "children" in e2 && Array.isArray(e2.children) && e2.children.every((e3) => "object" == typeof e3 && "_type" in e3);
}
function l(e2) {
  return i(e2) && "listItem" in e2 && "string" == typeof e2.listItem && (void 0 === e2.level || "number" == typeof e2.level);
}
function c(e2) {
  return "@list" === e2._type;
}
function o(e2) {
  return "@span" === e2._type;
}
function s(e2) {
  return "@text" === e2._type;
}
const f = ["strong", "em", "code", "underline", "strike-through"];
function u(e2, t2, n2) {
  if (!r(e2) || !e2.marks)
    return [];
  if (!e2.marks.length)
    return [];
  const i2 = e2.marks.slice(), l2 = {};
  return i2.forEach((e3) => {
    l2[e3] = 1;
    for (let i3 = t2 + 1; i3 < n2.length; i3++) {
      const t3 = n2[i3];
      if (!(t3 && r(t3) && Array.isArray(t3.marks) && -1 !== t3.marks.indexOf(e3)))
        break;
      l2[e3]++;
    }
  }), i2.sort((e3, t3) => function(e4, t4, n3) {
    const r2 = e4[t4], i3 = e4[n3];
    if (r2 !== i3)
      return i3 - r2;
    const l3 = f.indexOf(t4), c2 = f.indexOf(n3);
    if (l3 !== c2)
      return l3 - c2;
    return t4.localeCompare(n3);
  }(l2, e3, t3));
}
function h(e2) {
  var t2;
  const { children: n2, markDefs: i2 = [] } = e2;
  if (!n2 || !n2.length)
    return [];
  const l2 = n2.map(u), c2 = { _type: "@span", children: [], markType: "<unknown>" };
  let o2 = [c2];
  for (let e3 = 0; e3 < n2.length; e3++) {
    const c3 = n2[e3];
    if (!c3)
      continue;
    const s2 = l2[e3] || [];
    let f2 = 1;
    if (o2.length > 1)
      for (; f2 < o2.length; f2++) {
        const e4 = (null == (t2 = o2[f2]) ? void 0 : t2.markKey) || "", n3 = s2.indexOf(e4);
        if (-1 === n3)
          break;
        s2.splice(n3, 1);
      }
    o2 = o2.slice(0, f2);
    let u2 = o2[o2.length - 1];
    if (u2) {
      for (const e4 of s2) {
        const t3 = i2.find((t4) => t4._key === e4), n3 = t3 ? t3._type : e4, r2 = { _type: "@span", _key: c3._key, children: [], markDef: t3, markType: n3, markKey: e4 };
        u2.children.push(r2), o2.push(r2), u2 = r2;
      }
      if (r(c3)) {
        const e4 = c3.text.split("\n");
        for (let t3 = e4.length; t3-- > 1; )
          e4.splice(t3, 0, "\n");
        u2.children = u2.children.concat(e4.map((e5) => ({ _type: "@text", text: e5 })));
      } else
        u2.children = u2.children.concat(c3);
    }
  }
  return c2.children;
}
function a(e2, n2) {
  const r2 = [];
  let i2;
  for (let c2 = 0; c2 < e2.length; c2++) {
    const o2 = e2[c2];
    if (o2)
      if (l(o2))
        if (i2)
          if (p(o2, i2))
            i2.children.push(o2);
          else if ((o2.level || 1) > i2.level) {
            const e3 = y(o2, c2, n2);
            if ("html" === n2) {
              const n3 = i2.children[i2.children.length - 1], r3 = t(t({}, n3), {}, { children: [...n3.children, e3] });
              i2.children[i2.children.length - 1] = r3;
            } else
              i2.children.push(e3);
            i2 = e3;
          } else if ((o2.level || 1) < i2.level) {
            const e3 = r2[r2.length - 1], t2 = e3 && d(e3, o2);
            if (t2) {
              i2 = t2, i2.children.push(o2);
              continue;
            }
            i2 = y(o2, c2, n2), r2.push(i2);
          } else if (o2.listItem === i2.listItem)
            console.warn("Unknown state encountered for block", o2), r2.push(o2);
          else {
            const e3 = r2[r2.length - 1], t2 = e3 && d(e3, { level: o2.level || 1 });
            if (t2 && t2.listItem === o2.listItem) {
              i2 = t2, i2.children.push(o2);
              continue;
            }
            i2 = y(o2, c2, n2), r2.push(i2);
          }
        else
          i2 = y(o2, c2, n2), r2.push(i2);
      else
        r2.push(o2), i2 = void 0;
  }
  return r2;
}
function p(e2, t2) {
  return (e2.level || 1) === t2.level && e2.listItem === t2.listItem;
}
function y(e2, t2, n2) {
  return { _type: "@list", _key: "".concat(e2._key || "".concat(t2), "-parent"), mode: n2, level: e2.level || 1, listItem: e2.listItem, children: [e2] };
}
function d(e2, t2) {
  const n2 = t2.level || 1, i2 = t2.listItem || "normal", l2 = "string" == typeof t2.listItem;
  if (c(e2) && (e2.level || 1) === n2 && l2 && (e2.listItem || "normal") === i2)
    return e2;
  if (!("children" in e2))
    return;
  const o2 = e2.children[e2.children.length - 1];
  return o2 && !r(o2) ? d(o2, t2) : void 0;
}
const m = /^\s/, g = /^\s/;
function k(e2) {
  const t2 = Array.isArray(e2) ? e2 : [e2];
  let n2 = "";
  return t2.forEach((e3, l2) => {
    if (!i(e3))
      return;
    let c2 = false;
    e3.children.forEach((e4) => {
      r(e4) ? (n2 += c2 && n2 && !g.test(n2) && !m.test(e4.text) ? " " : "", n2 += e4.text, c2 = false) : c2 = true;
    }), l2 !== t2.length - 1 && (n2 += "\n\n");
  }), n2;
}
function v(e2) {
  let t2 = "";
  return e2.children.forEach((e3) => {
    s(e3) ? t2 += e3.text : o(e3) && (t2 += v(e3));
  }), t2;
}
const b = "html";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a2, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    }
  return a2;
};
var __spreadProps = (a2, b2) => __defProps(a2, __getOwnPropDescs(b2));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function mergeComponents(parent, overrides) {
  const _a = overrides, rest = __objRest(_a, ["block", "list", "listItem", "marks", "types"]);
  return __spreadValues(__spreadProps(__spreadValues({}, parent), {
    block: mergeDeeply(parent, overrides, "block"),
    list: mergeDeeply(parent, overrides, "list"),
    listItem: mergeDeeply(parent, overrides, "listItem"),
    marks: mergeDeeply(parent, overrides, "marks"),
    types: mergeDeeply(parent, overrides, "types")
  }), rest);
}
function mergeDeeply(parent, overrides, key) {
  const override = overrides[key];
  const parentVal = parent[key];
  if (typeof override === "function") {
    return override;
  }
  if (override && typeof parentVal === "function") {
    return override;
  }
  if (override) {
    return __spreadValues(__spreadValues({}, parentVal), override);
  }
  return parentVal;
}
const link$1 = ({ children, value }) => /* @__PURE__ */ React.createElement("a", {
  href: value == null ? void 0 : value.href
}, children);
const underlineStyle = { textDecoration: "underline" };
const defaultMarks$1 = {
  em: ({ children }) => /* @__PURE__ */ React.createElement("em", null, children),
  strong: ({ children }) => /* @__PURE__ */ React.createElement("strong", null, children),
  code: ({ children }) => /* @__PURE__ */ React.createElement("code", null, children),
  underline: ({ children }) => /* @__PURE__ */ React.createElement("span", {
    style: underlineStyle
  }, children),
  "strike-through": ({ children }) => /* @__PURE__ */ React.createElement("del", null, children),
  link: link$1
};
const defaultLists = {
  number: ({ children }) => /* @__PURE__ */ React.createElement("ol", null, children),
  bullet: ({ children }) => /* @__PURE__ */ React.createElement("ul", null, children)
};
const DefaultListItem$1 = ({ children }) => /* @__PURE__ */ React.createElement("li", null, children);
const getTemplate = (type, prop) => `Unknown ${type}, specify a component for it in the \`components.${prop}\` prop`;
const unknownTypeWarning = (typeName) => getTemplate(`block type "${typeName}"`, "types");
const unknownMarkWarning = (markType) => getTemplate(`mark type "${markType}"`, "marks");
const unknownBlockStyleWarning = (blockStyle) => getTemplate(`block style "${blockStyle}"`, "block");
const unknownListStyleWarning = (listStyle) => getTemplate(`list style "${listStyle}"`, "list");
const unknownListItemStyleWarning = (listStyle) => getTemplate(`list item style "${listStyle}"`, "listItem");
function printWarning(message) {
  console.warn(message);
}
const hidden = { display: "none" };
const DefaultUnknownType$1 = ({
  value,
  isInline
}) => {
  const warning = unknownTypeWarning(value._type);
  return isInline ? /* @__PURE__ */ React.createElement("span", {
    style: hidden
  }, warning) : /* @__PURE__ */ React.createElement("div", {
    style: hidden
  }, warning);
};
const DefaultUnknownMark$1 = ({
  markType,
  children
}) => {
  return /* @__PURE__ */ React.createElement("span", {
    className: `unknown__pt__mark__${markType}`
  }, children);
};
const DefaultUnknownBlockStyle$1 = ({
  children
}) => {
  return /* @__PURE__ */ React.createElement("p", null, children);
};
const DefaultUnknownList$1 = ({ children }) => {
  return /* @__PURE__ */ React.createElement("ul", null, children);
};
const DefaultUnknownListItem$1 = ({
  children
}) => {
  return /* @__PURE__ */ React.createElement("li", null, children);
};
const DefaultHardBreak$1 = () => /* @__PURE__ */ React.createElement("br", null);
const defaultBlockStyles$1 = {
  normal: ({ children }) => /* @__PURE__ */ React.createElement("p", null, children),
  blockquote: ({ children }) => /* @__PURE__ */ React.createElement("blockquote", null, children),
  h1: ({ children }) => /* @__PURE__ */ React.createElement("h1", null, children),
  h2: ({ children }) => /* @__PURE__ */ React.createElement("h2", null, children),
  h3: ({ children }) => /* @__PURE__ */ React.createElement("h3", null, children),
  h4: ({ children }) => /* @__PURE__ */ React.createElement("h4", null, children),
  h5: ({ children }) => /* @__PURE__ */ React.createElement("h5", null, children),
  h6: ({ children }) => /* @__PURE__ */ React.createElement("h6", null, children)
};
const defaultComponents$1 = {
  types: {},
  block: defaultBlockStyles$1,
  marks: defaultMarks$1,
  list: defaultLists,
  listItem: DefaultListItem$1,
  hardBreak: DefaultHardBreak$1,
  unknownType: DefaultUnknownType$1,
  unknownMark: DefaultUnknownMark$1,
  unknownList: DefaultUnknownList$1,
  unknownListItem: DefaultUnknownListItem$1,
  unknownBlockStyle: DefaultUnknownBlockStyle$1
};
const PortableTextComponentsContext = createContext(defaultComponents$1);
const PortableTextComponentsProvider = ({
  components,
  children
}) => {
  const value = useMemo(() => mergeComponents(defaultComponents$1, components), [components]);
  return /* @__PURE__ */ React.createElement(PortableTextComponentsContext.Provider, {
    value
  }, children);
};
function PortableText$1({
  value: input,
  components: componentOverrides,
  listNestingMode,
  onMissingComponent: missingComponentHandler = printWarning
}) {
  const handleMissingComponent = missingComponentHandler || noop;
  const blocks = Array.isArray(input) ? input : [input];
  const nested = a(blocks, listNestingMode || b);
  const parentComponents = useContext(PortableTextComponentsContext);
  const components = useMemo(() => {
    return componentOverrides ? mergeComponents(parentComponents, componentOverrides) : parentComponents;
  }, [parentComponents, componentOverrides]);
  const renderNode = useMemo(() => getNodeRenderer(components, handleMissingComponent), [components, handleMissingComponent]);
  const rendered = nested.map((node, index) => renderNode({ node, index, isInline: false, renderNode }));
  return componentOverrides ? /* @__PURE__ */ React.createElement(PortableTextComponentsContext.Provider, {
    value: components
  }, rendered) : /* @__PURE__ */ React.createElement(React.Fragment, null, rendered);
}
const getNodeRenderer = (components, handleMissingComponent) => {
  function renderNode(options) {
    const { node, index, isInline } = options;
    const key = node._key || `node-${index}`;
    if (c(node)) {
      return renderList(node, index, key);
    }
    if (l(node)) {
      return renderListItem(node, index, key);
    }
    if (o(node)) {
      return renderSpan(node, index, key);
    }
    if (i(node)) {
      return renderBlock(node, index, key, isInline);
    }
    if (s(node)) {
      return renderText(node, key);
    }
    return renderCustomBlock(node, index, key, isInline);
  }
  function renderListItem(node, index, key) {
    const tree = serializeBlock({ node, index, isInline: false, renderNode });
    const renderer = components.listItem;
    const handler = typeof renderer === "function" ? renderer : renderer[node.listItem];
    const Li = handler || components.unknownListItem;
    if (Li === components.unknownListItem) {
      const style = node.listItem || "bullet";
      handleMissingComponent(unknownListItemStyleWarning(style), {
        type: style,
        nodeType: "listItemStyle"
      });
    }
    let children = tree.children;
    if (node.style && node.style !== "normal") {
      const _a = node, blockNode = __objRest(_a, ["listItem"]);
      children = renderNode({ node: blockNode, index, isInline: false, renderNode });
    }
    return /* @__PURE__ */ React.createElement(Li, {
      key,
      value: node,
      index,
      isInline: false,
      renderNode
    }, children);
  }
  function renderList(node, index, key) {
    const children = node.children.map((child, childIndex) => renderNode({
      node: child._key ? child : __spreadProps(__spreadValues({}, child), { _key: `li-${index}-${childIndex}` }),
      index,
      isInline: false,
      renderNode
    }));
    const component = components.list;
    const handler = typeof component === "function" ? component : component[node.listItem];
    const List = handler || components.unknownList;
    if (List === components.unknownList) {
      const style = node.listItem || "bullet";
      handleMissingComponent(unknownListStyleWarning(style), { nodeType: "listStyle", type: style });
    }
    return /* @__PURE__ */ React.createElement(List, {
      key,
      value: node,
      index,
      isInline: false,
      renderNode
    }, children);
  }
  function renderSpan(node, _index, key) {
    const { markDef, markType, markKey } = node;
    const Span = components.marks[markType] || components.unknownMark;
    const children = node.children.map((child, childIndex) => renderNode({ node: child, index: childIndex, isInline: true, renderNode }));
    if (Span === components.unknownMark) {
      handleMissingComponent(unknownMarkWarning(markType), { nodeType: "mark", type: markType });
    }
    return /* @__PURE__ */ React.createElement(Span, {
      key,
      text: v(node),
      value: markDef,
      markType,
      markKey,
      renderNode
    }, children);
  }
  function renderBlock(node, index, key, isInline) {
    const _a = serializeBlock({ node, index, isInline, renderNode }), props = __objRest(_a, ["_key"]);
    const style = props.node.style || "normal";
    const handler = typeof components.block === "function" ? components.block : components.block[style];
    const Block = handler || components.unknownBlockStyle;
    if (Block === components.unknownBlockStyle) {
      handleMissingComponent(unknownBlockStyleWarning(style), {
        nodeType: "blockStyle",
        type: style
      });
    }
    return /* @__PURE__ */ React.createElement(Block, __spreadProps(__spreadValues({
      key
    }, props), {
      value: props.node,
      renderNode
    }));
  }
  function renderText(node, key) {
    if (node.text === "\n") {
      const HardBreak = components.hardBreak;
      return HardBreak ? /* @__PURE__ */ React.createElement(HardBreak, {
        key
      }) : "\n";
    }
    return node.text;
  }
  function renderCustomBlock(node, index, key, isInline) {
    const Node = components.types[node._type];
    const nodeOptions = {
      value: node,
      isInline,
      index,
      renderNode
    };
    if (Node) {
      return /* @__PURE__ */ React.createElement(Node, __spreadValues({
        key
      }, nodeOptions));
    }
    handleMissingComponent(unknownTypeWarning(node._type), { nodeType: "block", type: node._type });
    const UnknownType = components.unknownType;
    return /* @__PURE__ */ React.createElement(UnknownType, __spreadValues({
      key
    }, nodeOptions));
  }
  return renderNode;
};
function serializeBlock(options) {
  const { node, index, isInline, renderNode } = options;
  const tree = h(node);
  const children = tree.map((child, i2) => renderNode({ node: child, isInline: true, index: i2, renderNode }));
  return {
    _key: node._key || `block-${index}`,
    children,
    index,
    isInline,
    node
  };
}
function noop() {
}
const blockStyles = StyleSheet.create({
  normal: { marginBottom: 16 },
  blockquote: {
    paddingHorizontal: 14,
    borderLeftWidth: 3.5,
    borderLeftColor: "#dfe2e5",
    marginBottom: 16
  },
  h1: { marginVertical: 22 },
  h2: { marginVertical: 20 },
  h3: { marginVertical: 18 },
  h4: { marginVertical: 18 },
  h5: { marginVertical: 18 },
  h6: { marginVertical: 18 }
});
const listStyles = StyleSheet.create({
  list: {
    marginVertical: 16
  },
  listDeep: {
    marginVertical: 0
  },
  listItem: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  bulletListIcon: {
    marginLeft: 10,
    marginRight: 10,
    fontWeight: "bold"
  },
  listItemWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start"
  }
});
const textStyles = StyleSheet.create({
  h1: {
    fontWeight: "bold",
    fontSize: 32
  },
  h2: {
    fontWeight: "bold",
    fontSize: 24
  },
  h3: {
    fontWeight: "bold",
    fontSize: 18
  },
  h4: {
    fontWeight: "bold",
    fontSize: 16
  },
  h5: {
    fontWeight: "bold",
    fontSize: 14
  },
  h6: {
    fontWeight: "bold",
    fontSize: 10
  },
  normal: {},
  blockquote: {}
});
const markStyles = StyleSheet.create({
  strong: {
    fontWeight: "bold"
  },
  em: {
    fontStyle: "italic"
  },
  link: {
    textDecorationLine: "underline"
  },
  underline: {
    textDecorationLine: "underline"
  },
  strikeThrough: {
    textDecorationLine: "line-through"
  },
  code: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    backgroundColor: "rgba(27, 31, 35, 0.05)",
    color: "#24292e"
  }
});
const utilityStyles = StyleSheet.create({
  hidden: {
    display: "none"
  }
});
const link = ({ children, value }) => {
  const href = value == null ? void 0 : value.href;
  const onPress = useCallback(() => href ? Linking.openURL(href) : void 0, [href]);
  return /* @__PURE__ */ React.createElement(Text, {
    onPress,
    style: markStyles.link
  }, children);
};
const defaultMarks = {
  em: ({ children }) => /* @__PURE__ */ React.createElement(Text, {
    style: markStyles.em
  }, children),
  strong: ({ children }) => /* @__PURE__ */ React.createElement(Text, {
    style: markStyles.strong
  }, children),
  code: ({ children }) => /* @__PURE__ */ React.createElement(Text, {
    style: markStyles.code
  }, children),
  underline: ({ children }) => /* @__PURE__ */ React.createElement(Text, {
    style: markStyles.underline
  }, children),
  "strike-through": ({ children }) => /* @__PURE__ */ React.createElement(Text, {
    style: markStyles.strikeThrough
  }, children),
  link
};
const DefaultBlock = ({ children, value }) => {
  const style = value.style || "normal";
  return /* @__PURE__ */ React.createElement(View, {
    style: blockStyles[style]
  }, /* @__PURE__ */ React.createElement(Text, {
    style: textStyles[style]
  }, children));
};
const defaultBlockStyles = {
  normal: DefaultBlock,
  blockquote: DefaultBlock,
  h1: DefaultBlock,
  h2: DefaultBlock,
  h3: DefaultBlock,
  h4: DefaultBlock,
  h5: DefaultBlock,
  h6: DefaultBlock
};
const DefaultList = ({ value, children }) => {
  const base = value.level > 1 ? listStyles.listDeep : listStyles.list;
  const padding = { paddingLeft: 16 * value.level };
  return /* @__PURE__ */ React.createElement(View, {
    style: [base, padding]
  }, children);
};
const defaultListItems = {
  bullet: ({ children }) => /* @__PURE__ */ React.createElement(View, {
    style: listStyles.listItemWrapper
  }, /* @__PURE__ */ React.createElement(Text, {
    style: listStyles.bulletListIcon
  }, "\xB7"), /* @__PURE__ */ React.createElement(Text, {
    style: listStyles.listItem
  }, children)),
  number: ({ children, index }) => /* @__PURE__ */ React.createElement(View, {
    style: listStyles.listItemWrapper
  }, /* @__PURE__ */ React.createElement(Text, {
    style: listStyles.bulletListIcon
  }, index + 1, ". "), /* @__PURE__ */ React.createElement(Text, {
    style: listStyles.listItem
  }, children))
};
const DefaultListItem = defaultListItems.bullet || View;
const DefaultUnknownType = ({ value }) => {
  const warning = `Unknown block type "${value._type}", specify a component for it in the \`components.types\` prop`;
  console.warn(warning);
  return /* @__PURE__ */ React.createElement(Text, {
    style: utilityStyles.hidden
  }, warning);
};
const DefaultUnknownMark = ({
  markType,
  children
}) => {
  console.warn(
    `Unknown mark type "${markType}", please specify a component for it in the \`components.marks\` prop`
  );
  return /* @__PURE__ */ React.createElement(Text, null, children);
};
const DefaultUnknownBlockStyle = ({
  value,
  ...props
}) => {
  const style = value.style || "normal";
  console.warn(
    `Unknown block style "${style}", please specify a component for it in the \`components.block\` prop`
  );
  return /* @__PURE__ */ React.createElement(DefaultBlock, {
    ...props,
    value: { ...value, style: "normal" }
  });
};
const DefaultUnknownList = ({
  children,
  value
}) => {
  console.warn(
    `Unknown list style "${value.listItem || "bullet"}", please specify a component for it in the \`components.list\` prop`
  );
  return /* @__PURE__ */ React.createElement(View, null, children);
};
const DefaultUnknownListItem = ({
  value,
  ...props
}) => {
  const style = value.listItem || "bullet";
  console.warn(
    `Unknown list item style "${style}", please specify a component for it in the \`components.list\` prop`
  );
  return /* @__PURE__ */ React.createElement(DefaultListItem, {
    ...props,
    value: { ...value, style: "bullet" }
  });
};
const DefaultHardBreak = () => /* @__PURE__ */ React.createElement(Text, null, "\n");
const defaultComponents = {
  types: {},
  block: defaultBlockStyles,
  marks: defaultMarks,
  list: DefaultList,
  listItem: defaultListItems,
  hardBreak: DefaultHardBreak,
  unknownType: DefaultUnknownType,
  unknownMark: DefaultUnknownMark,
  unknownList: DefaultUnknownList,
  unknownListItem: DefaultUnknownListItem,
  unknownBlockStyle: DefaultUnknownBlockStyle
};
function PortableText(props) {
  return /* @__PURE__ */ React.createElement(PortableTextComponentsProvider, {
    components: defaultComponents
  }, /* @__PURE__ */ React.createElement(PortableText$1, {
    ...props
  }));
}
export { PortableText, PortableTextComponentsProvider, defaultComponents, mergeComponents, k as toPlainText };
//# sourceMappingURL=react-native-portable-text.esm.js.map
