var React = require('react-native');
var ParseComponent = require('parse-react/class')
var t = require('tcomb-form-native');

var RideCell = require('./RideCell')

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
  constructor () {
    super();
    this.state = {
    };
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }

  observe(props, state) {
    return {
      items: new Parse.Query('Ride').ascending('createdAt')
    };
  }

  selectRide(ride) {
    alert('select ride');
  }

  render() {
    return (
      <ListView
        dataSource={this.ds.cloneWithRows(this.data.items)}
        renderRow={(rowData) => <RideCell {...rowData} onSelect={() => this.selectRide(rowData)} />}
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
    return <Explore />;
  }
  _renderMyRides() {
    return (<Text>My Rides</Text>);
  }
  _renderProfile() {
    return (<Text>Profile</Text>);
  }
  render() {
    return (
      <TabBarIOS
        tintColor="blue"
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
          systemIcon="more"
          selected={this.state.selectedTab === 'profile'}
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
});


module.exports = MainRides;
