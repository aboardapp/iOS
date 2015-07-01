var React = require('react-native');

var {
  NavigatorIOS,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  PixelRatio,
  Image
} = React;


class Button extends React.Component {
  render() {
    return (
      <TouchableOpacity {...this.props}>
        <Text style={styles.button}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  button: {
    fontFamily: 'Avenir',
    fontSize: 14,
    color: '#335485',
    padding: 9,
    paddingBottom: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#335485',
    borderRadius: 3,
    textAlign: 'center',
    fontWeight: '700',
    alignSelf: 'center',
  },
});

module.exports = Button;
