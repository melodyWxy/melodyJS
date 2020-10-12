//  事件系统处理
export const isEvent = key => key.startsWith("on");
// 真·属性处理
export const isProperty = key => key !== "children" && !isEvent(key);
// 新增
export const isNew = (prev, next) => key => prev[key] !== next[key];
// 丢失
export const isGone = (prev, next) => key => {
  console.log(prev,'prev')
  return !(key in next);
}

// 更新 DOM 节点属性
export default function updateDom(dom, prevProps = {}, nextProps = {}) {
  // 以 “on” 开头的属性作为事件要特别处理
  // 移除旧的或者变化了的的事件处理函数
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 移除旧的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = "";
    });

  // 添加或者更新属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      // 规定 style 内联样式是驼峰命名的对象，
      // 根据规范给 style 每个属性单独赋值
      if (name === "style") {
        Object.entries(nextProps[name]).forEach(([key, value]) => {
          dom.style[key] = value;
        });
      } else {
        dom[name] = nextProps[name];
      }
    });

  // 添加新的事件处理函数
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}