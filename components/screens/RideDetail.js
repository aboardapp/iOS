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
  MapView
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
    let ride = this.data.ride;
    // var riders = ride.riders;
    // riders.parent = ride;
    // // console.log(po);
    // console.log(ride);

    return (<View style={styles.tabContent}>
        <MapView
          style={styles.map}
          region={region} />
    </View>);
  }
}

var styles = StyleSheet.create({
  tabContent: {
    paddingTop: 64,
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 210,
    marginBottom: 10,
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
});


module.exports = RideDetail;
