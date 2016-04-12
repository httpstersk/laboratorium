import React from 'react';
import {render} from 'react-dom';
import {Observable} from 'rx';
import axios from 'axios';

const API = 'https://chatr.tv/api/flashes/0';
const p = axios.get(API);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flash: {}
    };
  }

  componentWillMount() {
    Rx.Observable
      .interval(1000)
      .merge(Rx.Observable.of(0))
      .flatMap(() => Rx.Observable.fromPromise(axios.get(API)))
      .filter(response => response.status === 200)
      .map(result => result.data)
      .subscribe(res => this.setState({ flash: res.flash }));
  }

  render() {
    let flash = this.state.flash;

    return (
      <div className="⚡">
        <div className="🔥">
          <div className="💬">{flash.text}</div>
        </div>
        <div className="↕">
          <div className="👍" style={{height: flash.choice_a_percent + "vh"}}>
            <div>{flash.choice_a}</div>
            <div className="🎈">{flash.choice_a_percent}</div>
          </div>
          <div className="👎" style={{height: flash.choice_b_percent + "vh"}}>
            <div>{flash.choice_b}</div>
            <div className="🎈">{flash.choice_b_percent}</div>
          </div>
        </div>
      </div>
    )
  }
}

render(<App/>, document.querySelector('#app'));
