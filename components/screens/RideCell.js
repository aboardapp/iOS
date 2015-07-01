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
    let seats = ride.seats;
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
              <Text style={styles.stops}>SF - Santa Clara</Text>
            </View>
            <Text style={styles.seats}>{seats}</Text>
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
    borderRightWidth: 0,
    borderLeftWidth: 0,
    marginBottom: -1,
    borderColor: '#dddddd',
  },
  cellImage: {
    backgroundColor: '#dddddd',
    height: 80,
    marginRight: 10,
    width: 80,
  },
  rideName: {
    fontFamily: 'Avenir',
    fontWeight: '600',
    fontSize: 15,
    color: '#335485',
  },
  stops: {
    fontFamily: 'Avenir',
    fontWeight: '500',
    fontSize: 13,
    color: '#999999',

  },
  seats: {
    fontFamily: 'Avenir',
    fontWeight: '700',
    fontSize: 15,
    color: '#335485',
    alignSelf: "center",
    textAlign: "center",
    width: 50,
  },

  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
});

module.exports = RideCell;
