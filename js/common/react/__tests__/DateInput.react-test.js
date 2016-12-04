jest.dontMock('../DateInput.react.js');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const DateInput = require('../DateInput.react.js');

describe('DateInput', () => {
	it('shows error messages for unfilled option.', () => {
		var noErrorData1 = {year: '', month: '', date: ''};
		var noErrorData2 = {year: '1900', month: '2', date: '1'};
		var dateErrorData = {year: '1900', month: '2', date: ''};
		var monthErrorData = {year: '1900', month: '', date: '1'};
		var yearErrorData = {year: '', month: '2', date: '1'};
		function applyDataToSection(section, data) {
			var yearSelect = section.refs.year;
			yearSelect.value = data.year;
			TestUtils.Simulate.change(yearSelect);

			var monthSelect = section.refs.month;
			monthSelect.value = data.month;
			TestUtils.Simulate.change(monthSelect);

			var daySelect = section.refs.day;
			daySelect.value = data.date;
			TestUtils.Simulate.change(daySelect);
		}
		var dateInput = TestUtils.renderIntoDocument(<DateInput yearRange={[1900, 2000]} />);
		var dayOptions = undefined;

		applyDataToSection(dateInput, noErrorData1);
		expect(dateInput.refs.errorMessage).toEqual(undefined);

		applyDataToSection(dateInput, noErrorData2);
		expect(dateInput.refs.errorMessage).toEqual(undefined);

		applyDataToSection(dateInput, dateErrorData);
		expect(dateInput.refs.errorMessage.textContent).toEqual('請選擇日期');

		applyDataToSection(dateInput, monthErrorData);
		expect(dateInput.refs.errorMessage.textContent).toEqual('請選擇月份');

		applyDataToSection(dateInput, yearErrorData);
		expect(dateInput.refs.errorMessage.textContent).toEqual('請選擇年份');
	});
	it('Change month and day list when year changed.', () => {
		var successData = { year: '1900', month: '2', dayLength: 28 };
		var unsuccessData = { year: '2000', month: '2', dayLength: 28 };
		function applyDataToSection(section, data) {
			var yearSelect = section.refs.year;
			yearSelect.value = data.year;
			TestUtils.Simulate.change(yearSelect);

			var monthSelect = section.refs.month;
			monthSelect.value = data.month;
			TestUtils.Simulate.change(monthSelect);
		}
		var dateInput = TestUtils.renderIntoDocument(<DateInput yearRange={[1900, 2000]} />);
		var dayOptions = undefined;

		dayOptions = dateInput.refs.day.getElementsByTagName('option');
		expect(dayOptions.length).toEqual(29);

		applyDataToSection(dateInput, successData);
		dayOptions = dateInput.refs.day.getElementsByTagName('option');
		expect((dayOptions.length === (successData.dayLength + 1))).toEqual(true);

		applyDataToSection(dateInput, unsuccessData);
		dayOptions = dateInput.refs.day.getElementsByTagName('option');
		expect((dayOptions.length === (unsuccessData.dayLength + 1))).toEqual(false);
	});
});
