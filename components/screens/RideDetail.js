var React = require('react-native');
var ParseComponent = require('parse-react/class')
var t = require('tcomb-form-native');
var ParseReact = require('parse-react');
var Modal = require('react-native-modal');
var Communications = require('react-native-communications');

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

class Stop extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onViewDetails}>
        <View style={styles.stop}>
          <Text style={styles.stopTime}>{this.props.time}</Text>
          <View style={styles.stopContainer}>
            <Text style={styles.stopLocation}>{this.props.location}</Text>
            <Text style={styles.stopRiders}>2 riders to pickup</Text>
          </View>
          <Button text="RESERVE" onPress={this.props.onReserve} />
        </View>
      </TouchableOpacity>
    );
  }
}

class Rider extends React.Component {
  render() {
    return (
      <View style={styles.rider}>
        <Image
          source={{uri: this.props.picture}}
          style={styles.riderImage}
        />
        <Text style={styles.riderName}>{this.props.name}</Text>
        {!this.props.me?<TouchableOpacity onPress={() => Communications.phonecall('0123456789', false)}>
            <Image style={styles.riderCall} source={require('image!phone-icon')} />
        </TouchableOpacity>:null}
        {!this.props.me?<TouchableOpacity onPress={() => Communications.text('0123456789')}>
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

  doReserve(stop) {
      AlertIOS.alert(
        'Aboard',
        `Your reservation in ${stop} was successful`,
        [
          {
            text: 'OK',
            onPress: () => console.log('Tapped OK'),
          },
        ]
      );
  }

  render() {
    let ride = this.props.ride;
    // var riders = ride.riders;
    // riders.parent = ride;
    // // console.log(po);
    // console.log(ride);

    return (<View style={styles.tabContent}>
        <Modal isVisible={!!this.state.modalStop} onPressBackdrop={() => this.closeModal()} forceToFront={true} backdropType="blur" backdropBlur="dark">
          <Text style={styles.modalHeader}>3 riders at <Text style={{fontWeight:'bold'}}>Polk & Broadway</Text> stop</Text>
          <View style={styles.riders}>
            <Rider me={true} name={this.props.user.get('name')} picture={this.props.user.get('picture')}/>
            <Rider me={false} name={this.props.user.get('name')} picture={this.props.user.get('picture')}/>
          </View>
        </Modal>
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
          <Stop time="10:30 am" location="Polk & Washington" onViewDetails={() => this.openModal('0')} onReserve={() => this.doReserve('0')}/>
          <Stop time="10:45 am" location="301 Howard Street" onViewDetails={() => this.openModal('1')} onReserve={() => this.doReserve('1')}/>
          <View style={styles.finalStop}>
            <Image style={styles.finalStopIcon} source={require('image!location-icon')} />
            <Text style={styles.finalStopName}>Chegg Santa Clara Office</Text>
            <Text style={styles.finalStopLocation}>Chegg Santa Clara Office</Text>
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
