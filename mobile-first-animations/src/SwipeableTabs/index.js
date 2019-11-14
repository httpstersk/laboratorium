import React, { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import useWindowSize from "../hooks/useWindowSize";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import tabs from "./data";

const Line = styled.div(
  props => `
  heihgt: 1rem;
  margin-bottom: 0.5rem;
  width: ${props.width || "100%"}
`
);

const ContentContainer = styled.div`
  padding: 1rem;
  padding-top: 0;
`;

const StyledTabs = styled(Tabs)`
  oveflow-x: hidden;
  width: 100vw;
`;

const StyledActiveTabIndicator = styled.div`
  background-color: #ff2192;
  height: 0.3rem;
  left: 6.5%;
  position: relative;
  transition: translate 0.15s ease-in;
  width: 20%;
  will-change: transform;
`;

const StyledTabList = styled(TabList)`
  display: flex;
  margin-top: 1rem;
`;

const StyledTab = styled(Tab)`
  background-color: white;
  flex: 1;
  font-weight: bold;
`;

const StyledTabPanels = styled(TabPanels)`
  -webkit-overflow-scrolling: touch;
  display: flex;
  overflow-x: scroll;
  scroll-snap-stop: always;
  scroll-snap-type: x mandatory;
  width: 100vw;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledTabPanel = styled(TabPanel)`
  min-height: 10rem;
  min-width: 100vw;
  scroll-snap-align: start;
  scroll-snap-stop: always;

  &[hidden] {
    display: block !important;
  }

  &:focus {
    outline: none;
  }
`;

const StyledContent = styled.section`
  h2 {
    font-size: 2rem;
    margin-top: 2rem;
  }

  img {
    height: 15rem;
    object-fit: cover;
    width: 100%;
  }
`;

const SwipeableTabs = () => {
  const tabPanelsRef = useRef(null);
  const tabPanelsScrollWidth = useRef(null);
  const tabIndicatorRef = useRef(null);
  const [tabIndex, setTabIndex] = useState(0);
  const { width } = useWindowSize();

  useLayoutEffect(
    () => (tabPanelsScrollWidth.current = tabPanelsRef.scrollWidth),
    [width]
  );

  const getTab = x =>
    tabs
      .map((tab, i) => (i + 1 / tabs.length) * width)
      .findIndex(distance => Math.abs(x) === Math.abs(distance));

  const setScrollLeft = x => {
    tabPanelsRef.current.scrollLeft = x;
    onScrollChanged(x);
  };

  const onScrollChanged = scroll => {
    if (tabIndicatorRef.current) {
      const translateX =
        (scroll / (tabPanelsRef.current.clientWidth * tabs.length)) * width;
      tabIndicatorRef.current.style.transform = `translateX(${translateX}px)`;
    }

    const tabIndex = getTab(scroll);
    if (tabIndex === -1) return;
    setTabIndex(tabIndex);
  };

  return (
    <>
      <StyledTabs
        index={tabIndex}
        onChange={index => {
          const newPos = (index / tabs.length) * width;
          console.log({ newPos });
          setScrollLeft(newPos);
          tabPanelsRef.current.scrollLeft =
            index * tabPanelsScrollWidth.current;
        }}
      >
        <StyledTabList>
          {tabs.map(({ tab }) => (
            <StyledTab key={tab}>{tab}</StyledTab>
          ))}
        </StyledTabList>
        <StyledActiveTabIndicator ref={tabIndicatorRef} />
        <StyledTabPanels
          ref={tabPanelsRef}
          onScroll={event => onScrollChanged(event.target.scrollLeft)}
        >
          {tabs.map(({ img, title }) => {
            return (
              <StyledTabPanel key={title}>
                <StyledContent>
                  <img src={img} alt="landscape" draggable="false" />

                  <ContentContainer>
                    <div style={{ marginBottom: "1.25rem" }}>
                      {[...new Array(4).keys()].map(i => (
                        <Line key={i} width={i === 3 ? "50%" : "100%"} />
                      ))}
                    </div>
                    <div style={{ marginBottom: "1.25rem" }}>
                      {[...new Array(3).keys()].map(i => (
                        <Line key={i} width={i === 2 ? "33%" : "100%"} />
                      ))}
                    </div>
                    <div>
                      {[...new Array(2).keys()].map(i => {
                        return (
                          <Line key={i} width={i === 1 ? "80%" : "100%"} />
                        );
                      })}
                    </div>
                  </ContentContainer>
                </StyledContent>
              </StyledTabPanel>
            );
          })}
        </StyledTabPanels>
      </StyledTabs>
    </>
  );
};

export default SwipeableTabs;
