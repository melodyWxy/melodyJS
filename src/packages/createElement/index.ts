
type elementProps = Record<string|number|symbol, any>;

type elementChildren =  (string | number | null | symbol | {
    type: string,
    props: elementProps,
    children: elementChildren
})[]  


export function createTextElement(text: string | number | symbol) {
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text,
        children: [],
      },
    }
  }


  export default function createElement( type:string| Function, props: elementProps = {}, ...children: elementChildren) {
    return {
      type,
      props: {
        ...props,
        children: children.map(child =>
          typeof child === "object"
            ? child
            : createTextElement(child)
        ),
      },
    }
  }