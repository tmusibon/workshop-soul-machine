/* eslint-disable */
import React from 'react';
import { logo, logoAltText, transparentHeader, headerHeight } from '../../config';
import styles from './Header.module.css';

const Header = () => (
  <header className={styles.header}>
    <div className={styles['header__logo-box']}>
      <img src={logo} className={styles.header__logo} alt={logoAltText} />
    </div>
    <div className={styles['header__text-box']}>
      <div className={styles['heading-primary--main']}>Friends of Animals</div>
      <div className={styles['heading-primary--sub']}>
        To build a community where people value animals and treat them with respect and kindness.
      </div>
    </div>
  </header>
);

export default Header;
