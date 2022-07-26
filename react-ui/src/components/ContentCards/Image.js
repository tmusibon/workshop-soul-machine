import React from 'react';
import PropTypes from 'prop-types';

const Image = ({ data }) => {
  //const { url, alt } = data;
  return (
    <div style={{ width: 'auto', maxWidth: '100%' }}>
      <img src={data.images.url} alt={data.images.alt} style={{ width: '60%', height: '40%' }} />
    </div>
  );
};

Image.propTypes = {
  data: PropTypes.shape({
    url: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
  }).isRequired,
};

export default Image;
