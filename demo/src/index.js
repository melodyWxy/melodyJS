import Melody from '../../src/index';
import MelodyDOM from '../../src/packages/MelodyDOM';

const root = document.querySelector('#root');

const isf = 1

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
   {isf && <h2>555 </h2>}
</App>), root);
