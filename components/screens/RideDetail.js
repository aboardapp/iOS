var React = require('react-native');
var ParseComponent = require('parse-react/class')
var t = require('tcomb-form-native');
var ParseReact = require('parse-react');
var Modal = require('react-native-modal');
var Communications = require('react-native-communications');
var moment = require('moment');
var _ = require('underscore');

var Button = require('../Button');

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
  ScrollView,
  TouchableOpacity
} = React;

var region = {
  latitude: 37.7833,
  longitude: -122.4167,
  latitudeDelta: .1,
  longitudeDelta: .1,
};

function convert_to_24h(time_str) {
    // Convert a string like 10:05:23 PM to 24h format, returns like [22,5,23]
    var time = time_str.match(/(\d+):(\d+)\s?(\w)/);
    var hours = Number(time[1]);
    var minutes = Number(time[2]);
    var meridian = time[3].toLowerCase();

    if (meridian == 'p' && hours < 12) {
      hours = hours + 12;
    }
    else if (meridian == 'a' && hours == 12) {
      hours = hours - 12;
    }
    if (minutes<10) {minutes = '0'+minutes};
    var x = Number([hours, minutes].join(''));
    console.log(x);
    return x;
  };

class Stop extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onViewDetails}>
        <View style={styles.stop}>
          <Text style={styles.stopTime}>{this.props.time}</Text>
          <View style={styles.stopContainer}>
            <Text style={styles.stopLocation}>{this.props.location}</Text>
            <Text style={styles.stopRiders}>{this.props.riders.length} riders to pickup</Text>
          </View>
          {this.props.canReserve?<Button text="RESERVE" onPress={this.props.onReserve} />:null}
        </View>
      </TouchableOpacity>
    );
  }
}

class Rider extends React.Component {
  render() {
    let phone = ''+this.props.phone;
    return (
      <View style={styles.rider}>
        <Image
          source={{uri: this.props.picture}}
          style={styles.riderImage}
        />
        <Text style={styles.riderName}>{this.props.name}</Text>
        {!this.props.me?<TouchableOpacity onPress={() => Communications.phonecall(phone, false)}>
            <Image style={styles.riderCall} source={require('image!phone-icon')} />
        </TouchableOpacity>:null}
        {!this.props.me?<TouchableOpacity onPress={() => Communications.text(phone)}>
            <Image style={styles.riderChat} source={require('image!chat-icon')} />
        </TouchableOpacity>:null}
        {this.props.me?<TouchableOpacity>
          <Text style={styles.riderCancel}>Cancel</Text>
        </TouchableOpacity>:null}
      </View>
      
    );
  }
}

class RideDetail extends ParseComponent {
  constructor() {
    super();
    this.state = {
      modalStop: false
    };
  }

  openModal(stop) {
    this.setState({modalStop: stop});
  }

  closeModal() {
    this.setState({modalStop: false});
  }

  observe(props, state) {
    var riders = props.instance.relation('riders').query();
    var stops = props.instance.get('ride').relation('stops').query();
    // console.log('RIDERS', props.instance.relation('riders'));
    return {
      riders: riders,
      stops: stops
    };
  }
  // componentDidMount() {
  //   // let ride = this.data.ride;
  //   console.log('componentDidMount', this.data.riders);
  //   super.componentDidMount();
  //   // ParseReact.Mutation.AddRelation(ride, 'riders', this.props.user.id).dispatch();
  //   // this.refreshQueries();
  // }
  getStop(stopId) {
    return _.find(this.data.stops, (stop) => stop.objectId == stopId);
  }

  canReserve(stopId) {
    return !_.find(this.data.riders, (rider) => rider.objectId == this.props.user.id);
  }

  doReserve(stop) {
      this.props.instance.relation('riders').add(this.props.user);
      stops_riders = _.clone(this.props.ride);
      stops_riders[stop] = stops_riders[stop] || [];
      stops_riders[stop].push(this.props.user.objectId);
      this.props.instance.set('stops_riders', stops_riders);

      this.props.instance.save(null, () =>
        this.refreshQueries()
      );
      AlertIOS.alert(
        'Aboard',
        `Your reservation in ${this.getStop(stop).name} was successful`,
        [
          {
            text: 'OK',
            onPress: () => console.log('Tapped OK'),
          },
        ]
      );
  }

  ridersForStop(stopId) {
    var riderStops = this.props.ride.stops_riders[stopId] || [];
    return riderStops.map(this.getRider.bind(this));
  }

  getRider(riderId) {
    return _.find(this.data.riders, (rider) => rider.objectId == riderId);
  }

