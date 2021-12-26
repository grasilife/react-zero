//更新 className，style，onClick而无需创建一个新的DOM节点等
let rootInstance = null;

function render(element, container) {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(container, prevInstance, element);
  rootInstance = nextInstance;
}
//我们向该reconcile函数添加一个验证，以检查先前呈现的元素是否与type我们当前尝试呈现的元素相同。如果type相同，我们将重用它（更新属性以匹配新属性）,这个reconcile函数缺少一个关键的步骤，它让children们保持原样
//它需要在元素 ( key) 中添加一个额外的属性来匹配上一tree和当前tree中的children
function reconcile(parentDom, instance, element) {
  if (instance == null) {
    // Create instance
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (instance.element.type === element.type) {
    // Update instance
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.element = element;
    return instance;
  } else {
    // Replace instance
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  }
}

function instantiate(element) {
  const { type, props } = element;

  // Create DOM element
  const isTextElement = type === "TEXT ELEMENT";
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(type);

  updateDomProperties(dom, [], props);

  // Instantiate and append children
  const childElements = props.children || [];
  const childInstances = childElements.map(instantiate);
  const childDoms = childInstances.map((childInstance) => childInstance.dom);
  childDoms.forEach((childDom) => dom.appendChild(childDom));

  const instance = { dom, element, childInstances };
  return instance;
}

function updateDomProperties(dom, prevProps, nextProps) {
  //updateDomProperties从 dom 节点中删除所有旧属性，然后添加所有新属性。如果属性改变了它也不会改变，所以它会做很多不必要的更新，但为了简单起见，我们暂时保持这样
  const isEvent = (name) => name.startsWith("on");
  const isAttribute = (name) => !isEvent(name) && name != "children";

  // Remove event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove attributes
  Object.keys(prevProps)
    .filter(isAttribute)
    .forEach((name) => {
      dom[name] = null;
    });

  // Set attributes
  Object.keys(nextProps)
    .filter(isAttribute)
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
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
