module.exports = {
  presets: [require.resolve("@docusaurus/core/lib/babel/preset")],
  plugins: ["@babel/proposal-class-properties", "@babel/proposal-object-rest-spread"],
};
