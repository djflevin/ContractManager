function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name), // eslint-disable-line no-use-before-define
      //  Border radius is set to 50% to make it a circle
      border: '0.2px solid #000000',
    },
    // First and last name initial (take last index in case of middle name)
    children: `${name.split(' ')[0][0]}${name.split(' ')[name.split(' ').length - 1][0]}`,
  };
}

export default stringAvatar;