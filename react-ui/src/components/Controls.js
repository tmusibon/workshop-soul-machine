/* eslint-disable */
import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useIdleTimer } from 'react-idle-timer';
import ReactTooltip from 'react-tooltip';
import { Button, Modal } from 'react-bootstrap';
import dummyTOS from '../termsConditions';
import {
  ChatSquareDotsFill,
  Keyboard,
  XOctagonFill,
  ArrowCounterclockwise,
  MicMuteFill,
  FileEarmarkTextFill,
} from 'react-bootstrap-icons';
import {
  sendTextMessage,
  mute,
  stopSpeaking,
  setShowTranscript,
  setShowTermsAndConditions,
  resetTranscript,
} from '../store/sm/index';
import mic from '../img/mic.svg';
import micFill from '../img/mic-fill.svg';
import breakpoints from '../utils/breakpoints';
import { mediaStreamProxy } from '../proxyVideo';
import axios from 'axios';

const ORCHESTRATION_MODE = process.env.REACT_APP_ORCHESTRATION_MODE || false;
const NODE_ORCH = process.env.NODE_ENV || false;
const TOKEN_ISSUER = process.env.REACT_APP_TOKEN_URL;
const WATSON_URL = process.env.REACT_APP_WATSON_URL;
// convert the string value "true" or "false" to a boolean; default to false
const REACT_APP_PROD = JSON.parse(process.env.REACT_APP_PROD) || false;

const volumeMeterHeight = 24;
const volumeMeterMultiplier = 1.2;
const smallHeight = volumeMeterHeight;
const largeHeight = volumeMeterHeight * volumeMeterMultiplier;

