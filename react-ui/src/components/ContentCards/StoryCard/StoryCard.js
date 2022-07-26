import React from 'react';
import { connect } from 'react-redux';
import { sendTextMessage } from '../../../store/sm';
import styles from './StoryCard.module.css';

const StoryCard = ({ data, dispatchTextFromData }) => {
  const { parameters } = data;
  return (
    <div className={styles.container}>
      <div className={styles.title_container}>
        <h1 className={styles.title}>{parameters.title}</h1>
        <p className={styles.content}>
          Friends of Animals is the global engine of change for pets. For more than 30 years, we’ve
          inspired individuals and communities to work to change laws, improve shelters, and most
          importantly—save pets.
        </p>
        <h2 className={styles.subtitle}>{parameters.subtitle}</h2>
        <div className={styles.content_container}>
          <p className={styles.content}>
            Since our founding in 1990, we have championed Trap-Neuter-Return (TNR) as the only
            humane and effective approach for community pets management. By establishing and
            promoting optimal standards of care, we have propelled the humane treatment of pets into
            the global spotlight.
            <p>To reach our goal, we will differentiate ourselves by:</p>
            <ul>
              <li>Ensuring reliable service</li>
              <li>
                {' '}
                Improving and saving animal lives by promoting quality care and compassion through
                adoption and education around the world.
              </li>
              <li>Fostering a welcoming and relaxing atmosphere for animals</li>
              <li>Working with shelters to implement lifesaving programs for all animals.</li>
              <li>Growing sustainably</li>
            </ul>
          </p>
        </div>
        <div
          className={styles.button}
          data-trigger-text={'show more'}
          onClick={dispatchTextFromData}
        >
          SHOW MORE
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  dispatchTextFromData: (e) => dispatch(sendTextMessage({ text: e.target.dataset.triggerText })),
});

export default connect(null, mapDispatchToProps)(StoryCard);
