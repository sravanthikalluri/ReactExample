import React from 'react';
import HelloWorld from "./Example/Example.jsx";
import Home from "./home/home.jsx";
import AddModal from "./home/add-Modal.jsx";
import {BrowserRouter as Router, Link, Redirect, Route} from 'react-router-dom'
import EditorComponentsExample from "./Example/Example.jsx";
import {MyComponent} from "./home/add-Modal.jsx";

const  data = {
  data:"hello"
};


class App extends React.Component {
  constructor() {
    super();
      this.state = { items: []} ;
      this.data = {
          data:"new data"
      };
  }

    componentDidMount() {
        this.UserList();
    }

    UserList() {
        this.setState({items: {"name":"sravanthi"}});
        console.log(this.state.items[0]);
        return fetch(`http://localhost:8081/SpringMVCHibernate/persons`)
            .then((data)=> {
               return data.json()
            })
            .then((data) => {
                this.setState({items: {"name":"sravanthi"}});
                console.log(this.state.items[0]);
            });
    }
    render() {

    return (
        <div>
            <Router>
                <div>
                    <div className="header">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <Route exact path='/'  component={Home} />
                        <Route  path='/about'  component={AddModal} />
                        <Route  path='/contact'  component={EditorComponentsExample} />
                    </div>
                </div>
            </Router>
        </div>
    );
  }
}
export default App;

