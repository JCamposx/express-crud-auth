/**
 * Builds a URL by replacing placeholders with provided values.
 *
 * @param {string} path - The URL path with placeholders.
 * @param {object} args - An object containing values to replace placeholders.
 * @returns {string} - The constructed URL.
 */
const urlBuilder = (path, args = {}) => {
  return path.replace(/:\w+/g, (match) => args[match.slice(1)] || match);
};

export default urlBuilder;
