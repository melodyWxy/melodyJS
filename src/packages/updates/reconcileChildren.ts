
// diff-diff 协调
export default function reconcileChildren(wipFiber, elements, deletions) {
    let index = 0;
    // 上次渲染完成之后的 fiber 节点
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
    let prevSibling = null;
  
    // 扁平化 props.children，处理函数组件的 children
    elements = elements.flat();
  
    while (index < elements.length || oldFiber != null) {
      // 本次需要渲染的子元素
      const element = elements[index];
      let newFiber = null;
  
      // 比较当前和上一次渲染的 type，即 DOM tag 'div'，
      // 暂不考虑自定义组件
      const sameType = oldFiber && element && element.type === oldFiber.type;
  
      // 同类型节点，只需更新节点 props 即可
      if (sameType) {
        newFiber = {
          type: oldFiber.type,
          props: element.props,
          dom: oldFiber.dom, // 复用旧节点的 DOM
          parent: wipFiber,
          alternate: oldFiber,
          effectTag: "UPDATE" // 此属性在提交/commit 阶段使用
        };
      }
      // 不同类型节点且存在新的元素时，创建新的 DOM 节点
      if (element && !sameType) {
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          parent: wipFiber,
          alternate: null,
          effectTag: "PLACEMENT" // PLACEMENT 表示需要添加新的节点
        };
      }
      // 不同类型节点，且存在旧的 fiber 节点时，
      // 需要移除该节点
      if (oldFiber && !sameType) {
        oldFiber.effectTag = "DELETION";
        // 当最后提交 fiber 树到 DOM 时，我们是从 wipRoot 开始的，
        // 此时没有上一次的 fiber，所以这里用一个数组来跟踪需要
        // 删除的节点
        deletions && deletions.push(oldFiber);
      }
  
      if (oldFiber) {
        // 同步更新下一个旧 fiber 节点
        oldFiber = oldFiber.sibling;
      }
  
      if (index === 0) {
        wipFiber.child = newFiber;
      } else {
        prevSibling.sibling = newFiber;
      }
  
      prevSibling = newFiber;
      index++;
    }
  }
  