/* eslint-disable */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { setActiveCards, animateCamera } from '../store/sm/index';
import { calculateCameraPosition } from '../utils/camera';
import Transcript from './ContentCards/Transcript';
import ContentCardSwitch from './ContentCardSwitch';
import breakpoints from '../utils/breakpoints';

const ContentCardDisplay = ({
  activeCards,
  dispatchAnimateCamera,
  videoWidth,
  videoHeight,
  showTranscript,
  className,
  connected,
}) => {
  if (!activeCards) return null;
  const CardDisplay = activeCards.map((c, index) => (
    <div className="mb-2" key={JSON.stringify(c)}>
      <ContentCardSwitch card={c} index={index} />
    </div>
  ));

  const animateCameraToFitCards = () => {
    if (connected) {
      if ((activeCards.length > 0 || showTranscript === true) && videoWidth >= breakpoints.md) {
        dispatchAnimateCamera(calculateCameraPosition(videoWidth, videoHeight, 0.7));
      } else dispatchAnimateCamera(calculateCameraPosition(videoWidth, videoHeight, 0.5));
    }
  };

  useEffect(() => {
    animateCameraToFitCards();
  }, [showTranscript, activeCards]);

  useEffect(() => {
    window.addEventListener('resize', animateCameraToFitCards);
    return () => window.removeEventListener('resize', animateCameraToFitCards);
  });

  console.log(`VIDEO WIDTH: ${videoWidth}`);
  return <div className={className}>{showTranscript ? <Transcript /> : CardDisplay}</div>;
};

ContentCardDisplay.propTypes = {
  activeCards: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatchAnimateCamera: PropTypes.func.isRequired,
  videoWidth: PropTypes.number.isRequired,
  videoHeight: PropTypes.number.isRequired,
  showTranscript: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  connected: PropTypes.bool.isRequired,
};

const StyledContentCardDisplay = styled(ContentCardDisplay)`
  max-height: 27rem;
  overflow: hidden;
  margin-bottom: 0.9rem;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* show translucent background if card showing on small device */
  ${({ activeCards, showTranscript }) =>
    activeCards.length > 0 || showTranscript === true
      ? 'background: rgba(255, 255, 255, 0.3);'
      : ''}

  @media(min-width: ${breakpoints.md}px) {
    max-height: 100%;
    background: none;
    outline: none;
    margin-bottom: auto;
  }
  width: 100%;
`;

const mapStateToProps = ({ sm }) => ({
  activeCards: sm.activeCards,
  videoWidth: sm.videoWidth,
  videoHeight: sm.videoHeight,
  showTranscript: sm.showTranscript,
  connected: sm.connected,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchActiveCards: (activeCards) =>
    dispatch(
      // the next time the persona speaks, if the cards are stale, it will clear them.
      // if this value isn't desired, don't set this value to true.
      setActiveCards({ activeCards, cardsAreStale: true }),
    ),
  dispatchAnimateCamera: (options, duration = 1) => dispatch(animateCamera({ options, duration })),
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledContentCardDisplay);
