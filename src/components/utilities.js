import React from 'react';
import {Option} from '@contentful/forma-36-react-components';


const sortByTextProp = (a, b) => {
	
	if (a.text > b.text) {
		return 1;
	}
	
	if (a.text < b.text) {
		return -1;
	}
	
	return 0;		
};


export const getCountriesAsArr = ({countries, defaultLocale}) => {
	
	let output = [];
	
	for(let k in countries)
	{
		output.push({
			text: countries[k][defaultLocale] || countries[k].en,
			value: k
		});
	}	

	return output.sort(sortByTextProp);
};

export const getOptions = ({arr}) => {
	return (Array.isArray(arr)) 
		? arr.map((r, i) => {
				const {value, text} = r;
				return <Option key={value} value={value}>{text ? text : '--'}</Option>;
		})
		: [<Option key={'0'} value={''}>{''}</Option>];
};