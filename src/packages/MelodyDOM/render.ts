import ric from 'request-idle-callback';
import reconcileChildren from './../updates/reconcileChildren';
import updateDom from './updateDom';
import createDom from './createDom';

// 基于fiber节点链表的渲染策略


function commitRoot() {
  // 1. 直接干掉不需要的节点们
  deletions.forEach(commitWork);
  // 2. 基于fiber单位递归渲染
  commitWork(wipRoot.child);
  // 3. 记录当前渲染的fiber树
  currentRoot = wipRoot;
  // 4. 干掉首次树,清理内存;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  // 渲染差异
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
  }
  // 递归渲染差异
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}


let nextUnitOfWork = null;
let currentRoot = null;
let wipRoot = null;
let deletions = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    // 并发模式1：当引擎遗留时间>1ms的时候，以协调渲染一个fiber节点为单位工作；
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  
  if (!nextUnitOfWork && wipRoot) {
    // 首次生成fiber树后一次渲染
    commitRoot();
  }
  // 并发模式2：当引擎遗留时间<1ms的时候,停止协调工作，优先事件回调和动画渲染；
  ric.requestIdleCallback(workLoop);
}

ric.requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children;
  // reconcileChildren-diff 
  reconcileChildren(fiber, elements, deletions);

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}


export default function render(element, container) {
  // 初始化根fiber树
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot
  };
  deletions = []; 
  // 记录这颗fiber树
  nextUnitOfWork = wipRoot;
}
