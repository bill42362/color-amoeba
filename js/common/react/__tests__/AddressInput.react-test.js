jest.dontMock('../AddressInput.react.js');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const AddressInput = require('../AddressInput.react.js');

describe('AddressInput', () => {
	it('Show town options according to props.city.', () => {
		var address = {zipCode: '', city: '縣市', address: ''};
		var onAddressChange = function(zipCode, city, _address) {
			address.city = city;
			address.zipCode = zipCode;
			if(undefined != zipCode) {
				address.address = _address;
			} else {
				address.address = '';
			}
		}
		var addressInput = TestUtils.renderIntoDocument(<AddressInput
			zipCode={address.zipCode} city={'基隆市'}
			address={address.address} parentOnAddressChange={onAddressChange}
		/>);
		var postcodeTable  = addressInput.postcodeTable;
		var townSelect = addressInput.refs.town;
		var townOptions = townSelect.getElementsByTagName('option');
		expect(townOptions.length).toEqual(7);
	});
});
