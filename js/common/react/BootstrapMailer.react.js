// BootstrapMailer.react.js
var React = require('react');
var ClassNames = require('classnames');
var BootstrapInput = require('./BootstrapInput.react.js');
var BootstrapTinyMCE = require('./BootstrapTinyMCE.react.js');
var BootstrapButton = require('./BootstrapButton.react.js');
var BootstrapMailer = React.createClass({
    getInitialState: function() {
        return {
            mail: {receivers: [], subject: '', content: '',},
            shouldCallOnChange: false,
        };
    },
    staticStrings: {
        receiver: {string: '收件者', context: 'Label for mail receiver.'},
        subject: {string: '信件主旨', context: 'Label for mail subject to user.'},
        content: {string: '信件內容', context: 'Label for mail content to user.'},
        send: {string: '寄出', context: 'Display of send mail button.'},
        reset: {string: '清空', context: 'Display of reset mail button.'},
    },
    getValue: function() { return this.state.mail; },
    onChange: function() {
        var mail = this.state.mail;
        mail.subject = this.refs.subject.getValue();
        mail.content = this.refs.content.getValue();
        this.setState({mail: mail, shouldCallOnChange: true});
    },
    addReceiver: function(display, email, data) {
        var mail = this.state.mail;
        var isReceiverRepeated = false;
        mail.receivers.map(function(receiver) {
            if(email === receiver.email) { isReceiverRepeated = true; }
        }, this);
        if(!isReceiverRepeated) {
            mail.receivers.push({display: display, email: email, data: data});
            this.setState({mail: mail, shouldCallOnChange: true});
        }
    },
    addReceivers: function(receivers) {
        receivers.forEach(function(receiver) { this.addReceiver(receiver); }, this);
    },
    reset: function() {
        this.setState({
            mail: {receivers: [], subject: '', content: ''},
            shouldCallOnChange: true
        });
    },
    removeReceiver: function(e) {
        var mail = this.state.mail;
        var email = e.target.parentNode.getAttribute('data-email');
        var indexOfEmail = -1;
        mail.receivers.forEach(function(receiver, index) {
            if(email === receiver.email) { indexOfEmail = index; }
        }, this);
        if(-1 != indexOfEmail) {
            mail.receivers.splice(indexOfEmail, 1);
            this.setState({mail: mail, shouldCallOnChange: true});
        }
    },
    onMouseOverRemover: function(e) { e.target.parentNode.className += ' danger'; },
    onMouseLeaveRemover: function(e) {
        var className = e.target.parentNode.className;
        e.target.parentNode.className = className.replace(/ danger/ig, '');
    },
    componentDidUpdate: function(prevProps, prevState) {
        var isReceiversEqual = function(a, b) {
            return (a.email === b.email) && (a.display === b.display)
                && (JSON.stringify(a.data) === JSON.stringify(b.data));
        }
        var props = this.props, state = this.state;
        var isReceiversChanged = false;
        prevProps.mail.receivers.map(function(receiver, index) {
            if(!isReceiversEqual(receiver, props.mail.receivers[index])) {
                isReceiversChanged = true;
            }
        }, this);
        var isSubjectChanged = prevProps.mail.subject != props.mail.subject;
        var isContentChanged = prevProps.mail.content != props.mail.content;
        if(isReceiversChanged || isSubjectChanged || isContentChanged) {
            this.setState({mail: props.mail});
        }
        if(state.shouldCallOnChange && props.onChange) {
            this.setState({shouldCallOnChange: false});
            props.onChange(this.getValue());
        }
    },
    render: function() {
        var strings = this.staticStrings;
        var mail = this.props.mail;
        return <div className='bootstrap-mailer row'>
            <div className='col-md-12'>
                <div className='receivers panel panel-default' title={strings.receiver.string}>
                    <div className='panel-body'>
                        {mail.receivers.map(function(receiver, index) {
                            return <label
                                className='label label-primary' key={index}
                                title={receiver.email} data-email={receiver.email}
                            >
                                {receiver.display}<span> </span>
                                <span
                                    className="glyphicon glyphicon-remove" aria-hidden="true"
                                    onClick={this.removeReceiver}
                                    onMouseOver={this.onMouseOverRemover}
                                    onMouseLeave={this.onMouseLeaveRemover}
                                ></span>
                            </label>;
                        }, this)}
                    </div>
                </div>
            </div>
            <BootstrapInput
                ref='subject' gridWidth={'12'} type={'text'}
                label={strings.subject.string} labelHidden={true}
                title={strings.subject.string}
                value={mail.subject} onChange={this.onChange}
            />
            <BootstrapTinyMCE
                ref='content' gridWidth={'12'}
                label={strings.content.string} labelHidden={true}
                config={{
                    autoresize_max_height: 500,
                    autoresize_min_height: 0,
                    autoresize_bottom_margin: 0,
                    menubar: false,
                    statusbar: false,
                    plugins: 'advlist lists link image code preview media autoresize',
                    toolbar_items_size: 'small',
                    toolbar: 'undo redo'
                        + ' | bold italic underline strikethrough removeformat'
                        + ' | subscript superscript'
                        + ' | alignleft aligncenter alignright'
                        + ' | bullist numlist outdent indent formatselect'
                        + ' | link image media'
                        + ' | code preview'
                }}
                value={mail.content} onChange={this.onChange}
            />
            <BootstrapButton
                gridWidth={'6'}
                label={strings.send.string} labelHidden={true}
                title={strings.send.string} status={this.props.status}
                onClick={this.props.send}
            />
            <BootstrapButton
                gridWidth={'6'}
                label={strings.reset.string} labelHidden={true}
                title={strings.reset.string} status={'danger'}
                onClick={this.reset}
            />
        </div>;
    }
});

module.exports = BootstrapMailer;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
