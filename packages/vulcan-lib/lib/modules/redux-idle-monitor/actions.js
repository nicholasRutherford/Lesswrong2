import { IDLESTATUS_AWAY, IDLESTATUS_INACTIVE, IDLESTATUS_EXPIRED } from './constants';
import { registerSetting, getSetting } from '../settings.js';
import { runCallbacks, registerCallback } from '../callbacks.js';
import { debug } from '../debug.js';

registerSetting('idleStatus.timeout.away', 20000, 'Time after which user is marked as "AWAY" by `withIdle`')
registerSetting('idleStatus.timeout.inactive', 60000, 'Time after which user is marked as "INACTIVE" by `withIdle`')
registerSetting('idleStatus.timeout.expired', 5 * 60000, 'Time after which user is marked as "EXPIRED" by `withIdle`')


export const idleStatusDelay = idleStatus => (dispatch, getState) => {
  if(idleStatus === IDLESTATUS_AWAY)
    return getSetting('idleStatus.timeout.away') // User becomes away after 20 seconds inactivity
  if(idleStatus === IDLESTATUS_INACTIVE)
    return getSetting('idleStatus.timeout.inactive') // User becomes inactive after a further 60 seconds of inactivity
  if(idleStatus === IDLESTATUS_EXPIRED)
    return getSetting('idleStatus.timeout.expired')  // User becomes expired after a further 60 seconds of inactivity
}

registerCallback({
  name: 'idleStatus.active',
  arguments: [{dispatch: 'The current redux dispatch'}, {getState: 'function to get the current redux state'}],
  runs: 'sync',
  returns: 'void',
  description: `Runs on the client. Allows you to call functions when the user becomes active after having been idle.`
});

export const activeStatusAction = (dispatch, getState) => {
    runCallbacks('idleStatus.active', getState);
    debug('User idleStatus is ACTIVE');
}

registerCallback({
  name: 'idleStatus.away',
  arguments: [{getState: 'function to get the current redux state'}],
  runs: 'sync',
  returns: 'void',
  description: `Run on the client. Allows you to call functions when the user enters idle status 'AWAY'`
});

registerCallback({
  name: 'idleStatus.inactive',
  arguments: [{getState: 'function to get the current redux state'}],
  runs: 'sync',
  returns: 'void',
  description: `Run on the client. Allows you to call functions when the user enters idle status 'INACTIVE'`
});

registerCallback({
  name: 'idleStatus.expired',
  arguments: [{getState: 'function to get the current redux state'}],
  runs: 'sync',
  returns: 'void',
  description: `Run on the client. Allows you to call functions when the user enters idle status 'EXPIRED'`
});

export const idleStatusAction = idleStatus => (dispatch, getState) => {
  if(idleStatus === IDLESTATUS_AWAY)
    runCallbacks('idleStatus.away', getState)
    debug('User idleStatus is ' + idleStatus);
  if(idleStatus === IDLESTATUS_INACTIVE)
    runCallbacks('idleStatus.inactive', getState)
    debug('User idleStatus is ' + idleStatus);
  if(idleStatus === IDLESTATUS_EXPIRED)
    runCallbacks('idleStatus.expired', getState)
    debug('User idleStatus is ' + idleStatus);
}
