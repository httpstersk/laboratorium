import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  html {
    border: 0;
    box-sizing: border-box;
    color: hsl(0, 0%, 17%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 110%;
    margin: 0;
    line-height: 1.4;
    overscroll-behavior-y: none;
    padding: 0;
    vertical-align: baseline;
  }

  body {
    margin: 0;
    line-height: 1.4;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  p {
    line-height: 1.4;
  }

  button {
    appearance: none;
    background-color: #f3f3f3;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    padding: 0.5rem 1.25rem;
  }
`;
