var React = require('react-native');

var {
  NavigatorIOS,
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
  PixelRatio,
  Image
} = React;


class RideCell extends React.Component {
  render() {
    let model = this.props.model;
    let ride = model.ride;
    let riders = model.riders;
    let picture = ride.driver && ride.driver.picture;
    return (
      <View>
        <TouchableHighlight
          onPress={this.props.onSelect}>
          <View style={styles.row}>
            <Image
              source={{uri: picture}}
              style={styles.cellImage}
            />
            <View style={styles.textContainer}>
              <Text style={styles.rideName}>{ride.name}</Text>
              <Text style={styles.stops}>{ride.stops}</Text>
              <Text>{ride.driver && ride.driver.name}</Text>
              <Text>{ride.seats}</Text>
              <Text>{ride.stops.length}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 0,
    borderWidth: 1,
    marginTop: -1,
    borderColor: '#CCCCCC',
  },
  cellImage: {
    backgroundColor: '#dddddd',
    height: 80,
    marginRight: 10,
    width: 80,
  },
  rideName: {
    fontFamily: 'Avenir',
    fontWeight: '500',
    fontSize: 15,
    color: '#335485',
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
});

module.exports = RideCell;
