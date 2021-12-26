// 如果nextChildElements长于childInstances，reconcileChildren将为所有额外的子元素调用reconcile一个undefined实例。这应该不是问题，因为它if (instance == null)会处理它并创建新实例。
// 但是反过来呢？WhenchildInstances长于nextChildElements它会将undefined元素传递给reconcile并在尝试获取时抛出错误element.type。
// 那是因为我们没有考虑需要从 DOM 中删除元素的情况。因此，我们需要做两件事情，检查element == null在reconcile功能和过滤childInstances的reconcileChildren功能：
let rootInstance = null;

function render(element, container) {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(container, prevInstance, element);
  rootInstance = nextInstance;
}
function reconcile(parentDom, instance, element) {
  if (instance == null) {
    // Create instance
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (element == null) {
    // Remove instance
    parentDom.removeChild(instance.dom);
    return null;
  } else if (instance.element.type === element.type) {
    // Update instance
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else {
    // Replace instance
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  }
}

function reconcileChildren(instance, element) {
  const dom = instance.dom;
  const childInstances = instance.childInstances;
  const nextChildElements = element.props.children || [];
  const newChildInstances = [];
  const count = Math.max(childInstances.length, nextChildElements.length);
  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];
    const newChildInstance = reconcile(dom, childInstance, childElement);
    newChildInstances.push(newChildInstance);
  }
  return newChildInstances.filter((instance) => instance != null);
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
