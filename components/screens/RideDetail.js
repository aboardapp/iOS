var React = require('react-native');
var ParseComponent = require('parse-react/class')
var t = require('tcomb-form-native');
var ParseReact = require('parse-react');

var Form = t.form.Form;
var {
  NavigatorIOS,
  View,
  Text,
  Image,
  StyleSheet,
  AlertIOS,
  TabBarIOS,
  ListView,
  MapView,
  ScrollView
} = React;

var region = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0,
  longitudeDelta: 0,
};


class RideDetail extends ParseComponent {
  constructor (props) {
    super(props);
  }
  observe(props, state) {
    return {
      ride: props.ride
    };
  }
  componentDidMount() {
    // let ride = this.data.ride;
    // console.log(ride);
    // super.componentDidMount();
    // ParseReact.Mutation.AddRelation(ride, 'riders', this.props.user.id).dispatch();
    // this.refreshQueries();
  }

  render() {
    let ride = this.props.ride;
    // var riders = ride.riders;
    // riders.parent = ride;
    // // console.log(po);
    // console.log(ride);

    return (<View style={styles.tabContent}>
        <MapView
          style={styles.map}
          region={region} />
          <ScrollView style={styles.scroll} automaticallyAdjustContentInsets={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View style={styles.headerInfo}>
                <Text style={styles.name}>{ride.ride.name}</Text>
                <Text style={styles.date}>Wednesday, June 30</Text>
                <Text style={styles.driverName}>Driver: {ride.ride.driver.name}</Text>
              </View>
              <View style={styles.headerSeats}>
                <Text style={styles.numSeats}>{ride.ride.seats}</Text>
                <Text style={styles.numSeatsLeft}>Seats left</Text>
              </View>
          </View>
          <View style={styles.stopsHeader}>
            <Text style={styles.stopsHeaderText}>2 stops in this ride</Text>
          </View>
          <View style={styles.stop}>
          </View>
        </ScrollView>
    </View>);
  }
}

var styles = StyleSheet.create({
  tabContent: {
    paddingTop: 64,
    flex: 1,
    alignItems: 'stretch'
  },
  map: {
    // flex: 1,
    // height: 240,
    position: 'absolute',
    left: 0,
    right: 0,
    height: 400,
  },
  header: {
    padding: 15,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontFamily: 'Avenir',
    fontSize: 24,
    color: '#333333'
  },
  scroll: {
    position: 'absolute',
    top: 0,
    paddingTop: 240,
    flex: 1,
    bottom: 0,
    left: 0,
    backgroundColor: 'transparent',
    right: 0,
  },
  date: {
    fontFamily: 'Avenir',
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },
  driverName: {
    fontFamily: 'Avenir',
    fontSize: 13,
    fontWeight: '400',
    color: '#999999',
  },
  scrollContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: {
      height: -4,
      width: 0
    },
  },
  headerSeats: {
    borderLeftColor: '#F5F5F5',
    borderLeftWidth: 1,
    marginLeft: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  numSeats: {
    fontFamily: 'Avenir',
    fontSize: 30,
    fontWeight: '800',
    color: '#335485',
    textAlign: 'center',
  },
  numSeatsLeft: {
    fontFamily: 'Avenir',
    fontSize: 13,
    fontWeight: '300',
    color: '#999999',
    textAlign: 'center',
  },
  stopsHeader: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  stopsHeaderText: {
    fontFamily: 'Avenir',
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
  },
});


module.exports = RideDetail;
