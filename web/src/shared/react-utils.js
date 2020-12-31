import React from 'react';

export const isFunction = (obj) => typeof obj === 'function';

export const isEmptyChildren = (children) =>
  React.Children.count(children) === 0;