  render() {
    let ride = this.props.ride;
    let instance = this.props.instance;
    // console.log('RENDER data', this.data, instance)
    // var riders = ride.riders;
    // riders.parent = ride;
    // // console.log(po);
    // console.log(ride);
    var all_stops = this.data.stops.slice();
    all_stops.sort((a,b) => convert_to_24h(a.time) > convert_to_24h(b.time));
    var stops = all_stops.slice(0,-1);
    var final_stop = all_stops.length?all_stops[all_stops.length-1]:{};

    var fullRiderStops = _.object(_.map(all_stops, (value) =>
      [value.objectId, this.ridersForStop(value.objectId)]
    ));

    if (stops.length) this.ridersForStop(stops[0].objectId);

    return (<View style={styles.tabContent}>
        <Modal isVisible={!!this.state.modalStop} onPressBackdrop={() => this.closeModal()} forceToFront={true} backdropType="blur" backdropBlur="dark">
          <Text style={styles.modalHeader}>3 riders at <Text style={{fontWeight:'bold'}}>Polk & Broadway</Text> stop</Text>
          <View style={styles.riders}>
            {this.state.modalStop && fullRiderStops[this.state.modalStop].map((rider)=>
              <Rider me={rider.objectId == this.props.user.id} name={rider.name} picture={rider.picture} phone={rider.phone}/>
            )}
          </View>
        </Modal>
        <MapView
          style={styles.map}
          region={region} />
          <ScrollView style={styles.scroll} automaticallyAdjustContentInsets={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View style={styles.headerInfo}>
                <Text style={styles.name}>{ride.ride.name}</Text>
                <Text style={styles.date}>{moment(ride.date).format('dddd, LL')}</Text>
                <Text style={styles.driverName}>Driver: {ride.ride.driver.name}</Text>
              </View>
              <View style={styles.headerSeats}>
                <Text style={styles.numSeats}>{ride.ride.seats - this.data.riders.length}</Text>
                <Text style={styles.numSeatsLeft}>Seats left</Text>
              </View>
          </View>
          <View style={styles.stopsHeader}>
            <Text style={styles.stopsHeaderText}>{this.data.stops.length-1} stops in this ride</Text>
          </View>
          {stops.map((stop) =>
            <Stop time={stop.time} canReserve={this.canReserve()} location={stop.name} riders={fullRiderStops[stop.objectId]} onViewDetails={() => this.openModal(stop.objectId)} onReserve={() => this.doReserve(stop.objectId)} />
          )}
          <View style={styles.finalStop}>
            <Image style={styles.finalStopIcon} source={require('image!location-icon')} />
            <Text style={styles.finalStopName}>{final_stop.name}</Text>
            <Text style={styles.finalStopLocation}>{final_stop.address}</Text>
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
    top: -160,
    left: 0,
    right: 0,
    height: 600,
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
    flex: 1,
    bottom: -15,
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
    marginTop: 240,
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
    fontWeight: '700',
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
  stop: {
    borderWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    marginBottom: -1,
    padding: 15,
    paddingTop: 20,
    paddingBottom: 20,
    borderColor: '#dddddd',
    alignItems: 'center',
    flexDirection: 'row',
  },
  finalStop: {
    borderWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    marginBottom: -1,
    padding: 15,
    paddingTop: 20,
    paddingBottom: 20,
    borderColor: '#dddddd',
    paddingLeft: 90,
  },
  stopTime: {
    fontFamily: 'Avenir',
    fontSize: 13,
    fontWeight: '300',
    width: 75,
    color: '#999999',
  },
  stopContainer: {
    flex: 1
  },
  stopLocation: {
    fontFamily: 'Avenir',
    fontSize: 15,
    fontWeight: '600',
    color: '#335485',
  },
  stopRiders: {
    fontFamily: 'Avenir',
    fontSize: 13,
    fontWeight: '400',
    color: '#999999',
  },
  finalStopName: {
    fontFamily: 'Avenir',
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  finalStopLocation: {
    fontFamily: 'Avenir',
    fontSize: 13,
    fontWeight: '400',
    color: '#999999',
  },
  modalHeader: {
    margin: 10,
    fontFamily: 'Avenir',
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 30,
  },
  finalStopIcon: {
    position: 'absolute',
    top: 23,
    width: 22,
    left: 30,
    height: 31,
  },
  rider: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -1,
  },
  riders: {
    borderTopWidth: 1,
    borderTopColor: 'blue',
  },
  riderImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 15,
  },
  riderName: {
    fontFamily: 'Avenir',
    fontSize: 16,
    flex: 1,
    color: '#333333',
  },
  riderCall: {
    width: 18,
    height: 18,
    marginLeft: 10,
    marginRight: 10,
  },
  riderChat: {
    width: 18,
    height: 18,
    marginLeft: 10,
    marginRight: 10,
  },
  riderCancel: {
    fontFamily: 'Avenir',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    color: '#335485',
  },
});


module.exports = RideDetail;
