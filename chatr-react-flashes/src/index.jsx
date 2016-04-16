import React from 'react';
import {render} from 'react-dom';
import {Observable} from 'rx';
import axios from 'axios';

const URL = 'https://chatr.tv/api/flashes/0';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { flash: {} };
  }

  componentWillMount() {
    Rx.Observable
      .interval(1000)
      .flatMap(() => Rx.Observable.fromPromise(axios.get(URL)))
      .filter(response => response.status === 200)
      .map(result => result.data.flash)
      .subscribe(data => this.setState({ flash: data }));
  }

  render() {
    let {text, choice_a, choice_b, choice_a_percent, choice_b_percent} = this.state.flash;

    if (text) {
      const stream = document.querySelector('#stream');
      stream.classList.add('🔘');
    }

    return (
      <div className='⚡'>
        <div className='🔥'>
          <div className='💬'>{text}</div>
        </div>
        <div className='↕'>
          <div className='👍' style={(choice_a_percent === 0 && choice_b_percent === 0) ? {height: '50vh'} : {height: choice_a_percent + 'vh'}}>
            <div>{choice_a}</div>
            <div className='🎈'>{choice_a_percent}</div>
          </div>
          <div className='👎' style={(choice_a_percent === 0 && choice_b_percent === 0) ? {height: '50vh'} : {height: choice_b_percent + 'vh'}}>
            <div>{choice_b}</div>
            <div className='🎈'>{choice_b_percent}</div>
          </div>
        </div>
      </div>
    )
  }
}

render(<App/>, document.querySelector('#app'));
