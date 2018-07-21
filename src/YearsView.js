'use strict';

var React = require('react'),
	createClass = require('create-react-class'),
	onClickOutside = require('react-onclickoutside').default
	;

var DateTimePickerYears = onClickOutside( createClass({
	render: function() {
		var date = this.props.viewDate,
			year = this.getYear(date),
			headerRenderer = this.props.renderHeader || this.renderHeader;

		var headerProps = {
			view: 'years',
			year: year,
			showView: this.props.showView,
			subtractTime: this.props.subtractTime,
			addTime: this.props.addTime,
			viewDate: date
		};
			
		return React.createElement('div', { className: 'rdtYears' }, [
			React.createElement('table', { key: 'a' }, React.createElement('thead', {}, React.createElement('tr', {}, headerRenderer(headerProps)))),
			React.createElement('table', { key: 'years' }, React.createElement('tbody',  {}, this.renderYears( this.getYear(date) )))
		]);
	},

	getYear: function(date) {
		return parseInt( date.year() / 10, 10 ) * 10;
	},

	renderHeader: function(props) {
		return [
			React.createElement('th', { key: 'prev', className: 'rdtPrev', onClick: props.subtractTime( 10, 'years' )}, React.createElement('span', {}, '‹' )),
			React.createElement('th', { key: 'year', className: 'rdtSwitch', onClick: props.showView( 'years' ), colSpan: 2 }, props.year + '-' + ( props.year + 9 ) ),
			React.createElement('th', { key: 'next', className: 'rdtNext', onClick: props.addTime( 10, 'years' )}, React.createElement('span', {}, '›' ))
		];
	},

	renderYears: function( year ) {
		var years = [],
			i = -1,
			rows = [],
			renderer = this.props.renderYear || this.renderYear,
			selectedDate = this.props.selectedDate,
			isValid = this.props.isValidDate || this.alwaysValidDate,
			classes, props, currentYear, isDisabled, noOfDaysInYear, daysInYear, validDay,
			// Month and date are irrelevant here because
			// we're only interested in the year
			irrelevantMonth = 0,
			irrelevantDate = 1
			;

		year--;
		while (i < 11) {
			classes = 'rdtYear';
			currentYear = this.props.viewDate.clone().set(
				{ year: year, month: irrelevantMonth, date: irrelevantDate } );

			// Not sure what 'rdtOld' is for, commenting out for now as it's not working properly
			// if ( i === -1 | i === 10 )
				// classes += ' rdtOld';

			noOfDaysInYear = currentYear.endOf( 'year' ).format( 'DDD' );
			daysInYear = Array.from({ length: noOfDaysInYear }, function( e, i ) {
				return i + 1;
			});

			validDay = daysInYear.find(function( d ) {
				var day = currentYear.clone().dayOfYear( d );
				return isValid( day );
			});

			isDisabled = ( validDay === undefined );

			if ( isDisabled )
				classes += ' rdtDisabled';

			if ( selectedDate && selectedDate.year() === year )
				classes += ' rdtActive';

			props = {
				key: year,
				'data-value': year,
				className: classes
			};

			if ( !isDisabled )
				props.onClick = ( this.props.updateOn === 'years' ?
					this.updateSelectedYear : this.props.setDate('year') );

			years.push( renderer( props, year, selectedDate && selectedDate.clone() ));

			if ( years.length === 4 ) {
				rows.push( React.createElement('tr', { key: i }, years ) );
				years = [];
			}

			year++;
			i++;
		}

		return rows;
	},

	updateSelectedYear: function( event ) {
		this.props.updateSelectedDate( event );
	},

	renderYear: function( props, year ) {
		return React.createElement('td',  props, year );
	},

	alwaysValidDate: function() {
		return 1;
	},

	handleClickOutside: function() {
		this.props.handleClickOutside();
	}
}));

module.exports = DateTimePickerYears;
