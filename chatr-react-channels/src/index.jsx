import React from 'react';
import {render} from 'react-dom';
import d3 from 'd3';
import {Observable} from 'rx';
import ReactBubbleChart from 'react-bubble-chart';
import axios from 'axios';

const URL = 'https://chatr.tv/api/channels?country__short=SK';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { channels: [] };
  }

  componentWillMount() {
    Rx.Observable
      .interval(2000)
      .flatMap(() => Rx.Observable.fromPromise(axios.get(URL)))
      .filter(response => response.status === 200)
      .map(result => result.data.channels)
      .subscribe(data => this.setState({ channels: data }));
  }

  render() {
    let data = this.state.channels
      .filter(channel => channel.id === 1 || channel.id === 2)
      .filter(channel => channel.act_clients !== 0)
      .map(ch => ({ _id: ch.name.toLowerCase(), value: ch.act_clients, displayText: ch.act_clients, colorValue: ch.color }));

    return (
      <ReactBubbleChart
        className="bubble"
        data={data}
        fontSizeFactor={1}
      />
    )
  }
}

render(<App/>, document.querySelector('#app'));
