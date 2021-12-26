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
  console.log(props, "props");
  // render children
  const childElements = props.children || [];
  childElements.forEach((childElement) => render(childElement, dom));

  // Append to parent
  //   parentDom.appendChild(dom);
  //tick它不会为每个更新相同的 div，而是附加一个新的div 。解决此问题的第一种方法是为每次更新替换 div。在render函数的最后，我们检查父元素是否有任何子元素，如果有，我们用新元素生成的 dom 替换它,
  //但是这样处理性能太差了,太简单粗暴
  console.log(parentDom.lastChild, "parentDom.lastChild");
  if (!parentDom.lastChild) {
    parentDom.appendChild(dom);
  } else {
    parentDom.replaceChild(dom, parentDom.lastChild);
  }
}
//---------------------------------------------------------漂亮的分割线--------------------------
function tick() {
  const time = new Date().toLocaleTimeString();
  const clockElement = {
    type: "h1",
    props: {
      children: [
        {
          type: "TEXT ELEMENT",
          props: { nodeValue: time },
        },
      ],
    },
  };
  render(clockElement, document.getElementById("root"));
}

tick();
setInterval(tick, 1000);
