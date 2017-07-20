const Reflux = require('reflux');

/**
 * The actions used by the Chart components.
 */
const Actions = Reflux.createActions([
  'mapFieldToChannel',
  'copyEncodedChannel',
  'swapEncodedChannels',
  'selectMeasurement',
  'selectAggregate',
  'selectChartType',
  'clearChart',
  'undoAction',
  'redoAction',
  'resizeChart',
  'setArrayReduction',
  'setSpecAsJSON',
  'switchToChartBuilderView',
  'switchToJSONView',
  'filterFields'
]);

module.exports = Actions;
