/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable quotes */
import React, { createRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PersonaVideo from '../components/PersonaVideo';
import Captions from '../components/Captions';
import Controls from '../components/Controls';
import ContentCardDisplay from '../components/ContentCardDisplay';
import { disconnect, createScene } from '../store/sm/index';
import { headerHeight, disconnectPage, disconnectRoute } from '../config';
import breakpoints from '../utils/breakpoints';
//import PublicAnnouncementNotice from '../components/PublicAnnouncementNotice';

const DPChat = ({
  className,
  connected,
  disconnected,
  dispatchDisconnect,
  dispatchCreateScene,
  error,
  loading,
  tosAccepted,
  cameraOn,
}) => {
  const overlayRef = createRef();
  const [height, setHeight] = useState('100vh');
  const [largeViewport, setLargeViewport] = useState(false);

  const handleResize = () => {
    setHeight(window.innerHeight);
    if (window.innerWidth >= breakpoints.md) setLargeViewport(true);
    else setLargeViewport(false);
  };

  const createSceneIfNotStarted = () => {
    if (loading === false && connected === false && error === null) {
      dispatchCreateScene();
    }
  };

  useEffect(() => {
    if (window.innerWidth >= breakpoints.md && !loading) {
      createSceneIfNotStarted();
    }
    window.addEventListener('resize', createSceneIfNotStarted);
    return () => window.removeEventListener('resize', createSceneIfNotStarted);
  }, [connected, loading]);

  const cleanup = () => {
    console.log('cleanup function invoked!');
    window.removeEventListener('resize', handleResize);
    dispatchDisconnect();
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    // run cleanup on unmount
    return () => cleanup();
  }, []);

  window.onbeforeunload = () => {
    console.log('cleaning up');
    cleanup();
  };

  const history = useHistory();
  // useEffect(() => {
  //   if (error !== null) history.push("/loading?error=true");
  // }, [error]);
  // if TOS hasn't been accepted, send to /
  if (tosAccepted === false && disconnected === false) {
    cleanup();
    history.push('/');
  }
  if (disconnected === true) {
    if (disconnectPage) {
      history.push(disconnectRoute);
    } else history.push('/');
  }

  return (
    <div className={className}>
      <div className="video-overlay" ref={overlayRef} style={{ height }}>
        {/* top row */}
        <div className="container d-flex flex-column">
          {cameraOn ? (
            <div className="row d-flex justify-content-end">
              <div className="col-auto">
                <div className="camera-preview">{/* <CameraPreview /> */}</div>
              </div>
            </div>
          ) : (
            <div />
          )}
          <div />
          {/* middle row */}
          <div className="vertical-fit-container col-xl-8">
            {/* on larger devices, show cards next to DP */}
            <div className="d-md-block d-none">
              {largeViewport === true ? <ContentCardDisplay /> : null}
            </div>
          </div>
          {/* bottom row */}
          <div>
            {/* on smaller devices, show the cards over the DP, centered */}
            <div className="row">
              <div className="d-block d-md-none">
                {largeViewport === false ? <ContentCardDisplay /> : null}
              </div>
            </div>
            <div className="row">
              <div className="col text-center">
                <Captions />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Controls />
              </div>
            </div>
          </div>
        </div>
      </div>
      {connected ? <PersonaVideo /> : null}
    </div>
  );
};

DPChat.propTypes = {
  className: PropTypes.string.isRequired,
  dispatchDisconnect: PropTypes.func.isRequired,
  connected: PropTypes.bool.isRequired,
  disconnected: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  dispatchCreateScene: PropTypes.func.isRequired,
  error: PropTypes.shape({
    msg: PropTypes.string,
    err: PropTypes.objectOf(PropTypes.string),
  }),
  tosAccepted: PropTypes.bool.isRequired,
  cameraOn: PropTypes.bool.isRequired,
};

DPChat.defaultProps = {
  error: null,
};

const StyledDPChat = styled(DPChat)`
  .video-overlay {
    position: absolute;
    overflow: hidden;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10;

    width: 100%;

    .container {
      height: calc(100% - ${headerHeight});
      overflow: hidden;
    }

    .vertical-fit-container {
      flex: 1 1 auto;
      overflow: hidden;

      scrollbar-width: none; /* Firefox 64 */
      &::-webkit-scrollbar {
        display: none;
      }

      @media (min-width: ${breakpoints.md}px) {
        display: flex;
        align-items: center;
        overflow: hidden;
      }
    }
    .loading-container {
      flex: 1 1 auto;
      text-align: center;
      overflow: hidden;
    }
  }
`;

const mapStateToProps = ({ sm }) => ({
  connected: sm.connected,
  disconnected: sm.disconnected,
  dispatchCreateScene: PropTypes.func.isRequired,
  loading: sm.loading,
  error: sm.error,
  tosAccepted: sm.tosAccepted,
  cameraOn: sm.cameraOn,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchCreateScene: (typingOnly = false) => dispatch(createScene(typingOnly)),
  dispatchDisconnect: () => dispatch(disconnect()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledDPChat);
