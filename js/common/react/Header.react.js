// Header.react.js
var ClassNames = require('classnames');
var Header = React.createClass({
    getInitialState: function() { return { collapsed: true, }; },
    logout: function() { window.location.assign('/admin/logout'); },
    onExpendToggleClicked: function() { this.setState({collapsed: !this.state.collapsed}); },
    render: function() {
        var collapsed = this.state.collapsed;
        var canViews = { battleLog: true};
        var pathname = location.pathname;
        var navItems = [
            {shouldDisplay: canViews.battleLog, href: '/battle-log.html', display: 'Battle Log'},
        ];
        return <header id="header">
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container-fluid">
                    <div className='navbar-header'>
                        <a className='navbar-brand' href="#">Elemental Fight</a>
                        <button
                            className='navbar-toggle' data-toggle='collapse'
                            type='button' aria-expended={!collapsed} onClick={this.onExpendToggleClicked}
                        ><span className='glyphicon glyphicon-align-justify'></span></button>
                    </div>
                    <div
                        className={ClassNames('navbar-collapse collapse', {'in': !collapsed})}
                        aria-expended={!collapsed}
                    >
                        <ul className="nav navbar-nav">
                            {navItems.map(function(item, index) {
                                if(item.shouldDisplay) {
                                    return <li
                                        className={ClassNames('nav-item', {'active': 0 === pathname.indexOf(item.href)})}
                                        key={index}
                                    >
                                        <a className='nav-link' href={item.href}>{item.display}</a>
                                    </li>
                                }
                            })}
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li className="nav-item">
                                <button
                                    type="button" className="btn btn-danger navbar-btn"
                                    onClick={this.logout}
                                >Signout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>;
    }
});
module.exports = Header;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
