//children为数组的节点
const element = {
  type: "div",
  props: {
    id: "container",
    children: [
      { type: "input", props: { value: "foo", type: "text" } },
      { type: "a", props: { href: "/bar" } },
      { type: "span", props: {} },
    ],
  },
};
//children为文本的节点
const reactElement = {
  type: "span",
  props: {
    children: ["Foo"],
  },
};
//添加type为patch标记,未来减少diff性能
const textElement = {
  type: "span",
  props: {
    children: [
      {
        type: "TEXT ELEMENT",
        props: { nodeValue: "Foo" },
      },
    ],
  },
};
function render(element, parentDom) {
  const { type, props } = element;
  const dom = document.createElement(type);
  //event,处理以on开头的事件
  const isListener = (name) => name.startsWith("on");
  Object.keys(props)
    .filter(isListener)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, props[name]);
    });
  //props
  const isAttribute = (name) => !isListener(name) && name != "children";
  Object.keys(props)
    .filter(isAttribute)
    .forEach((name) => {
      console.log(name, "name");
      dom[name] = props[name];
    });
  //children
  const childElements = props.children || [];
  childElements.forEach((childElement) => render(childElement, dom));
  parentDom.appendChild(dom);
}
render(element, document.getElementById("root"));
