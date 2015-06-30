var React = require('react-native');

var {
  NavigatorIOS,
  TouchableHighlight,
  View,
  Text,
  StyleSheet
} = React;


class RideCell extends React.Component {
  render() {
    return (
      <View>
        <TouchableHighlight
          onPress={this.props.onSelect}>
          <View style={styles.row}>
      		<Text>{this.props.name}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
  },
});

module.exports = RideCell;
