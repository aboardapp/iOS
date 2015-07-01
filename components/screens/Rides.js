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
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (h1, h2) => h1 !== h2,
    });
  }

  observe(props, state) {
    var items = new Parse.Query('CommissionedRide').include(["ride","ride.driver"]).ascending('date');
    var owned = new Parse.Query('CommissionedRide').equalTo('riders', props.user).include(["ride","ride.driver"]).ascending('date');
    var driving = new Parse.Query('CommissionedRide').equalTo('ride.driver', props.user).ascending('date');
    if (props.favorites) {
      return {
        owned: owned,
        driving: driving
      };
    }
    return {
      items: items
    };
  }

  selectRide(ride) {
    this.props.navigator.push({
      title: ride.ride.name,
      component: RideDetail,
      passProps: { ride: ride, user:this.props.user, stops: ride.stops }
    });
  }

  _getDataSource() {
    if (this.props.favorites) {
      return this.ds.cloneWithRowsAndSections({
        'As a rider':this.data.owned,
        'As a driver': this.data.driving
      });
    }
    return this.ds.cloneWithRowsAndSections({today:this.data.items});
  }
  render() {
    return (
      <ListView
        dataSource={this._getDataSource()}
        style={{paddingTop:0}}
        renderSectionHeader={this._renderSectionHeader}
        renderRow={(rowData) => <RideCell model={rowData} onSelect={() => this.selectRide(rowData)} />}
      />
    );
  }

  _renderSectionHeader(data, section) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderTitle}>
          {section.toUpperCase()}
        </Text>
      </View>
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
    return (
      <NavigatorIOS
        style={styles.container}
        barTintColor="#335485"
        titleTextColor="#FFFFFF"
        tintColor="#FFFFFF"
        itemWrapperStyle={styles.navContainer}
        initialRoute={{
          title: 'Rides',
          component: Explore,
          passProps: { user: this.props.user},
        }}/>
    );
  }

  _renderMyRides() {
    return (
      <NavigatorIOS
        style={styles.container}
        barTintColor="#335485"
        titleTextColor="#FFFFFF"
        tintColor="#FFFFFF"
        itemWrapperStyle={styles.navContainer}
        initialRoute={{
          title: 'My Rides',
          component: Explore,
          passProps: { user: this.props.user, favorites: true},
        }}/>
    );
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
          {this._renderRides()}
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
  },
  sectionHeader: {
    padding: 5,
    backgroundColor: '#EEEEEE',
  },
  group: {
    backgroundColor: 'white',
  },
  sectionHeaderTitle: {
    fontWeight: '500',
    fontSize: 11,
  },
});


module.exports = MainRides;
