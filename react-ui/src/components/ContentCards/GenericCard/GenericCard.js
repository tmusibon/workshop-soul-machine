import React from 'react';
import PropTypes from 'prop-types';
import styles from './GenericCard.module.css';

const GenericCard = ({ data }) => {
  const params = data.parameters;
  return (
    <div className="card">
      <div className="card-body">
        <div className={styles.card__container}>
          <h2 className={styles.title}>This is a Generic Card </h2>
          <ul className={styles.list}>
            {params.map((item, key) => (
              <li key={key}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
GenericCard.propTypes = {
  data: PropTypes.shape({
    parameters: PropTypes.array.isRequired,
  }).isRequired,
};

export default GenericCard;
