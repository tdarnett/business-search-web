import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'rc-progress';
import theme from '../styles/theme';

const Progress = ({ percentage }) => {
  return <Line percent={percentage} strokeWidth="2" strokeColor={theme.color.secondary} />;
};

Progress.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default Progress;
