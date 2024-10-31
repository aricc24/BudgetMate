import React from 'react';
import axios from 'axios';

class App extends React.Component {
    state = {
        details: {},
    };

    componentDidMount() {
        axios.get('http://localhost:8000/wel/')
            .then(res => {
                console.log(res.data);
                this.setState({
                    details: res.data
                });
            })
            .catch(err => {
                console.error("Error while getting data:", err);
            });
    }

    render() {
      const { details } = this.state;
      return (
          <div>
              <h1>Email: {details.email}</h1>
              <p>Password: {details.password}</p>
          </div>
      );
    }
}
export default App;