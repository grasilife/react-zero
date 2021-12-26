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
//添加type为patch标记,未来减少diff性能,我们将上面的结构更改下面的虚拟dom结构,将文本添加到nodeValue属性中,并增加type属性
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

  // Create DOM element
  const isTextElement = type === "TEXT ELEMENT";
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(type);
  console.log(dom, props, "dom");
  // 添加事件
  const isListener = (name) => name.startsWith("on");
  Object.keys(props)
    .filter(isListener)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, props[name]);
    });

  // 添加props
  const isAttribute = (name) => !isListener(name) && name != "children";
  Object.keys(props)
    .filter(isAttribute)
    .forEach((name) => {
      dom[name] = props[name];
    });

  // render children
  const childElements = props.children || [];
  childElements.forEach((childElement) => render(childElement, dom));

  // Append to parent
  parentDom.appendChild(dom);
}
render(textElement, document.getElementById("root"));
