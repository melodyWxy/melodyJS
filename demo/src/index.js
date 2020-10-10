import Melody from '../../src/index';
import MelodyDOM from '../../src/packages/MelodyDOM';

const root = document.querySelector('#root');

function App(props){
    return (
        <div>
            <div>{props.title}</div>
            {props.children}
        </div>
    )
}

MelodyDOM.render( 
(<App title='app-title---'>
   melodyJS
   <div mw-for='string'>234</div>
   <a id='roo1t'> 324554 </a>
   <div id='shshsh'>
       563937jbs
   </div>
</App>), root);
console.log(Melody, 1)
