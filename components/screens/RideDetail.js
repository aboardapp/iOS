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
  ListView
} = React;


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

    // console.log('RIDE', this.data.ride);
    return (<View style={styles.tabContent}><Text>My Rides{ride} </Text></View>);
  }
}

var styles = StyleSheet.create({
  tabContent: {
    paddingTop: 64,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
});


module.exports = RideDetail;
