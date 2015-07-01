var React = require('react-native');
var ParseComponent = require('parse-react/class')

var {
  NavigatorIOS,
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
  PixelRatio,
  Image
} = React;


class RideCell extends ParseComponent {
  observe(props, state) {
    var riders = props.instance.relation('riders').query();
    var stops = props.instance.get('ride').relation('stops').query();
    // console.log('RIDERS', props.instance.relation('riders'));
    return {
      riders: riders,
      stops: stops
    };
  }
  render() {
    console.log('INSTANCE', this.props.instance)
    let model = this.props.model;
    let ride = model.ride;
    let riders = model.riders;
    let picture = ride.driver && ride.driver.picture;
    let seats = ride.seats-this.data.riders.length;
    let stopsStr = this.data.stops.map((stop) => stop.name).join('-')
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
              <Text style={styles.stops}>{stopsStr}</Text>
            </View>
            <Text style={styles.seats}>{seats}/{ride.seats}</Text>
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
    width: 72,
    height: 72,
    marginRight: 10,
    // height: 60,
    // margin: 10,
    // width: 60,
    // borderRadius: 30,
  },
  rideName: {
    fontFamily: 'Avenir',
    fontWeight: '700',
    fontSize: 16,
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
