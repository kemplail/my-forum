export default {
  input: 'src/parser/grammar.peggy',
  output: 'src/parser/parser.js',
  dts: true,
  returnTypes: {
    Start: 'LogicalCondition',
  },
};
