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
  // 当 fiber 是函数组件时节点不存在 DOM，
  // 所以需要遍历父节点以找到最近的有 DOM 的节点
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;
  // 渲染差异
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }
  // 递归渲染差异
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 移除 DOM 节点
function commitDeletion(fiber, domParent) {
  // 当 child 是函数组件时不存在 DOM，
  // 故需要递归遍历子节点找到真正的 DOM
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

// 处理函数组件
function updateFunctionComponent(fiber, deletions) {
  // 更新进行中的 fiber 节点
  wipFiber = fiber;
  // 重置 hook 索引
  hookIndex = 0;
  // hooks 数组类型以支持同一个组件多次调用 `useState`
  wipFiber.hooks = [];
  // 执行函数组件得到 children
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children, deletions);
}

// 处理原生标签
function updateHostComponent(fiber, deletions) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children, deletions);
}

// 下一个协调渲染单位
let nextUnitOfWork = null;
// 用来保存上一次渲染的fiber树  - last-render-fiber;
let currentRoot = null;
// fiber树，首次渲染时生成树赋值给此变量，首次渲染后赋值给currentRoot记录保存；
let wipRoot = null;
// 渲染进行中的fiber 节点
let wipFiber = null;
// 当前hook 的索引
let hookIndex = null;
// 要删除的节点列表
let deletions = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    // 并发模式1：当引擎遗留时间>1ms的时候，以协调渲染一个fiber节点为单位工作；
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork, deletions);
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

// 协调渲染一个fiber节点为单位工作
function performUnitOfWork(fiber, deletions) {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    // 函数组件处理
    updateFunctionComponent(fiber, deletions);
  } else {
    // 原生标签处理
    updateHostComponent(fiber, deletions);
  }
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

// useState

export function useState(initial) {
  // alternate 保存了上一次渲染的 fiber 节点
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const hook = {
    // 第一次渲染使用入参，第二次渲染复用前一次的状态
    state: oldHook ? oldHook.state : initial,
    // 保存每次 setState 入参的队列
    queue: []
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    // 根据调用 setState 顺序从前往后生成最新的 state
    hook.state = action instanceof Function ? action(hook.state) : action;
  });

  // setState 函数用于更新 state，入参 action
  // 是新的 state 值或函数返回新的 state
  const setState = action => {
    hook.queue.push(action);
    // 下面这部分代码和 render 函数很像，
    // 设置新的 wipRoot 和 nextUnitOfWork
    // 浏览器空闲时即开始重新渲染。
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  // 保存本次 hook
  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
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
