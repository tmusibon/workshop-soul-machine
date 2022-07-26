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
          Pearson Airport is more than just a transportation hub. We are always working to fuel
          success for our region now and into the future.
        </p>
        <h2 className={styles.subtitle}>{parameters.subtitle}</h2>
        <div className={styles.content_container}>
          <p className={styles.content}>
            Toronto Pearson is Canada's largest airport in terms of total passenger traffic and
            North America's second largest in terms of international traffic. With daily non-stop
            flights to many of the world's economies, we move people and goods across the country,
            the continent and around the globe.
            <br /> Our goal is to create the airport of the future and we are well positioned to
            make this a reality.
            <p>To reach our goal, we will differentiate ourselves by:</p>
            <ul>
              <li>Ensuring reliable service</li>
              <li>Anticipating and exceeding of the needs of our passengers</li>
              <li>Fostering a welcoming and relaxing atmosphere</li>
              <li>roviding competitive costs and value to airlines and our shared passengers</li>
              <li>Growing sustainably</li>
            </ul>
          </p>
        </div>
        <div
          className={styles.button}
          data-trigger-text={'Learn more'}
          onClick={dispatchTextFromData}
        >
          LEARN MORE
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  dispatchTextFromData: (e) => dispatch(sendTextMessage({ text: e.target.dataset.triggerText })),
});

export default connect(null, mapDispatchToProps)(StoryCard);