const Controls = ({
  className,
  intermediateUserUtterance,
  lastUserUtterance,
  userSpeaking,
  dispatchResetTranscript,
  dispatchText,
  dispatchMute,
  isMuted,
  speechState,
  dispatchStopSpeaking,
  dispatchToggleShowTranscript,
  showTranscript,
  transcript,
  videoWidth,
  connected,
  typingOnly,
  showTermsAndConditions,
  dispatchToggleShowTermsAndConditions,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [volume, setVolume] = useState(0);
  const [hideInputDisplay, setHideInputDisplay] = useState(true);
  const [showTextInput, setShowTextInput] = useState(isMuted || typingOnly);
  const isLarger = videoWidth >= breakpoints.md ? largeHeight : smallHeight;
  const [responsiveVolumeHeight, setResponsiveVolumeHeight] = useState(isLarger);

  // const handleInput = (e) => setInputValue(e.target.value);
  // const handleFocus = () => {
  //   setInputFocused(true);
  //   setInputValue('');
  // };
  // const handleBlur = () => setInputFocused(false);
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   dispatchText(inputValue);
  //   setInputValue('');
  // };

  if (userSpeaking === true && inputValue !== '' && inputFocused === false) setInputValue('');

  // code for handling IDLE session timeout below
  const [userActiveTimeStamp, setUserActiveTimeStamp] = useState(0);

  const handleOnAction = () => {
    setUserActiveTimeStamp(getLastActiveTime());
  };

  const handleOnIdle = () => {
    dispatchResetTranscript();
    console.log(`90s is up, not detecting user activity or input, reset conversation`);

    // delete the Watson Assistant session and set the session ID to null
    axios
      .post(WATSON_URL, {
        function: 'ResetID',
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(`error from WATSON conversation ID reset`, error);
      });
  };

  const { getLastActiveTime } = useIdleTimer({
    onAction: handleOnAction,
    events: [
      'mousemove',
      'keydown',
      'wheel',
      'DOMMouseScroll',
      'mousewheel',
      'mousedown',
      'touchstart',
      'touchmove',
    ],
  });

  useEffect(() => {
    if (userSpeaking === true || lastUserUtterance.length > 0) setHideInputDisplay(false);
    const createTimeout = () =>
      setTimeout(() => {
        if (userSpeaking === false) setHideInputDisplay(true);
        else createTimeout();
      }, 3000);
    let timeout = createTimeout();
    return () => clearTimeout(timeout);
  }, [userSpeaking, lastUserUtterance, isMuted]);

  useEffect(() => {
    let idleTimer = setTimeout(handleOnIdle, 90000);

    return () => clearTimeout(idleTimer);
  }, [transcript, lastUserUtterance, userSpeaking, speechState, userActiveTimeStamp]);

  useEffect(async () => {
    if (connected && typingOnly === false) {
      // credit: https://stackoverflow.com/a/64650826
      let volumeCallback = null;
      let audioStream;
      let audioContext;
      let audioSource;
      let unmounted = false;
      // Initialize
      try {
        audioStream = mediaStreamProxy.getUserMediaStream();
        audioContext = new AudioContext();
        audioSource = audioContext.createMediaStreamSource(audioStream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyser.minDecibels = -127;
        analyser.maxDecibels = 0;
        analyser.smoothingTimeConstant = 0.4;
        audioSource.connect(analyser);
        const volumes = new Uint8Array(analyser.frequencyBinCount);
        volumeCallback = () => {
          analyser.getByteFrequencyData(volumes);
          let volumeSum = 0;
          volumes.forEach((v) => {
            volumeSum += v;
          });
          // multiply value by 2 so the volume meter appears more responsive
          // (otherwise the fill doesn't always show)
          const averageVolume = (volumeSum / volumes.length) * 2;
          // Value range: 127 = analyser.maxDecibels - analyser.minDecibels;
          setVolume(averageVolume > 127 ? 127 : averageVolume);
        };
        // runs every time the window paints
        const volumeDisplay = () => {
          window.requestAnimationFrame(() => {
            if (!unmounted) {
              volumeCallback();
              volumeDisplay();
            }
          });
        };
        volumeDisplay();
      } catch (e) {
        console.log('volume: ', volume);
        console.log('responsiveVolumeHeight: ', responsiveVolumeHeight);
        console.error('Failed to initialize volume visualizer!', e);
      }

      return () => {
        console.log('closing down the audio stuff');
        // FIXME: tracking #79
        unmounted = true;
        audioContext.close();
        audioSource.close();
      };
    }
    return false;
  }, [connected]);

  useEffect(() => {
    // check window width, if larger display then increase mic indicator size
    if (videoWidth >= breakpoints.md) setResponsiveVolumeHeight(largeHeight);
    else setResponsiveVolumeHeight(smallHeight);
  });

  // const toggleKeyboardInput = () => {
  //   const toggledTextInput = !showTextInput;
  //   dispatchMute(toggledTextInput);
  //   setShowTextInput(toggledTextInput);
  // };
  // useEffect(() => {
  //   if (isMuted !== showTextInput) setShowTextInput(isMuted || typingOnly);
  // }, [isMuted]);

  // when we switch to keyboard input, capture focus
  // const textInput = createRef();
  // useEffect(() => {
  //   if (showTextInput === true) textInput.current.focus();
  // }, [showTextInput]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const resetConvo = () => {
    //functionality for clear out the transcript after reset buttom.
    dispatchResetTranscript();

    //axio calls for reset conversation WA session.
    axios
      .post(WATSON_URL, {
        function: 'ResetConvo',
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(`error from WATSON Reset api`, error);
      });
  };

  // clear placeholder text on reconnect, sometimes the state updates won't propagate
  const placeholder = intermediateUserUtterance === '' ? '' : intermediateUserUtterance;

  const transcriptButton = (
    <button
      type="button"
      className={`btn btn-${showTranscript ? '' : 'outline-'}secondary`}
      aria-label="Toggle Transcript"
      data-tip="Toggle Transcript"
      data-place="top"
      onClick={dispatchToggleShowTranscript}
      disabled={transcript.length === 0}
    >
      <ChatSquareDotsFill />
    </button>
  );

  const resetConvoButton = (
    <button
      type="button"
      className={`btn btn-${showTranscript ? '' : 'outline-'}secondary`}
      aria-label="Reset Conversation"
      data-tip="Reset Conversation"
      data-place="top"
      onClick={resetConvo}
      disabled={transcript.length === 0}
    >
      <ArrowCounterclockwise />
    </button>
  );

  const termsAndConditionsButton = (
    <button
      type="button"
      className={`btn btn-${showTermsAndConditions ? '' : 'outline-'}secondary`}
      aria-label="View Terms and Conditions"
      data-tip="View Terms and Conditions"
      data-place="top"
      onClick={dispatchToggleShowTermsAndConditions}
    >
      <FileEarmarkTextFill />
    </button>
  );

  const interruptButton = (
    <button
      type="button"
      className="btn btn-outline-secondary"
      disabled={speechState !== 'speaking'}
      onClick={dispatchStopSpeaking}
      data-tip="Stop Speaking"
      data-place="top"
    >
      <XOctagonFill color="red" />
    </button>
  );

  const feedbackDisplay = (
    <span
      className={`badge bg-light input-display
              ${userSpeaking ? 'utterance-processing' : ''}
              ${
                (transcript.length === 0 && intermediateUserUtterance === '') || hideInputDisplay
                  ? 'hide-input'
                  : 'show-input'
              }
              `}
    >
      <div className="text-wrap text-start input-display">
        {userSpeaking ? 'Listening: ' : 'I heard: '}
        {placeholder || lastUserUtterance}
        {userSpeaking ? (
          <div>
            <div className="spinner-border ms-2 d-md-block d-none" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-border spinner-border-sm ms-1 d-block d-md-none" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : null}
      </div>
    </span>
  );
  function displayReset() {
    const [count, setCount] = useState(0);
    useEffect(() => {
      const timer = setTimeout(() => {
        setCount(count + 1);
      }, 15000);
      return () => clearTimeout(timer);
    }, []);
    if (count === 1) {
      return (
        // <div className={`col-auto d-md-block d-${showTextInput ? 'none' : 'block'}`}>
        <div className={`col-auto d-md-block d-block`}>
          {resetConvoButton}
        </div>
      );
    }
    if (count === 0) {
      // return <div className={`col-auto d-md-block d-${showTextInput ? 'none' : 'block'}`}></div>;
      return <div className={`col-auto d-md-block d-block`}></div>;
    }
  }

  return (
    <div className={className}>
      <Modal show={showTermsAndConditions} onHide={dispatchToggleShowTermsAndConditions} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Legal: Privacy/Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>{dummyTOS}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={dispatchToggleShowTermsAndConditions}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="row">
        <div
          className={`col-md-10 offset-md-1 d-flex justify-content-center mb-2`}
        >
          {feedbackDisplay}
        </div>
      </div>
      <div className="row">
        <div
          className={`d-none d-md-none justify-content-between align-items-end pb-2`}
        >
          <div>{transcriptButton}</div>
          <div className={speechState === 'speaking' ? 'interrupt' : 'interrupt interrupt-active'}>
            {interruptButton}
          </div>
        </div>
      </div>
      <div className="row mb-3 display-flex justify-content-center">
        {/* <div className={`col-auto d-md-block d-${showTextInput ? 'none' : 'block'}`}> */}
        <div className={`col-auto d-md-block d-block`}>
          {transcriptButton}
        </div>
        {displayReset()}
        {/* <form onSubmit={handleSubmit} className="col "> */}
        <form className="col ">
          <div className="input-group d-flex justify-content-center">
            <div></div>
            <div></div>
          </div>
        </form>
        {/* <div className={`col-auto d-md-block d-${showTextInput ? 'none' : 'block'}`}> */}
        <div className={`col-auto d-md-block d-block`}>
          <div className={speechState === 'speaking' ? 'interrupt' : 'interrupt interrupt-active'}>
            {interruptButton}
          </div>
        </div>
        <div className={`col-auto d-md-block d-${showTermsAndConditions ? 'none' : 'block'}`}>
          {termsAndConditionsButton}
        </div>
      </div>
    </div>
  );
};

Controls.propTypes = {
  className: PropTypes.string.isRequired,
  intermediateUserUtterance: PropTypes.string.isRequired,
  lastUserUtterance: PropTypes.string.isRequired,
  userSpeaking: PropTypes.bool.isRequired,
  dispatchText: PropTypes.func.isRequired,
  dispatchMute: PropTypes.func.isRequired,
  isMuted: PropTypes.bool.isRequired,
  speechState: PropTypes.string.isRequired,
  dispatchStopSpeaking: PropTypes.func.isRequired,
  showTranscript: PropTypes.bool.isRequired,
  showTermsAndConditions: PropTypes.bool.isRequired,
  dispatchToggleShowTermsAndConditions: PropTypes.func.isRequired,
  dispatchToggleShowTranscript: PropTypes.func.isRequired,
  transcript: PropTypes.arrayOf(PropTypes.object).isRequired,
  videoWidth: PropTypes.number.isRequired,
  connected: PropTypes.bool.isRequired,
  typingOnly: PropTypes.bool.isRequired,
};

const StyledControls = styled(Controls)`
  display: ${(props) => (props.connected ? '' : 'none')};

  overflow: hidden; 

  .form-control {
    opacity: 0.8;
    &:focus {
      opacity: 1;
    }
  }
  .badge {
    font-size: 14pt;
    font-weight: normal;
    color: #000;
  }
  .utterance-processing {
    opacity: 0.7;
    font-style: italic;
  }
  .input-display {
    transition: bottom 0.3s, opacity 0.3s;
    height: auto;
    display: flex;
  }
  .hide-input {
    position: relative;
    bottom: -2.5rem;
    opacity: 0;
  }
  .show-input {
    position: relative;
    bottom: 0rem;
    opacity: ${({ userSpeaking }) => (userSpeaking ? 0.7 : 1)};
  }

  .speaking-status {
    width: 47px;
    @media (min-width: ${breakpoints.md}px) {
      min-width: 56px;
    }
  }

  .interrupt {
    opacity: 1;
    transition: opacity 0.1s;
  }
  .interrupt-active {
    opacity: 0;
  }

  .volume-display {
    position: relative;
    top: ${volumeMeterHeight * 0.5}px;
    display: flex;
    align-items: flex-end;
    justify-content: start;
    min-width: ${({ videoWidth }) => (videoWidth <= breakpoints.md ? 21 : 32)}px;
    .meter-component {
      /* don't use media queries for this since we need to write the value
      in the body of the component */
      height: ${({ videoWidth }) => (videoWidth >= breakpoints.md ? largeHeight : smallHeight)}px;
      background-size: ${({ videoWidth }) =>
        videoWidth >= breakpoints.md ? largeHeight : smallHeight}px;
      background-position: bottom;
      overflow: hidden; 
      background-repeat: no-repeat;
      min-width: ${({ videoWidth }) => (videoWidth <= breakpoints.md ? 21 : 28)}px;
      position: absolute;
    }
    .meter-component-1 {
      background-image: url(${mic});
      z-index: 10;
    }
    .meter-component-2 {
      background-image: url(${micFill});
      z-index: 20;
    }
  }
`;

const mapStateToProps = (state) => ({
  intermediateUserUtterance: state.sm.intermediateUserUtterance,
  lastUserUtterance: state.sm.lastUserUtterance,
  userSpeaking: state.sm.userSpeaking,
  connected: state.sm.connected,
  isMuted: state.sm.isMuted,
  speechState: state.sm.speechState,
  showTranscript: state.sm.showTranscript,
  showTermsAndConditions: state.sm.showTermsAndConditions,
  transcript: state.sm.transcript,
  videoWidth: state.sm.videoWidth,
  typingOnly: state.sm.typingOnly,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchResetTranscript: () => dispatch(resetTranscript()),
  dispatchText: (text) => dispatch(sendTextMessage({ text })),
  dispatchMute: (muteState) => dispatch(mute(muteState)),
  dispatchStopSpeaking: () => dispatch(stopSpeaking()),
  dispatchToggleShowTranscript: () => dispatch(setShowTranscript()),
  dispatchToggleShowTermsAndConditions: () => dispatch(setShowTermsAndConditions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledControls);
