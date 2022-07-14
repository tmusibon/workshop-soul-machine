/* eslint-disable */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import dummyTOS from '../../termsConditions';

const TermsAndConditions = ({ data }) => {
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);

  return (
    <Modal show={show} size="xl">
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>Legal: Privacy/Terms & Conditions</Modal.Title>
      </Modal.Header>
      <Modal.Body>{dummyTOS}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

TermsAndConditions.propTypes = {
  data: PropTypes.shape({
    action: PropTypes.string.isRequired,
  }).isRequired,
};

export default TermsAndConditions;
