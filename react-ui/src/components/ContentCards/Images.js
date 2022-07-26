/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

const Images = ({ data }) => {
  const { images } = data;
  return (
    <div className="div">
      {images.map((image, i) => {
        return (
          <img
            key={i}
            src={image.url}
            alt={image.alt}
            style={{
              maxHeight: '260px',
              margin: '0.5rem',
              borderRadius: '10%',
              width: 'auto',
            }}
          />
        );
      })}
    </div>
  );
};

Images.propTypes = {
  data: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default Images;
