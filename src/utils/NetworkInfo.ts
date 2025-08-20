export async function getNetworkInfo() {
  if (!navigator.connection) {
    return {
      downlink: null,
      effectiveType: 'unknown',
      rtt: null,
    };
  }

  const { downlink, effectiveType, rtt } = navigator.connection;

  return {
    downlink,
    effectiveType,
    rtt,
  };
}
