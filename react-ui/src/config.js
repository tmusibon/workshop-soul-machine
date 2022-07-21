/* eslint-disable import/prefer-default-export */
import Pearson_logo from './img/toronto_pearson.svg';

// header will not take up vertical height when transparent, so you need to be mindful of overlap
export const transparentHeader = true;
export const headerHeight = '8rem';
export const logo = Pearson_logo;
export const logoAltText = 'Toronto Pearson logo';
export const logoLink = '/';

// background image is positioned in a way that is best for pictures of the persona's face.
// adjust spacing as necessary in Landing.js for different images
// if you want just a color, set landingBackgroundImage to null
// if desired, a gradient can also be added to landingBackgroundColor
export const landingBackgroundColor = '#fff';
export const landingBackgroundImage = null;

// if set to true, on disconnect, the app will redirect to the specified route.
// if false, it will redirect to /
export const disconnectPage = false;
export const disconnectRoute = '/feedback';
