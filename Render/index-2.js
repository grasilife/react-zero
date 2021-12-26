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
function render(element, parentDom) {
  const { type, props } = element;
  const dom = document.createElement(type);
  const childElements = props.children || [];
  childElements.forEach((childElement) => render(childElement, dom));
  parentDom.appendChild(dom);
}
render(element, document.getElementById("root"));
