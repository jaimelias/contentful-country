import React from 'react';
import '@contentful/forma-36-react-components/dist/styles.css';
import {Select} from '@contentful/forma-36-react-components';
import {defaultState} from './defaultState.js';
import {getCountriesAsArr, getOptions} from './utilities.js';

class Field extends React.Component {
	constructor(props){
		super(props);
		const {sdk} = props;
		const value = sdk.field.getValue();
		this.state = (value) ? value : defaultState;
		this.handleCountryChange = this.handleCountryChange.bind(this);
	};
	
	async componentDidMount(){
		const {sdk} = this.props;
		const {locales} = sdk;
		const response = await fetch('https://restcountries.eu/rest/v2/all');
		let countryObj = {};
		
		if(response.ok)
		{
			let countries = await response.json();
			
			countries.forEach(c => {
				let country = {
					en: c.name
				}
				
				locales.available.forEach(a => {
					if(a !== 'en')
					{
						if(typeof c.translations[a.toLowerCase()] === 'string')
						{
							country[a] = c.translations[a.toLowerCase()];
						}
						else
						{
							country[a] = c.name;
						}
					}
				});
				
				countryObj[c.alpha2Code] = country;
			});
			
			this.setState({countries: countryObj});
		}
		else
		{
			const {status, statusText} = response;
			console.log({status, statusText});
		}
	}
	
	async handleCountryChange({change}){
		const {sdk} = this.props;
		const {countries} = this.state;
		change = change.target.value;
		const country = {
			countryCode: change,
			name: countries[change]
		};
				
		sdk.field.setValue({country}).then(v => {
			this.setState({...v});
			console.log({handleCountryChange: v});
		});
	}
	
	render(){
		const {sdk} = this.props;
		const defaultLocale = sdk.locales.default;
		const {country} = this.state;
		const {countries} = this.state;
		const parsedCountries = getCountriesAsArr({countries, defaultLocale});
		
		const options = getOptions({arr: parsedCountries});
		
		sdk.window.updateHeight(50);
		
		return (
			<Select
				id={'country'}
				value={country.countryCode}
				onChange={(change) => {this.handleCountryChange({change})}}>
				{options}
			</Select>
		);
	}; 
};

export default Field;