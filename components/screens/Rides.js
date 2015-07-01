var React = require('react-native');
var ParseComponent = require('parse-react/class')
var t = require('tcomb-form-native');

var RideCell = require('./RideCell');
var Profile = require('./Profile');
var RideDetail = require('./RideDetail');

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


class Explore extends ParseComponent {
  constructor (props) {
    super(props);
    this.state = {
    };
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }

  observe(props, state) {
    return {
      items: new Parse.Query('CommissionedRide').include(["ride","ride.driver"]).ascending('date')
    };
  }

  selectRide(ride) {
    this.props.navigator.push({
      title: ride.ride.name,
      component: RideDetail,
      passProps: { ride: ride, user:this.props.user }
    });
  }

  render() {
    console.log('ITEMS', this.data.items);
    return (
      <ListView
        dataSource={this.ds.cloneWithRows(this.data.items)}
        style={{paddingTop:0}}
        renderRow={(rowData) => <RideCell model={rowData} onSelect={() => this.selectRide(rowData)} />}
      />
    );
  }
}

class MainRides extends React.Component {
  constructor () {
    super();
    this.state = {
      selectedTab: 'explore'
    };
  }

  _renderContent(color, pageText) {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>{pageText}</Text>
        <Text style={styles.tabText}>{this.state.presses} re-renders of the More tab</Text>
      </View>
    );
  }

  _renderRides() {
    return <Explore user={this.props.user} />;
  }
  _renderMyRides() {
    return (<Text>My Rides</Text>);
  }
  _renderProfile() {
    return (<Profile user={this.props.user} signup={false} />);
  }
  render() {
    return (
      <TabBarIOS
        tintColor="#335485"
        barTintColor="white">
        <TabBarIOS.Item
          systemIcon="search"
          title="Rides"
          selected={this.state.selectedTab === 'explore'}
          onPress={() => {
            this.setState({
              selectedTab: 'explore',
            });
          }}>
          <NavigatorIOS
            style={styles.container}
            barTintColor="#335485"
            titleTextColor="#FFFFFF"
            tintColor="#FFFFFF"
            itemWrapperStyle={styles.navContainer}
            initialRoute={{
              title: 'Rides',
              component: Explore,
            }}/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          systemIcon="favorites"
          selected={this.state.selectedTab === 'myrides'}
          onPress={() => {
            this.setState({
              selectedTab: 'myrides',
            });
          }}>
          {this._renderMyRides()}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          systemIcon="contacts"
          selected={this.state.selectedTab === 'profile'}
          title="My Profile"
          onPress={() => {
            this.setState({
              selectedTab: 'profile'
            });
          }}>
          {this._renderProfile()}
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
  navContainer: {
  },
  container: {
    flex: 1,
  }
});


module.exports = MainRides;
