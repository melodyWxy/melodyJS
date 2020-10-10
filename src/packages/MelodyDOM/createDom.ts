import updateDom from './updateDom';

// 基于fiber节点结构创建dom
export default function createDom(fiber) {
    const dom =
      fiber.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type);
  
    updateDom(dom, {}, fiber.props);
  
    return dom;
}