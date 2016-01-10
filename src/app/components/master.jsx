import React from 'react';
import AppLeftNav from './app-left-nav';
import FullWidthSection from './full-width-section';
import {AppBar, AppCanvas, IconButton, EnhancedButton,  Mixins, Styles, Avatar,
        FlatButton, IconMenu, MenuItem,
        Tab, Tabs, Paper, FontIcon} from 'material-ui';

import {ActionFace} from 'material-ui/lib/svg-icons';
// import ActionFace from 'material-ui/lib/svg-icons/action/face';

import md5 from 'md5';
import JSONStorage from '../JSONStorage';
import history from '../history';
import request from '../api-request';

const {StylePropable} = Mixins;
const {Colors, Spacing, Typography} = Styles;
const ThemeManager = Styles.ThemeManager;
const DefaultRawTheme = Styles.LightRawTheme;


const Master = React.createClass({
  mixins: [StylePropable],

  getInitialState() {
    let muiTheme = ThemeManager.getMuiTheme(DefaultRawTheme);
    // To switch to RTL...
    // muiTheme.isRtl = true;
    return {
      muiTheme,
    };
  },

  propTypes: {
    children: React.PropTypes.node,
    history: React.PropTypes.object,
    location: React.PropTypes.object,
  },

  childContextTypes : {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  getStyles() {
    let darkWhite = Colors.darkWhite;
    return {
      footer: {
        backgroundColor: Colors.grey900,
        textAlign: 'center',
      },
      a: {
        color: darkWhite,
      },
      p: {
        margin: '0 auto',
        padding: 0,
        color: Colors.lightWhite,
        maxWidth: 335,
      },
      login: {
        position: 'fixed',
        right: Spacing.desktopGutter / 2,
        top: 8
      },
      noMargin: {
        margin: 0,
        padding: 0,
        left: 0,
        top: 0
      }
    };
  },

  componentWillMount() {
    let newMuiTheme = this.state.muiTheme;
    newMuiTheme.inkBar.backgroundColor = Colors.yellow200;
    this.setState({
      muiTheme: newMuiTheme,
      tabIndex: this._getSelectedIndex()});
    let setTabsState = function() {
      this.setState({renderTabs: !(document.body.clientWidth <= 647)});
    }.bind(this);
    setTabsState();
    window.onresize = setTabsState;
  },

  componentWillReceiveProps(nextProps, nextContext) {
    let newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({
      tabIndex: this._getSelectedIndex(),
      muiTheme: newMuiTheme,
    });
  },

  render() {
    let styles = this.getStyles();

    return (
      <AppCanvas>
        {this.state.renderTabs ? this._getTabs() : this._getAppBar()}
        {this.props.children}
        <AppLeftNav ref="leftNav" history={this.props.history} location={this.props.location} />
        <FullWidthSection style={styles.footer}>
          <p style={this.prepareStyles(styles.p)}>
            Analysis and visualization to help you extract insights from your data with a particular
            strength in temporal data (Temporalize)
          </p>
          <p style={this.prepareStyles(styles.p)}>
            <a style={styles.a} href="http://blog.lumenize.com">Blog</a> -
            <a style={this.prepareStyles(styles.a)}
              href="https://github.com/lmaccherone/Lumenize/graphs/contributors"> Contributors</a>
          </p>
        </FullWidthSection>
      </AppCanvas>
    );
  },

  _getTabs() {
    let styles = {
      root: {
        backgroundColor: DefaultRawTheme.palette.primary1Color,
        position: 'fixed',
        height: 64,
        top: 0,
        right: 0,
        zIndex: 1101,
        width: '100%',
      },
      container: {
        position: 'absolute',
        right: (Spacing.desktopGutter / 2) + 48,
        bottom: 0,
      },
      span: {
        color: Colors.white,
        fontWeight: Typography.fontWeightLight,
        left: 45,
        top: 22,
        position: 'absolute',
        fontSize: 26,
      },
      svgLogoContainer: {
        position: 'fixed',
        width: 300,
        left: Spacing.desktopGutter,
      },
      svgLogo: {
        width: 65,
        backgroundColor: DefaultRawTheme.palette.primary1Color,
        position: 'absolute',
        top: 22,
      },
      tabs: {
        width: 425,
        bottom:0,
      },
      tab: {
        height: 64,
      },

    };

    // The below is commented out because it hides the logo in the upper left on
    // the login page. It's substituted (at least until I can figure out how to
    // show it on the login and sign-up pages without showing it on the home page)
    // by the section below which always shows the logo even on the home page

    // let lumenizeIcon = this.state.tabIndex !== '0' ? (
    //   <EnhancedButton
    //     style={styles.svgLogoContainer}
    //     linkButton={true}
    //     href="/#/home">
    //     <img style={this.prepareStyles(styles.svgLogo)} src="images/material-ui-logo.svg"/>
    //     <span style={this.prepareStyles(styles.span)}>Temporalize</span>
    //   </EnhancedButton>) : null;

    // <img style={this.prepareStyles(styles.svgLogo)} src="images/material-ui-logo.svg"/>
    let lumenizeIcon =
      <EnhancedButton
        style={styles.svgLogoContainer}
        linkButton={true}
        href="/#/home">
        <FontIcon
          className="muidocs-icon-action-home"
          color={DefaultRawTheme.palette.alternateTextColor}
          hoverColor={DefaultRawTheme.palette.accent3Color}
          style={this.prepareStyles(styles.svgLogo)} />
        <span style={this.prepareStyles(styles.span)}>Lumenize</span>
      </EnhancedButton>

    let userOrLogin = this._getUserOrLogin();

    return (
      <div>
        <Paper
          zDepth={0}
          rounded={false}
          style={styles.root}>
          {lumenizeIcon}
          <div style={this.prepareStyles(styles.container)}>
            <Tabs
              style={styles.tabs}
              value={this.state.tabIndex}
              onChange={this._handleTabChange}>
              <Tab
                value="1"
                label="ANALYZE"
                style={styles.tab}
                route="/analyze" />
              <Tab
                value="2"
                label="CONFIG"
                style={styles.tab}
                route="/config"/>
            </Tabs>
          </div>
          {userOrLogin}
        </Paper>
      </div>
    );
  },

  _getSelectedIndex() {
    return this.props.history.isActive('/analyze') ? '1' :
      this.props.history.isActive('/config') ? '2' : '0';  // TODO: This duplicates the number I'm using for Analyze and probably hides something else like home
  },

  _handleTabChange(value, e, tab) {
    this.props.history.pushState(null, tab.props.route);
    this.setState({tabIndex: this._getSelectedIndex()});
  },

  _onTouchUserMenu(e, item) {
    let menuText = e.target.innerText;  // This is probably not the "right" way to get this but couldn't find the proper place
    if (menuText == "Logout") {
      let session = JSONStorage.getItem('session');
      if (session) {
        request('/logout', {sessionID: session.id}, function(err, response) {
          // TODO: Add flare/toast here indicating err or successful logout
          if (err) {
            console.log('Logout failed: ' + JSON.stringify(err));
          };
          JSONStorage.removeItem('session');
          history.push('/');
        });
      };
    } else if (menuText == "Login") {
      history.push('/login');
    } else if (menuText == "Settings") {
      history.push('/config/organization')
    } else {
      throw new Error("Unrecognized user menu item");
    };
  },

  _getUserOrLogin() {
    let session = JSONStorage.getItem('session');
    let styles = this.getStyles();
    let iconButton = null;
    let iconMenu = null;
    if (session) {
      let usernameMD5 = md5(session.user.username);
      let gravatarURL = "http://www.gravatar.com/avatar/" + usernameMD5
      iconButton = (
        <Avatar src={gravatarURL} />
      );
      iconMenu = (
        <IconMenu iconButtonElement={iconButton} style={styles.login} onItemTouchTap={this._onTouchUserMenu}>
          <MenuItem primaryText="Logout" />
          <MenuItem primaryText="Settings" />
        </IconMenu>
      )
    } else {
      iconButton = (
        <Avatar icon={<ActionFace />} />
      );  // Change above to font icon of login symbol
      iconMenu = (
        <IconMenu iconButtonElement={iconButton} style={styles.login} onItemTouchTap={this._onTouchUserMenu}>
          <MenuItem primaryText="Login" />
        </IconMenu>
      )
    };
    return iconMenu;
  },

  _getAppBar() {
    let title =
      this.props.history.isActive('/analyze') ? 'Analyze' :
      this.props.history.isActive('/config') ? 'Config' : '';

    let userOrLogin = this._getUserOrLogin();

    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
          title={title}
          zDepth={0}
          iconElementRight={userOrLogin}
          style={{position: 'absolute', top: 0}} />
      </div>
    );
  },

  _onLeftIconButtonTouchTap() {
    this.refs.leftNav.toggle();
  },
});

export default Master;