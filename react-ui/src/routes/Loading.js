import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { CameraVideoFill, MicFill } from 'react-bootstrap-icons';
import { AnimatePresence, motion } from 'framer-motion';
import { createScene } from '../store/sm';
import { headerHeight, landingBackgroundImage, landingBackgroundColor } from '../config';
import breakpoints from '../utils/breakpoints';

const Loading = ({ className, connected, loading, dispatchCreateScene, error, tosAccepted }) => {
  // pull querystring to see if we are displaying an error
  // (app can redirect to /loading on fatal err)
  // const useQuery = () => new URLSearchParams(useLocation().search);
  // const query = useQuery();

  // on mobile, we break the cards down into three pages
  const [displayedPage] = useState(0);

  // create persona scene on button press on on mount, depending on device size
  const createSceneIfNotStarted = () => {
    if (loading === false && connected === false && error === null) {
      dispatchCreateScene();
    }
  };

  useEffect(() => {
    if (window.innerWidth >= breakpoints.md && !loading) createSceneIfNotStarted();
    window.addEventListener('resize', createSceneIfNotStarted);
    return () => window.removeEventListener('resize', createSceneIfNotStarted);
  }, [connected, loading]);

  // use to reload page if user unblocks perms and presses "try again"
  const history = useHistory();

  // if TOS hasn't been accepted, send to /
  if (tosAccepted === false) history.push('/');

  const proceedButton = (
    <Link to="/video" className={`btn  btn-lg ${connected ? 'btn-success' : 'btn-dark disabled'}`}>
      {connected ? (
        <Redirect to="/video" />
      ) : (
        <div>
          <span style={{ marginRight: '1rem' }}>Loading</span>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </Link>
  );

  const pages = [
    <div>
      <div className="d-grid gap-2 d-md-none d-block">{proceedButton}</div>
    </div>,
  ];

  const variants = {
    enter: {
      x: 1000,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -1000,
      opacity: 0,
      position: 'absolute',
    },
  };

  const overlayRef = createRef();
  const [height, setHeight] = useState('100vh');

  const handleResize = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    // cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={className} ref={overlayRef} style={{ minHeight: height }}>
      <div className="container">
        <div className="loading-wrapper">
          {!error ? (
            <div>
              <div className="d-md-block d-none">
                <div className="row">
                  <div className="card-group">{pages}</div>
                </div>
                <div className="row">
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="col d-flex justify-content-center m-3"
                  >
                    {proceedButton}
                  </div>
                </div>
              </div>
              <div className="d-md-none d-block">
                <AnimatePresence initial={false}>
                  {pages.flatMap((p, i) => {
                    if (i !== displayedPage) return null;
                    return (
                      <motion.div
                        // using indexes as keys is fine since the pages are pre-defined and static
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: 'spring', stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 },
                        }}
                      >
                        {p}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="alert alert-danger col-md-6 offset-md-3">
              {
                // special error for webcam and mic denied permissions
                error.msg === 'permissionsDenied' ? (
                  <div>
                    <h4>
                      <CameraVideoFill />
                      {' / '}
                      <MicFill />
                      Permissions Denied
                    </h4>
                    <hr />
                    <p>
                      Looks like you’ve denied us access to your camera and microphone. If
                      you&apos;d prefer, you can only enable the microphone. You can always change
                      permissions in your browser settings and try again.
                    </p>
                    <div className="d-grid mb-3">
                      <button
                        onClick={() => history.go(0)}
                        type="button"
                        className="btn btn-primary"
                      >
                        Reload
                      </button>
                    </div>
                    <p>
                      We can have the best conversation when I can see and hear you. However, if you
                      prefer, you can also interact with me by typing only.
                    </p>
                    <div className="d-grid">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => dispatchCreateScene(true)}
                      >
                        I prefer to type
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4>Encountered fatal error!</h4>
                    <hr />
                    <pre>{JSON.stringify(error, null, '  ')}</pre>
                  </div>
                )
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Loading.propTypes = {
  className: PropTypes.string.isRequired,
  connected: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  dispatchCreateScene: PropTypes.func.isRequired,
  error: PropTypes.shape({
    msg: PropTypes.string,
    err: PropTypes.objectOf(PropTypes.string),
  }),
  tosAccepted: PropTypes.bool.isRequired,
};

Loading.defaultProps = {
  error: null,
};

const StyledLoading = styled(Loading)`
  background: ${landingBackgroundImage ? `url(${landingBackgroundImage})` : ''};
  ${landingBackgroundColor ? `${landingBackgroundColor};` : ''};
  overflow: hidden;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center bottom;
  width: 100vw;

  button.link-primary {
    background: none;
    border: none;
    padding: 0;
  }

  .loading-wrapper {
    padding-top: ${headerHeight};
    min-height: calc(100vh - ${headerHeight});
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0;

    .loading-text {
      font-size: 2rem;
    }
  }

  .instructions-wrapper {
    overflow: hidden;
  }
  .instructions-card {
    display: inline-block;
    width: 100%;
  }
`;

const mapStateToProps = ({ sm }) => ({
  connected: sm.connected,
  loading: sm.loading,
  error: sm.error,
  tosAccepted: sm.tosAccepted,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchCreateScene: (typingOnly = false) => dispatch(createScene(typingOnly)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledLoading);
