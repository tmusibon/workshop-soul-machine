/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Options from './ContentCards/Options';
import Markdown from './ContentCards/Markdown';
import Link from './ContentCards/Link';
import Image from './ContentCards/Image';
import Images from './ContentCards/Images';
import Video from './ContentCards/Video';
import TermsAndConditions from './ContentCards/TermsAndConditions';
import StoryCard from './ContentCards/StoryCard/StoryCard';
import { setActiveCards, animateCamera } from '../store/sm/index';

const returnCardError = (errMsg) => {
  console.error(errMsg);
  return (
    <div className="alert alert-danger" key={Math.random()}>
      {errMsg}
    </div>
  );
};

const ContentCardSwitch = ({ activeCards, dispatchActiveCards, card, index, inTranscript }) => {
  console.log(`CARD: ${JSON.stringify(card, null, 2)}`);
  const componentMap = {
    options: {
      element: Options,
      removeOnClick: true,
    },
    markdown: {
      element: Markdown,
      removeOnClick: false,
    },
    externalLink: {
      element: Link,
      removeOnClick: false,
    },
    image: {
      element: Image,
      removeOnClick: false,
    },
    images: {
      element: Images,
      removeOnClick: false,
    },
    termsAndConditions: {
      element: TermsAndConditions,
      removeOnClick: false,
    },
    video: {
      element: Video,
      removeOnClick: false,
    },
    story: {
      element: StoryCard,
      removeOnClick: false,
    },
  };

  if (card === undefined)
    return returnCardError('unknown content card name! did you make a typo in @showCards()?');
  const { component: componentName, data, id } = card;
  if (componentName in componentMap === false)
    return returnCardError(`component ${componentName} not found in componentMap!`);
  const { element: Element, removeOnClick } = componentMap[componentName];

  let removeElem;
  if (index) {
    // for some cards, we want them to be hidden after the user interacts w/ them
    // for others, we don't
    removeElem = (e) => {
      // we need to write our own handler, since this is not an interactive element by default
      if (e.type === 'click' || e.code === 'enter') {
        const newActiveCards = [...activeCards.slice(0, index), ...activeCards.slice(index + 1)];
        dispatchActiveCards(newActiveCards);
      }
    };
  } else {
    removeElem = null;
  }
  const elem = (
    // disable no static element interactions bc if removeOnClick is true,
    // elem should have interactive children
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onClick={removeOnClick ? removeElem : null}
      onKeyPress={removeOnClick ? removeElem : null}
      className="m-2"
      data-sm-content={id}
    >
      {/* elements that are interactive but shouldn't be removed immediately
         can use triggerRemoval to have the card removed */}
      <Element data={{ id, ...data }} triggerRemoval={removeElem} inTranscript={inTranscript} />
    </div>
  );
  return elem;
};

ContentCardSwitch.propTypes = {
  activeCards: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatchActiveCards: PropTypes.func.isRequired,
  dispatchAnimateCamera: PropTypes.func.isRequired,
  videoWidth: PropTypes.number.isRequired,
  videoHeight: PropTypes.number.isRequired,
  showTranscript: PropTypes.bool.isRequired,
  inTranscript: PropTypes.bool,
};

ContentCardSwitch.defaultProps = {
  inTranscript: false,
};

const mapStateToProps = ({ sm }) => ({
  activeCards: sm.activeCards,
  videoWidth: sm.videoWidth,
  videoHeight: sm.videoHeight,
  showTranscript: sm.showTranscript,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchActiveCards: (activeCards) =>
    dispatch(setActiveCards({ activeCards, cardsAreStale: true })),
  dispatchAnimateCamera: (options, duration = 1) => dispatch(animateCamera({ options, duration })),
});
export default connect(mapStateToProps, mapDispatchToProps)(ContentCardSwitch);
