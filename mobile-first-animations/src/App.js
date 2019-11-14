import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import styled from "styled-components";
import GlobalStyle from "./GlobalStyle";
import SwipeableTabs from "./SwipeableTabs";

const StyledNav = styled.nav`
  padding: 1.5rem;

  li {
    font-size: 2rem;
    display: block;
    margin-bottom: 1.5rem;
  }
`;

const routes = [
  {
    path: "/swipeable-tabs",
    component: SwipeableTabs,
    title: "Swipeable Tabs"
  }
];

function App() {
  return (
    <div>
      <Router>
        <GlobalStyle />
        <Switch>
          <Route
            path="/"
            exact
            render={() => {
              return (
                <StyledNav>
                  <ul>
                    {routes.map(r => {
                      return (
                        <li>
                          <Link to={r.path}>{r.title}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </StyledNav>
              );
            }}
          />
          {routes.map(r => {
            const Component = r.component;
            return (
              <Route path={r.path}>
                <Component />
              </Route>
            );
          })}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
