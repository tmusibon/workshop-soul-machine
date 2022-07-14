/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sendTextMessage } from '../../../store/sm/index';
import styles from './Options.module.css';

const Options = ({ data, dispatchTextFromData }) => {
  const { options } = data;
  const optionsDisplay = options.map(({ label, value }) => (
    <button
      type="button"
      className={styles['list-btn']}
      data-trigger-text={value}
      onClick={dispatchTextFromData}
      key={JSON.stringify({ label, value })}
    >
      {label}
    </button>
  ));
  return <div className={styles.container}>{optionsDisplay}</div>;
};

Options.propTypes = {
  data: PropTypes.shape({
    options: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  dispatchTextFromData: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatchTextFromData: (e) => dispatch(sendTextMessage({ text: e.target.dataset.triggerText })),
});

export default connect(null, mapDispatchToProps)(Options);
